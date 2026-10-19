# Seed curriculum for keepLearning platform
SEED_SUBJECTS = [
    {
        "id": "java",
        "name": "Java Programming",
        "category": "Languages",
        "iconName": "Code2",
        "knowledge": 82,
        "retention": 88,
        "topicCount": 2,
        "completedTopics": 1,
        "riskLevel": "Low",
        "lastStudied": "1 day ago",
        "description": "Core Java concepts, Collections framework, OOP principles, and Stream API.",
        "color": "#14B8A6"
    },
    {
        "id": "sql",
        "name": "SQL & Databases",
        "category": "Databases",
        "iconName": "Database",
        "knowledge": 76,
        "retention": 79,
        "topicCount": 1,
        "completedTopics": 1,
        "riskLevel": "Medium",
        "lastStudied": "Yesterday",
        "description": "Relational database queries, JOINs, indexing, normalization, and aggregation.",
        "color": "#38BDF8"
    },
    {
        "id": "ds",
        "name": "Data Structures",
        "category": "Computer Science",
        "iconName": "Binary",
        "knowledge": 64,
        "retention": 71,
        "topicCount": 2,
        "completedTopics": 1,
        "riskLevel": "High",
        "lastStudied": "3 days ago",
        "description": "Arrays, HashMaps, Linked Lists, Trees, Graphs, and Algorithmic Complexity.",
        "color": "#F59E0B"
    },
    {
        "id": "springboot",
        "name": "Spring Boot & Microservices",
        "category": "Backend",
        "iconName": "Server",
        "knowledge": 51,
        "retention": 62,
        "topicCount": 1,
        "completedTopics": 0,
        "riskLevel": "Critical",
        "lastStudied": "8 days ago",
        "description": "Spring Core, Dependency Injection, REST APIs, Spring Security, and JPA/Hibernate.",
        "color": "#EF4444"
    }
]

