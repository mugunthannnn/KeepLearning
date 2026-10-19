import os
import json
import asyncio
import logging
from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.config import settings

logger = logging.getLogger("keeplearning.database")

# In-file fallback collection that mirrors Motor async collection interface
class LocalAsyncCollection:
    def __init__(self, filepath: str, name: str):
        self.filepath = filepath
        self.name = name
        self._lock = asyncio.Lock()
        self._data: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, 'r', encoding='utf-8') as f:
                    self._data = json.load(f)
            except Exception as e:
                logger.error(f"Error loading {self.filepath}: {e}")
                self._data = []
        else:
            self._data = []

    def _save(self):
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        with open(self.filepath, 'w', encoding='utf-8') as f:
            json.dump(self._data, f, indent=2, default=str)

    def _matches(self, doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
        for k, v in query.items():
            if k == "$or" and isinstance(v, list):
                if not any(self._matches(doc, sub_q) for sub_q in v):
                    return False
                continue
            if k == "$and" and isinstance(v, list):
                if not all(self._matches(doc, sub_q) for sub_q in v):
                    return False
                continue
            
            doc_val = doc.get(k)
            if isinstance(v, dict):
                # Simple operator support
                for op, op_val in v.items():
                    if op == "$in" and doc_val not in op_val:
                        return False
                    elif op == "$nin" and doc_val in op_val:
                        return False
                    elif op == "$ne" and doc_val == op_val:
                        return False
                    elif op == "$gt" and not (doc_val is not None and doc_val > op_val):
                        return False
                    elif op == "$gte" and not (doc_val is not None and doc_val >= op_val):
                        return False
                    elif op == "$lt" and not (doc_val is not None and doc_val < op_val):
                        return False
                    elif op == "$lte" and not (doc_val is not None and doc_val <= op_val):
                        return False
            elif doc_val != v:
                return False
        return True

    async def find_one(self, query: Dict[str, Any], projection: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        async with self._lock:
            for doc in self._data:
                if self._matches(doc, query):
                    res = dict(doc)
                    if projection and projection.get("_id") == 0:
                        res.pop("_id", None)
                    return res
            return None

    def find(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None):
        query = query or {}
        class Cursor:
            def __init__(self, parent, q, proj):
                self.parent = parent
                self.q = q
                self.proj = proj
                self._sort_key = None
                self._sort_dir = 1
                self._limit = None

            def sort(self, key_or_list, direction=1):
                if isinstance(key_or_list, list) and key_or_list:
                    self._sort_key = key_or_list[0][0]
                    self._sort_dir = key_or_list[0][1]
                else:
                    self._sort_key = key_or_list
                    self._sort_dir = direction
                return self

            def limit(self, n: int):
                self._limit = n
                return self

            async def to_list(self, length: Optional[int] = None) -> List[Dict[str, Any]]:
                async with self.parent._lock:
                    matched = [dict(d) for d in self.parent._data if self.parent._matches(d, self.q)]
                    if self._sort_key:
                        matched.sort(key=lambda x: x.get(self._sort_key, ""), reverse=(self._sort_dir == -1))
                    if self._limit:
                        matched = matched[:self._limit]
                    elif length:
                        matched = matched[:length]
                    return matched

            def __aiter__(self):
                self._iter_data = None
                self._idx = 0
                return self

            async def __anext__(self):
                if self._iter_data is None:
                    self._iter_data = await self.to_list()
                if self._idx < len(self._iter_data):
                    item = self._iter_data[self._idx]
                    self._idx += 1
                    return item
                raise StopAsyncIteration

        return Cursor(self, query, projection)

    async def insert_one(self, document: Dict[str, Any]):
        async with self._lock:
            doc = dict(document)
            if "_id" not in doc:
                import uuid
                doc["_id"] = str(uuid.uuid4())
            self._data.append(doc)
            self._save()
            class InsertResult:
                def __init__(self, inserted_id):
                    self.inserted_id = inserted_id
            return InsertResult(doc["_id"])

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
        async with self._lock:
            matched_idx = -1
            for idx, doc in enumerate(self._data):
                if self._matches(doc, query):
                    matched_idx = idx
                    break

            class UpdateResult:
                def __init__(self, matched_count, modified_count, upserted_id=None):
                    self.matched_count = matched_count
                    self.modified_count = modified_count
                    self.upserted_id = upserted_id

            if matched_idx >= 0:
                target = self._data[matched_idx]
                if "$set" in update:
                    for k, v in update["$set"].items():
                        target[k] = v
                if "$inc" in update:
                    for k, v in update["$inc"].items():
                        target[k] = target.get(k, 0) + v
                if "$push" in update:
                    for k, v in update["$push"].items():
                        if k not in target or not isinstance(target[k], list):
                            target[k] = []
                        target[k].append(v)
                self._save()
                return UpdateResult(1, 1)
            elif upsert:
                new_doc = dict(query)
                if "$set" in update:
                    new_doc.update(update["$set"])
                import uuid
                new_id = str(uuid.uuid4())
                new_doc["_id"] = new_id
                self._data.append(new_doc)
                self._save()
                return UpdateResult(0, 0, new_id)
            return UpdateResult(0, 0)

    async def delete_one(self, query: Dict[str, Any]):
        async with self._lock:
            for idx, doc in enumerate(self._data):
                if self._matches(doc, query):
                    self._data.pop(idx)
                    self._save()
                    class DeleteResult:
                        deleted_count = 1
                    return DeleteResult()
            class DeleteResultZero:
                deleted_count = 0
            return DeleteResultZero()

    async def count_documents(self, query: Optional[Dict[str, Any]] = None) -> int:
        query = query or {}
        async with self._lock:
            return sum(1 for d in self._data if self._matches(d, query))

    async def create_index(self, keys, **kwargs):
        # Index creation stub for compatibility
        return "index_ok"


class DatabaseManager:
    def __init__(self):
        self.is_real_mongo: bool = False
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self._collections: Dict[str, Any] = {}

    async def connect(self):
        try:
            logger.info(f"Attempting connection to MongoDB at {settings.MONGO_URI}...")
            client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=1500)
            # Ping database to test real connectivity
            await client.admin.command('ping')
            self.client = client
            self.db = self.client[settings.DB_NAME]
            self.is_real_mongo = True
            logger.info("Successfully connected to real MongoDB server.")
        except Exception as e:
            logger.warning(f"Real MongoDB server not reachable ({e}). Falling back to local persistent document store.")
            self.is_real_mongo = False
            self.db = None

    def get_collection(self, name: str):
        if self.is_real_mongo and self.db is not None:
            return self.db[name]
        
        if name not in self._collections:
            filepath = os.path.join(settings.DATA_DIR, f"{name}.json")
            self._collections[name] = LocalAsyncCollection(filepath, name)
        return self._collections[name]

    async def close(self):
        if self.client:
            self.client.close()

db_manager = DatabaseManager()

def get_collection(name: str):
    return db_manager.get_collection(name)