SEED_TOPICS = [
    {
        "id": "hashmap",
        "subjectId": "ds",
        "subjectName": "Data Structures",
        "name": "HashMap Internal Mechanics",
        "knowledge": 64,
        "driftProbability": 78,
        "stability": "Medium",
        "riskLevel": "High",
        "lastPracticed": "5 days ago",
        "lastPracticedDaysAgo": 5,
        "accuracy": 68,
        "revisionTimeMinutes": 20,
        "recommendedQuestions": 5,
        "description": "Understanding hash codes, bucket indexing, collision resolution using linked lists and red-black trees, load factor, and rehashing.",
        "riskFactors": [
            "5 days since last practice session",
            "Recent quiz accuracy dropped below 70%",
            "Collision resolution logic showed high latency"
        ],
        "concepts": [
            {"name": "Hashing & Bucket Indexing", "score": 90, "status": "Strong"},
            {"name": "Collision Handling (Chaining)", "score": 60, "status": "Needs Review"},
            {"name": "HashMap Methods (put/get)", "score": 55, "status": "At Risk"},
            {"name": "Treeify Threshold & Rehashing", "score": 50, "status": "At Risk"}
        ],
        "lesson": {
            "title": "Understanding HashMap Implementation & Operations",
            "content": "A HashMap in Java relies on an array of Node buckets to store key-value pairs. Key computation uses hashCode() transformed by bitwise operations to fit into bucket capacity.\n\nKey Concepts:\n1. Bucket Array: Array of Node<K,V> initialized with default capacity of 16.\n2. Index Calculation: index = (n - 1) & hash, where hash = key.hashCode() ^ (key.hashCode() >>> 16).\n3. Collision Resolution: When two distinct keys compute to the same bucket index, Java 8+ links them in a LinkedList. If bucket size exceeds TREEIFY_THRESHOLD (8), it converts to a Red-Black Tree for O(log n) performance.\n4. Load Factor & Rehashing: Default load factor is 0.75. When size exceeds capacity * loadFactor, array doubles and all entries are rehashed.",
            "codeSnippet": "// HashMap internal bucket and lookup mechanics\nHashMap<String, Integer> map = new HashMap<>();\nmap.put(\"Java\", 95);\nmap.put(\"SQL\", 80);\n\n// Conceptual bucket index calculation\nint hash = key.hashCode();\nint index = (capacity - 1) & (hash ^ (hash >>> 16));"
        }
    },
    {
        "id": "sql-joins",
        "subjectId": "sql",
        "subjectName": "SQL & Databases",
        "name": "SQL JOIN Operations",
        "knowledge": 70,
        "driftProbability": 62,
        "stability": "Medium",
        "riskLevel": "Medium",
        "lastPracticed": "4 days ago",
        "lastPracticedDaysAgo": 4,
        "accuracy": 74,
        "revisionTimeMinutes": 15,
        "recommendedQuestions": 5,
        "description": "INNER, LEFT OUTER, RIGHT OUTER, FULL OUTER JOINs, and cross joins with multi-table conditions.",
        "riskFactors": [
            "4 days since last practice",
            "Outer join NULL behavior confusion during last assessment"
        ],
        "concepts": [
            {"name": "INNER JOIN syntax", "score": 88, "status": "Strong"},
            {"name": "LEFT / RIGHT JOIN NULL handling", "score": 62, "status": "Needs Review"},
            {"name": "FULL OUTER JOIN emulation", "score": 58, "status": "At Risk"},
            {"name": "Self JOINs", "score": 72, "status": "Stable"}
        ],
        "lesson": {
            "title": "Mastering Relational JOIN Operations",
            "content": "SQL JOIN clauses combine columns from one or more tables based on a related column between them.\n\nTypes of JOINs:\n1. INNER JOIN: Returns records that have matching values in both tables.\n2. LEFT (OUTER) JOIN: Returns all records from the left table, and matched records from right table. Unmatched right side returns NULL.\n3. RIGHT (OUTER) JOIN: Returns all records from right table, and matched from left table.\n4. FULL (OUTER) JOIN: Returns all records when there is a match in left or right table.",
            "codeSnippet": "SELECT e.employee_id, e.name, d.department_name\nFROM employees e\nLEFT JOIN departments d ON e.department_id = d.department_id\nWHERE d.location = 'New York';"
        }
    },
    {
        "id": "spring-security",
        "subjectId": "springboot",
        "subjectName": "Spring Boot & Microservices",
        "name": "Spring Security & JWT Authentication",
        "knowledge": 48,
        "driftProbability": 84,
        "stability": "Low",
        "riskLevel": "Critical",
        "lastPracticed": "8 days ago",
        "lastPracticedDaysAgo": 8,
        "accuracy": 52,
        "revisionTimeMinutes": 25,
        "recommendedQuestions": 6,
        "description": "SecurityFilterChain architecture, JWT generation & validation filter, UserDetailsService implementation, and Method Security.",
        "riskFactors": [
            "8 days without practice session",
            "Low initial retention score (52%)",
            "High probability of severe knowledge decay within 48 hours"
        ],
        "concepts": [
            {"name": "SecurityFilterChain Config", "score": 55, "status": "Needs Review"},
            {"name": "JWT Token Generation & Claims", "score": 45, "status": "Critical"},
            {"name": "OncePerRequestFilter Filter", "score": 40, "status": "Critical"},
            {"name": "AuthenticationManager & Providers", "score": 50, "status": "At Risk"}
        ],
        "lesson": {
            "title": "Configuring SecurityFilterChain and JWT Filters",
            "content": "Spring Security 6 relies on SecurityFilterChain bean configuration rather than WebSecurityConfigurerAdapter.\n\nArchitecture Overview:\n1. DelegatingFilterProxy passes requests into SecurityFilterChain.\n2. Custom JwtAuthenticationFilter intercepts request before UsernamePasswordAuthenticationFilter.\n3. Claims are extracted from Bearer Token header using JWT library.\n4. SecurityContextHolder.getContext().setAuthentication(authToken) sets authenticated principal.",
            "codeSnippet": "@Bean\npublic SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n    return http\n        .csrf(csrf -> csrf.disable())\n        .authorizeHttpRequests(auth -> auth\n            .requestMatchers(\"/api/auth/**\").permitAll()\n            .anyRequest().authenticated()\n        )\n        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)\n        .build();\n}"
        }
    },
    {
        "id": "arraylist",
        "subjectId": "java",
        "subjectName": "Java Programming",
        "name": "ArrayList & Dynamic Resizing",
        "knowledge": 88,
        "driftProbability": 15,
        "stability": "High",
        "riskLevel": "Low",
        "lastPracticed": "1 day ago",
        "lastPracticedDaysAgo": 1,
        "accuracy": 92,
        "revisionTimeMinutes": 10,
        "recommendedQuestions": 3,
        "description": "Internal Object[] array, initial capacity, grow algorithm (1.5x), and Iterator fast-fail behavior.",
        "riskFactors": [
            "Frequent recent practice",
            "High historical accuracy"
        ],
        "concepts": [
            {"name": "Dynamic Array Resizing", "score": 94, "status": "Strong"},
            {"name": "Capacity vs Size", "score": 90, "status": "Strong"},
            {"name": "Fail-Fast Iterators", "score": 85, "status": "Stable"}
        ],
        "lesson": {
            "title": "ArrayList Internal Mechanics",
            "content": "ArrayList is backed by an Object[] array. When element capacity is reached, new capacity = oldCapacity + (oldCapacity >> 1) (50% growth).",
            "codeSnippet": "List<String> list = new ArrayList<>(20);\nlist.add(\"Data\");"
        }
    },
    {
        "id": "java-streams",
        "subjectId": "java",
        "subjectName": "Java Programming",
        "name": "Java 8+ Streams API & Collectors",
        "knowledge": 84,
        "driftProbability": 22,
        "stability": "High",
        "riskLevel": "Low",
        "lastPracticed": "2 days ago",
        "lastPracticedDaysAgo": 2,
        "accuracy": 86,
        "revisionTimeMinutes": 15,
        "recommendedQuestions": 4,
        "description": "Intermediate ops (map, filter, flatMap) vs Terminal ops (collect, reduce), Collectors.groupingBy.",
        "riskFactors": [
            "Consistent strong score on functional pipeline syntax"
        ],
        "concepts": [
            {"name": "Filter & Map Pipelines", "score": 90, "status": "Strong"},
            {"name": "Collectors.groupingBy", "score": 80, "status": "Stable"},
            {"name": "FlatMap vs Map", "score": 82, "status": "Stable"}
        ],
        "lesson": {
            "title": "Declarative Data Processing with Streams",
            "content": "Streams allow lazy evaluation. Intermediate operations build execution pipeline, executed only when terminal operation is invoked.",
            "codeSnippet": "Map<String, List<Product>> byCategory = products.stream()\n    .filter(p -> p.getPrice() > 100)\n    .collect(Collectors.groupingBy(Product::getCategory));"
        }
    },
    {
        "id": "binary-trees",
        "subjectId": "ds",
        "subjectName": "Data Structures",
        "name": "Binary Search Tree Traversals & Balancing",
        "knowledge": 58,
        "driftProbability": 75,
        "stability": "Low",
        "riskLevel": "High",
        "lastPracticed": "6 days ago",
        "lastPracticedDaysAgo": 6,
        "accuracy": 62,
        "revisionTimeMinutes": 20,
        "recommendedQuestions": 5,
        "description": "In-order, Pre-order, Post-order traversals, height calculation, BST insertion & deletion, AVL rotation basics.",
        "riskFactors": [
            "6 days since last review",
            "Post-order recursive stack logic confusion"
        ],
        "concepts": [
            {"name": "In-Order Traversal (Sorted)", "score": 75, "status": "Stable"},
            {"name": "Post-Order & Level-Order BFS", "score": 50, "status": "At Risk"},
            {"name": "BST Node Deletion 3 cases", "score": 48, "status": "Critical"}
        ],
        "lesson": {
            "title": "Binary Tree Algorithms & DFS/BFS Traversals",
            "content": "Binary Trees maintain parent-child node pointers. Traversal order determines data visiting sequence.",
            "codeSnippet": "void inOrder(Node root) {\n    if (root == null) return;\n    inOrder(root.left);\n    System.out.print(root.val + \" \");\n    inOrder(root.right);\n}"
        }
    }
]

SEED_QUIZZES = {
    "hashmap": {
        "topicId": "hashmap",
        "topicName": "HashMap Internal Mechanics",
        "subjectName": "Data Structures",
        "questions": [
            {
                "id": "q1",
                "question": "What is the default initial capacity of a Java HashMap if not specified in the constructor?",
                "options": ["8", "16", "32", "64"],
                "correctAnswer": 1,
                "explanation": "Java HashMap defaults to an initial capacity of 16 (which is 1 << 4), and a load factor of 0.75."
            },
            {
                "id": "q2",
                "question": "Starting from Java 8, when does a bucket in HashMap convert from a LinkedList to a Red-Black Tree?",
                "options": [
                    "When the total HashMap size exceeds 100 entries",
                    "When a bucket contains 4 nodes",
                    "When a bucket contains 8 nodes AND total table capacity is at least 64",
                    "Whenever a collision occurs"
                ],
                "correctAnswer": 2,
                "explanation": "TREEIFY_THRESHOLD is 8. When 8 elements collide in the same bucket and capacity >= 64, it treeifies to balance search complexity to O(log n)."
            },
            {
                "id": "q3",
                "question": "How is the bucket index calculated in HashMap for a given key?",
                "options": [
                    "index = key.hashCode() % capacity",
                    "index = (capacity - 1) & hash",
                    "index = key.hashCode() * capacity",
                    "index = hash / capacity"
                ],
                "correctAnswer": 1,
                "explanation": "Because capacity is always a power of 2, bitwise AND (capacity - 1) & hash is equivalent to modulo, but much faster."
            },
            {
                "id": "q4",
                "question": "What happens when a HashMap size exceeds capacity * loadFactor?",
                "options": [
                    "An OutOfMemoryException is immediately thrown",
                    "New put operations are rejected",
                    "The table capacity doubles and all elements are rehashed into new buckets",
                    "The load factor decreases automatically"
                ],
                "correctAnswer": 2,
                "explanation": "Rehashing occurs: a new table with 2x capacity is allocated and nodes are redistributed."
            },
            {
                "id": "q5",
                "question": "Why should mutable objects be avoided as HashMap keys?",
                "options": [
                    "They consume double memory",
                    "Modifying an object's fields changes its hashCode, making it unretrievable from its original bucket",
                    "HashMap throws a ConcurrentModificationException",
                    "Mutable keys disable Red-Black tree conversion"
                ],
                "correctAnswer": 1,
                "explanation": "If a key's fields mutate after insertion, its computed bucket index changes, causing get() calls to look in the wrong bucket."
            }
        ]
    },
    "sql-joins": {
        "topicId": "sql-joins",
        "topicName": "SQL JOIN Operations",
        "subjectName": "SQL & Databases",
        "questions": [
            {
                "id": "sq1",
                "question": "Which JOIN returns all rows from the left table and matching rows from the right table, filling NULLs for non-matches?",
                "options": ["INNER JOIN", "RIGHT JOIN", "LEFT (OUTER) JOIN", "CROSS JOIN"],
                "correctAnswer": 2,
                "explanation": "LEFT OUTER JOIN preserves all left-table rows regardless of whether a match exists on the right table."
            },
            {
                "id": "sq2",
                "question": "What is the Cartesian product result of CROSS JOINing Table A (10 rows) and Table B (5 rows)?",
                "options": ["15 rows", "50 rows", "5 rows", "10 rows"],
                "correctAnswer": 1,
                "explanation": "A CROSS JOIN multiplies rows from Table A by Table B: 10 * 5 = 50 rows."
            },
            {
                "id": "sq3",
                "question": "How do you emulate FULL OUTER JOIN in databases like MySQL that do not natively support it?",
                "options": [
                    "Combine LEFT JOIN and RIGHT JOIN using UNION",
                    "Use CROSS JOIN with WHERE NOT NULL",
                    "Use INNER JOIN with HAVING count(*) > 1",
                    "FULL OUTER JOIN is natively built into all MySQL versions"
                ],
                "correctAnswer": 0,
                "explanation": "UNION combines the result of LEFT JOIN and RIGHT JOIN while deduplicating exact row matches."
            }
        ]
    },
    "spring-security": {
        "topicId": "spring-security",
        "topicName": "Spring Security & JWT Authentication",
        "subjectName": "Spring Boot & Microservices",
        "questions": [
            {
                "id": "sec1",
                "question": "Which class should custom JWT filters extend to ensure single execution per HTTP request in Spring Security?",
                "options": ["GenericFilterBean", "OncePerRequestFilter", "AuthenticationFilter", "HttpServletFilter"],
                "correctAnswer": 1,
                "explanation": "OncePerRequestFilter guarantees the filter logic executes exactly once per dispatch request."
            },
            {
                "id": "sec2",
                "question": "Where is the authenticated user Authentication object stored during a web request in Spring Security?",
                "options": [
                    "HttpSession attributes only",
                    "SecurityContextHolder.getContext().getAuthentication()",
                    "Database session cache",
                    "Spring ApplicationContext"
                ],
                "correctAnswer": 1,
                "explanation": "Thread-local SecurityContextHolder stores the active Authentication token for the current thread."
            }
        ]
    },
    "arraylist": {
        "topicId": "arraylist",
        "topicName": "ArrayList & Dynamic Resizing",
        "subjectName": "Java Programming",
        "questions": [
            {
                "id": "al1",
                "question": "What is the resizing factor in Java 8+ ArrayList when the internal capacity is exceeded?",
                "options": ["Double (2.0x)", "50% increase (1.5x)", "10 elements added", "Tripled (3.0x)"],
                "correctAnswer": 1,
                "explanation": "Java ArrayList grows by oldCapacity + (oldCapacity >> 1), which is approximately a 1.5x increase."
            },
            {
                "id": "al2",
                "question": "Why does ArrayList throw ConcurrentModificationException during iteration?",
                "options": [
                    "Because elements are null",
                    "Due to structural modification detected via modCount check in fail-fast iterator",
                    "Because of memory overflow",
                    "Because it is synchronized"
                ],
                "correctAnswer": 1,
                "explanation": "Iterators compare expectedModCount with modCount. Structural changes during iteration violate this check."
            }
        ]
    },
    "java-streams": {
        "topicId": "java-streams",
        "topicName": "Java 8+ Streams API & Collectors",
        "subjectName": "Java Programming",
        "questions": [
            {
                "id": "st1",
                "question": "Which of the following is a terminal operation in Java Streams?",
                "options": ["filter()", "map()", "collect()", "peek()"],
                "correctAnswer": 2,
                "explanation": "collect() triggers pipeline execution and consumes the stream, making it a terminal operation."
            }
        ]
    },
    "binary-trees": {
        "topicId": "binary-trees",
        "topicName": "Binary Search Tree Traversals & Balancing",
        "subjectName": "Data Structures",
        "questions": [
            {
                "id": "bt1",
                "question": "Which depth-first traversal of a Binary Search Tree produces values in strictly sorted ascending order?",
                "options": ["Pre-order (Root, Left, Right)", "In-order (Left, Root, Right)", "Post-order (Left, Right, Root)", "Level-order (BFS)"],
                "correctAnswer": 1,
                "explanation": "In-order traversal visits Left subtree, then Root, then Right subtree, producing sorted output for a BST."
            }
        ]
    }
}
