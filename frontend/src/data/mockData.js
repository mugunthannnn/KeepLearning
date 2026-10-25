export const initialMockUser = {
  name: "Mugunthan M",
  role: "Computer Science Student",
  email: "mugunthan@keeplearning.io",
  avatarUrl: null,
  knowledgeScore: 72,
  retentionRate: 81,
  topicsAtRiskCount: 3,
  learningStreak: 12,
  onboarded: true,
  preferences: {
    dailyGoalMinutes: 30,
    experienceLevel: "Intermediate",
    goal: "Interview preparation & Skill Mastery",
    preferredSubjects: ["Java", "SQL", "Data Structures", "Spring Boot"],
    emailAlerts: true,
    driftAlerts: true,
    weeklySummary: true,
    theme: "light"
  }
};

export const initialSubjects = [
  {
    id: "java",
    name: "Java Programming",
    category: "Languages",
    iconName: "Code2",
    knowledge: 82,
    retention: 88,
    topicCount: 7,
    completedTopics: 6,
    riskLevel: "Low",
    lastStudied: "2 hours ago",
    description: "Core Java concepts, Collections framework, OOP principles, and Stream API.",
    color: "#14B8A6"
  },
  {
    id: "sql",
    name: "SQL & Databases",
    category: "Databases",
    iconName: "Database",
    knowledge: 76,
    retention: 79,
    topicCount: 6,
    completedTopics: 4,
    riskLevel: "Medium",
    lastStudied: "Yesterday",
    description: "Relational database queries, JOINs, indexing, normalization, and aggregation.",
    color: "#38BDF8"
  },
  {
    id: "ds",
    name: "Data Structures",
    category: "Computer Science",
    iconName: "Binary",
    knowledge: 64,
    retention: 71,
    topicCount: 8,
    completedTopics: 5,
    riskLevel: "High",
    lastStudied: "3 days ago",
    description: "Arrays, HashMaps, Linked Lists, Trees, Graphs, and Algorithmic Complexity.",
    color: "#F59E0B"
  },
  {
    id: "springboot",
    name: "Spring Boot & Microservices",
    category: "Backend",
    iconName: "Server",
    knowledge: 51,
    retention: 62,
    topicCount: 5,
    completedTopics: 2,
    riskLevel: "Critical",
    lastStudied: "8 days ago",
    description: "Spring Core, Dependency Injection, REST APIs, Spring Security, and JPA/Hibernate.",
    color: "#EF4444"
  }
];

export const initialTopics = [
  {
    id: "hashmap",
    subjectId: "ds",
    subjectName: "Data Structures",
    name: "HashMap Internal Mechanics",
    knowledge: 64,
    driftProbability: 78,
    stability: "Medium",
    riskLevel: "High",
    lastPracticed: "5 days ago",
    lastPracticedDaysAgo: 5,
    accuracy: 68,
    revisionTimeMinutes: 20,
    recommendedQuestions: 5,
    description: "Understanding hash codes, bucket indexing, collision resolution using linked lists and red-black trees, load factor, and rehashing.",
    riskFactors: [
      "5 days since last practice session",
      "Recent quiz accuracy dropped by 14%",
      "Average answer response time increased significantly",
      "Only 1 revision completed in the last 2 weeks"
    ],
    forecastData: [
      { day: "Today", knowledge: 64, predictedWithoutRev: 64, predictedWithRev: 85 },
      { day: "+3 Days", knowledge: 60, predictedWithoutRev: 60, predictedWithRev: 83 },
      { day: "+7 Days", knowledge: 53, predictedWithoutRev: 53, predictedWithRev: 81 },
      { day: "+10 Days", knowledge: 48, predictedWithoutRev: 48, predictedWithRev: 80 },
      { day: "+14 Days", knowledge: 45, predictedWithoutRev: 45, predictedWithRev: 78 }
    ],
    concepts: [
      { name: "Hashing & Bucket Indexing", score: 90, status: "Strong" },
      { name: "Collision Handling (Chaining)", score: 60, status: "Needs Review" },
      { name: "HashMap Methods (put/get)", score: 55, status: "At Risk" },
      { name: "Treeify Threshold & Rehashing", score: 50, status: "At Risk" }
    ],
    lesson: {
      title: "Understanding HashMap Implementation & Operations",
      content: `A HashMap in Java relies on an array of Node buckets to store key-value pairs. Key computation uses hashCode() transformed by bitwise operations to fit into the bucket capacity.
      
Key Concepts:
1. Bucket Array: Array of Node<K,V> initialized with default capacity of 16.
2. Index Calculation: index = (n - 1) & hash, where hash = key.hashCode() ^ (key.hashCode() >>> 16).
3. Collision Resolution: When two distinct keys compute to the same bucket index, Java 8+ links them in a LinkedList. If bucket size exceeds TREEIFY_THRESHOLD (8), it converts to a Red-Black Tree for O(log n) performance.
4. Load Factor & Rehashing: Default load factor is 0.75. When size exceeds capacity * loadFactor, array doubles and all entries are rehashed.`,
      codeSnippet: `// Example HashMap declaration and operations
HashMap<String, Integer> map = new HashMap<>();
map.put("Java", 95);
map.put("SQL", 80);

// Key collision handling logic (conceptual)
int hash = key.hashCode();
int index = (n - 1) & (hash ^ (hash >>> 16));`
    }
  },
  {
    id: "sql-joins",
    subjectId: "sql",
    subjectName: "SQL & Databases",
    name: "SQL JOIN Operations",
    knowledge: 70,
    driftProbability: 62,
    stability: "Medium",
    riskLevel: "Medium",
    lastPracticed: "4 days ago",
    lastPracticedDaysAgo: 4,
    accuracy: 74,
    revisionTimeMinutes: 15,
    recommendedQuestions: 5,
    description: "INNER, LEFT OUTER, RIGHT OUTER, FULL OUTER JOINs, and cross joins with multi-table conditions.",
    riskFactors: [
      "4 days since last practice",
      "Outer join NULL behavior confusion during last assessment",
      "Moderate response delay on complex multi-table joins"
    ],
    forecastData: [
      { day: "Today", knowledge: 70, predictedWithoutRev: 70, predictedWithRev: 88 },
      { day: "+3 Days", knowledge: 66, predictedWithoutRev: 66, predictedWithRev: 86 },
      { day: "+7 Days", knowledge: 60, predictedWithoutRev: 60, predictedWithRev: 85 },
      { day: "+10 Days", knowledge: 55, predictedWithoutRev: 55, predictedWithRev: 83 },
      { day: "+14 Days", knowledge: 50, predictedWithoutRev: 50, predictedWithRev: 82 }
    ],
    concepts: [
      { name: "INNER JOIN syntax", score: 88, status: "Strong" },
      { name: "LEFT / RIGHT JOIN NULL handling", score: 62, status: "Needs Review" },
      { name: "FULL OUTER JOIN emulation", score: 58, status: "At Risk" },
      { name: "Self JOINs", score: 72, status: "Stable" }
    ],
    lesson: {
      title: "Mastering Relational JOIN Operations",
      content: `SQL JOIN clauses combine columns from one or more tables based on a related column between them.

Types of JOINs:
1. INNER JOIN: Returns records that have matching values in both tables.
2. LEFT (OUTER) JOIN: Returns all records from the left table, and matched records from right table. Unmatched right side returns NULL.
3. RIGHT (OUTER) JOIN: Returns all records from right table, and matched from left table.
4. FULL (OUTER) JOIN: Returns all records when there is a match in left or right table.`,
      codeSnippet: `SELECT e.employee_id, e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
WHERE d.location = 'New York';`
    }
  },
  {
    id: "spring-security",
    subjectId: "springboot",
    subjectName: "Spring Boot & Microservices",
    name: "Spring Security & JWT Authentication",
    knowledge: 48,
    driftProbability: 84,
    stability: "Low",
    riskLevel: "Critical",
    lastPracticed: "8 days ago",
    lastPracticedDaysAgo: 8,
    accuracy: 52,
    revisionTimeMinutes: 25,
    recommendedQuestions: 6,
    description: "SecurityFilterChain architecture, JWT generation & validation filter, UserDetailsService implementation, and Method Security.",
    riskFactors: [
      "8 days without practice session",
      "Low initial retention score (52%)",
      "High probability of severe knowledge decay within 48 hours",
      "Critical prerequisite for backend web development"
    ],
    forecastData: [
      { day: "Today", knowledge: 48, predictedWithoutRev: 48, predictedWithRev: 80 },
      { day: "+3 Days", knowledge: 42, predictedWithoutRev: 42, predictedWithRev: 78 },
      { day: "+7 Days", knowledge: 35, predictedWithoutRev: 35, predictedWithRev: 76 },
      { day: "+10 Days", knowledge: 29, predictedWithoutRev: 29, predictedWithRev: 74 },
      { day: "+14 Days", knowledge: 24, predictedWithoutRev: 24, predictedWithRev: 72 }
    ],
    concepts: [
      { name: "SecurityFilterChain Config", score: 55, status: "Needs Review" },
      { name: "JWT Token Generation & Claims", score: 45, status: "Critical" },
      { name: "OncePerRequestFilter Filter", score: 40, status: "Critical" },
      { name: "AuthenticationManager & Providers", score: 50, status: "At Risk" }
    ],
    lesson: {
      title: "Configuring SecurityFilterChain and JWT Filters",
      content: `Spring Security 6 relies on SecurityFilterChain bean configuration rather than WebSecurityConfigurerAdapter.

Architecture Overview:
1. DelegatingFilterProxy passes requests into SecurityFilterChain.
2. Custom JwtAuthenticationFilter intercepts request before UsernamePasswordAuthenticationFilter.
3. Claims are extracted from Bearer Token header using io.jsonwebtoken library.
4. SecurityContextHolder.getContext().setAuthentication(authToken) sets authenticated principal.`,
      codeSnippet: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}`
    }
  },
  {
    id: "arraylist",
    subjectId: "java",
    subjectName: "Java Programming",
    name: "ArrayList & Dynamic Resizing",
    knowledge: 88,
    driftProbability: 15,
    stability: "High",
    riskLevel: "Low",
    lastPracticed: "1 day ago",
    lastPracticedDaysAgo: 1,
    accuracy: 92,
    revisionTimeMinutes: 10,
    recommendedQuestions: 3,
    description: "Internal Object[] array, initial capacity, grow algorithm (1.5x), and Iterator fast-fail behavior.",
    riskFactors: [
      "Frequent recent practice",
      "High historical accuracy"
    ],
    forecastData: [
      { day: "Today", knowledge: 88, predictedWithoutRev: 88, predictedWithRev: 95 },
      { day: "+3 Days", knowledge: 86, predictedWithoutRev: 86, predictedWithRev: 94 },
      { day: "+7 Days", knowledge: 84, predictedWithoutRev: 84, predictedWithRev: 93 },
      { day: "+10 Days", knowledge: 81, predictedWithoutRev: 81, predictedWithRev: 91 },
      { day: "+14 Days", knowledge: 78, predictedWithoutRev: 78, predictedWithRev: 90 }
    ],
    concepts: [
      { name: "Dynamic Array Resizing", score: 94, status: "Strong" },
      { name: "Capacity vs Size", score: 90, status: "Strong" },
      { name: "Fail-Fast Iterators", score: 85, status: "Stable" }
    ],
    lesson: {
      title: "ArrayList Internal Mechanics",
      content: `ArrayList is backed by an Object[] array. When element capacity is reached, new capacity = oldCapacity + (oldCapacity >> 1) (50% growth).`,
      codeSnippet: `List<String> list = new ArrayList<>(20);
list.add("Data");`
    }
  },
  {
    id: "java-streams",
    subjectId: "java",
    subjectName: "Java Programming",
    name: "Java 8+ Streams API & Collectors",
    knowledge: 84,
    driftProbability: 22,
    stability: "High",
    riskLevel: "Low",
    lastPracticed: "2 days ago",
    lastPracticedDaysAgo: 2,
    accuracy: 86,
    revisionTimeMinutes: 15,
    recommendedQuestions: 4,
    description: "Intermediate ops (map, filter, flatMap) vs Terminal ops (collect, reduce), Collectors.groupingBy.",
    riskFactors: [
      "Consistent strong score on functional pipeline syntax"
    ],
    forecastData: [
      { day: "Today", knowledge: 84, predictedWithoutRev: 84, predictedWithRev: 94 },
      { day: "+3 Days", knowledge: 82, predictedWithoutRev: 82, predictedWithRev: 93 },
      { day: "+7 Days", knowledge: 79, predictedWithoutRev: 79, predictedWithRev: 92 },
      { day: "+10 Days", knowledge: 76, predictedWithoutRev: 76, predictedWithRev: 90 },
      { day: "+14 Days", knowledge: 73, predictedWithoutRev: 73, predictedWithRev: 88 }
    ],
    concepts: [
      { name: "Filter & Map Pipelines", score: 90, status: "Strong" },
      { name: "Collectors.groupingBy & partitioningBy", score: 80, status: "Stable" },
      { name: "FlatMap vs Map", score: 82, status: "Stable" }
    ],
    lesson: {
      title: "Declarative Data Processing with Streams",
      content: `Streams allow lazy evaluation. Intermediate operations build execution pipeline, executed only when terminal operation is invoked.`,
      codeSnippet: `Map<String, List<Product>> byCategory = products.stream()
    .filter(p -> p.getPrice() > 100)
    .collect(Collectors.groupingBy(Product::getCategory));`
    }
  },
  {
    id: "binary-trees",
    subjectId: "ds",
    subjectName: "Data Structures",
    name: "Binary Search Tree Traversals & Balancing",
    knowledge: 58,
    driftProbability: 75,
    stability: "Low",
    riskLevel: "High",
    lastPracticed: "6 days ago",
    lastPracticedDaysAgo: 6,
    accuracy: 62,
    revisionTimeMinutes: 20,
    recommendedQuestions: 5,
    description: "In-order, Pre-order, Post-order traversals, height calculation, BST insertion & deletion, AVL rotation basics.",
    riskFactors: [
      "6 days since last review",
      "Post-order recursive stack logic confusion",
      "Accuracy dropped by 18%"
    ],
    forecastData: [
      { day: "Today", knowledge: 58, predictedWithoutRev: 58, predictedWithRev: 84 },
      { day: "+3 Days", knowledge: 52, predictedWithoutRev: 52, predictedWithRev: 82 },
      { day: "+7 Days", knowledge: 44, predictedWithoutRev: 44, predictedWithRev: 80 },
      { day: "+10 Days", knowledge: 38, predictedWithoutRev: 38, predictedWithRev: 78 },
      { day: "+14 Days", knowledge: 32, predictedWithoutRev: 32, predictedWithRev: 76 }
    ],
    concepts: [
      { name: "In-Order Traversal (Sorted)", score: 75, status: "Stable" },
      { name: "Post-Order & Level-Order BFS", score: 50, status: "At Risk" },
      { name: "BST Node Deletion 3 cases", score: 48, status: "Critical" }
    ],
    lesson: {
      title: "Binary Tree Algorithms & DFS/BFS Traversals",
      content: `Binary Trees maintain parent-child node pointers. Traversal order determines data visiting sequence.`,
      codeSnippet: `void inOrder(Node root) {
    if (root == null) return;
    inOrder(root.left);
    System.out.print(root.val + " ");
    inOrder(root.right);
}`
    }
  }
];

export const initialQuizzes = {
  "hashmap": {
    topicId: "hashmap",
    topicName: "HashMap Internal Mechanics",
    subjectName: "Data Structures",
    questions: [
      {
        id: "q1",
        question: "What is the default initial capacity of a Java HashMap if not specified in the constructor?",
        options: [
          "8",
          "16",
          "32",
          "64"
        ],
        correctAnswer: 1,
        explanation: "Java HashMap defaults to an initial capacity of 16 (which is 1 << 4), and a load factor of 0.75."
      },
      {
        id: "q2",
        question: "Starting from Java 8, when does a bucket in HashMap convert from a LinkedList to a Red-Black Tree?",
        options: [
          "When the total HashMap size exceeds 100 entries",
          "When a bucket contains 4 nodes",
          "When a bucket contains 8 nodes AND total table capacity is at least 64",
          "Whenever a collision occurs"
        ],
        correctAnswer: 2,
        explanation: "TREEIFY_THRESHOLD is 8. When 8 elements collide in the same bucket and capacity >= 64, it treeifies to balance search complexity to O(log n)."
      },
      {
        id: "q3",
        question: "How is the bucket index calculated in HashMap for a given key?",
        options: [
          "index = key.hashCode() % capacity",
          "index = (capacity - 1) & hash",
          "index = key.hashCode() * capacity",
          "index = hash / capacity"
        ],
        correctAnswer: 1,
        explanation: "Because capacity is always a power of 2, bitwise AND (capacity - 1) & hash is equivalent to modulo, but much faster."
      },
      {
        id: "q4",
        question: "What happens when a HashMap size exceeds capacity * loadFactor?",
        options: [
          "An OutOfMemoryException is immediately thrown",
          "New put operations are rejected",
          "The table capacity doubles and all elements are rehashed into new buckets",
          "The load factor decreases automatically"
        ],
        correctAnswer: 2,
        explanation: "Rehashing occurs: a new table with 2x capacity is allocated and nodes are redistributed."
      },
      {
        id: "q5",
        question: "Why should mutable objects be avoided as HashMap keys?",
        options: [
          "They consume double memory",
          "Modifying an object's fields changes its hashCode, making it unretrievable from its original bucket",
          "HashMap throws a ConcurrentModificationException",
          "Mutable keys disable Red-Black tree conversion"
        ],
        correctAnswer: 1,
        explanation: "If a key's fields mutate after insertion, its computed bucket index changes, causing get() calls to look in the wrong bucket."
      }
    ]
  },
  "sql-joins": {
    topicId: "sql-joins",
    topicName: "SQL JOIN Operations",
    subjectName: "SQL & Databases",
    questions: [
      {
        id: "sq1",
        question: "Which JOIN returns all rows from the left table and matching rows from the right table, filling NULLs for non-matches?",
        options: [
          "INNER JOIN",
          "RIGHT JOIN",
          "LEFT (OUTER) JOIN",
          "CROSS JOIN"
        ],
        correctAnswer: 2,
        explanation: "LEFT OUTER JOIN preserves all left-table rows regardless of whether a match exists on the right table."
      },
      {
        id: "sq2",
        question: "What is the Cartesian product result of CROSS JOINing Table A (10 rows) and Table B (5 rows)?",
        options: [
          "15 rows",
          "50 rows",
          "5 rows",
          "10 rows"
        ],
        correctAnswer: 1,
        explanation: "A CROSS JOIN multiplies rows from Table A by Table B: 10 * 5 = 50 rows."
      },
      {
        id: "sq3",
        question: "How do you emulate FULL OUTER JOIN in databases like MySQL that do not natively support it?",
        options: [
          "Combine LEFT JOIN and RIGHT JOIN using UNION",
          "Use CROSS JOIN with WHERE NOT NULL",
          "Use INNER JOIN with HAVING count(*) > 1",
          "FULL OUTER JOIN is natively built into all MySQL versions"
        ],
        correctAnswer: 0,
        explanation: "UNION combines the result of LEFT JOIN and RIGHT JOIN while deduplicating exact row matches."
      }
    ]
  },
  "spring-security": {
    topicId: "spring-security",
    topicName: "Spring Security & JWT Authentication",
    subjectName: "Spring Boot & Microservices",
    questions: [
      {
        id: "sec1",
        question: "Which class should custom JWT filters extend to ensure single execution per HTTP request in Spring Security?",
        options: [
          "GenericFilterBean",
          "OncePerRequestFilter",
          "AuthenticationFilter",
          "HttpServletFilter"
        ],
        correctAnswer: 1,
        explanation: "OncePerRequestFilter guarantees the filter logic executes exactly once per dispatch request."
      },
      {
        id: "sec2",
        question: "Where is the authenticated user Authentication object stored during a web request in Spring Security?",
        options: [
          "HttpSession attributes only",
          "SecurityContextHolder.getContext().getAuthentication()",
          "Database session cache",
          "Spring ApplicationContext"
        ],
        correctAnswer: 1,
        explanation: "Thread-local SecurityContextHolder stores the active Authentication token for the current thread."
      }
    ]
  }
};

export const initialRevisionPlan = [
  {
    id: "rev-1",
    topicId: "hashmap",
    topicName: "HashMap Internal Mechanics",
    subjectName: "Data Structures",
    riskLevel: "High",
    driftProbability: 78,
    timeMinutes: 20,
    questionsCount: 5,
    dueDateCategory: "Today",
    dueDateLabel: "Today (Priority 1)",
    completed: false,
    reason: "Accuracy dropped by 14% & 5 days gap"
  },
  {
    id: "rev-2",
    topicId: "spring-security",
    topicName: "Spring Security & JWT",
    subjectName: "Spring Boot",
    riskLevel: "Critical",
    driftProbability: 84,
    timeMinutes: 25,
    questionsCount: 6,
    dueDateCategory: "Today",
    dueDateLabel: "Today (Priority 2)",
    completed: false,
    reason: "8 days idle gap & 48% low stability"
  },
  {
    id: "rev-3",
    topicId: "sql-joins",
    topicName: "SQL JOIN Operations",
    subjectName: "SQL & Databases",
    riskLevel: "Medium",
    driftProbability: 62,
    timeMinutes: 15,
    questionsCount: 5,
    dueDateCategory: "Tomorrow",
    dueDateLabel: "Tomorrow, 9:00 AM",
    completed: false,
    reason: "Scheduled spaced repetition window"
  },
  {
    id: "rev-4",
    topicId: "binary-trees",
    topicName: "Binary Trees Traversals",
    subjectName: "Data Structures",
    riskLevel: "High",
    driftProbability: 75,
    timeMinutes: 20,
    questionsCount: 5,
    dueDateCategory: "Tomorrow",
    dueDateLabel: "Tomorrow, 4:00 PM",
    completed: false,
    reason: "Low post-order quiz score"
  },
  {
    id: "rev-5",
    topicId: "java-streams",
    topicName: "Java Streams Collectors",
    subjectName: "Java Programming",
    riskLevel: "Low",
    driftProbability: 22,
    timeMinutes: 15,
    questionsCount: 4,
    dueDateCategory: "Friday",
    dueDateLabel: "Friday, 10:00 AM",
    completed: false,
    reason: "Routine retention check"
  }
];

export const initialActivities = [
  {
    id: "act-1",
    title: "Completed HashMap Practice Quiz",
    subtitle: "Score: 80% (+8% knowledge recovery)",
    timestamp: "12 minutes ago",
    type: "quiz",
    iconName: "CheckCircle2"
  },
  {
    id: "act-2",
    title: "Reviewed SQL JOINs Lesson",
    subtitle: "Spent 15 minutes reviewing outer join NULL cases",
    timestamp: "Yesterday, 4:30 PM",
    type: "revision",
    iconName: "BookOpen"
  },
  {
    id: "act-3",
    title: "AI Knowledge Drift Alert Triggered",
    subtitle: "Spring Security marked as Critical Risk",
    timestamp: "2 days ago",
    type: "alert",
    iconName: "AlertTriangle"
  },
  {
    id: "act-4",
    title: "Completed Java Collections Assessment",
    subtitle: "Score: 92% — Mastered ArrayList & Iterator",
    timestamp: "3 days ago",
    type: "quiz",
    iconName: "Award"
  }
];

export const analyticsData = {
  knowledgeGrowthHistory: [
    { label: "W1", overall: 58, java: 70, sql: 62, ds: 50, springboot: 40 },
    { label: "W2", overall: 62, java: 74, sql: 68, ds: 54, springboot: 42 },
    { label: "W3", overall: 67, java: 78, sql: 72, ds: 59, springboot: 46 },
    { label: "W4", overall: 72, java: 82, sql: 76, ds: 64, springboot: 51 }
  ],
  subjectPerformance: [
    { name: "Java", score: 82, target: 85, color: "#14B8A6" },
    { name: "SQL", score: 76, target: 80, color: "#38BDF8" },
    { name: "Data Structures", score: 64, target: 80, color: "#F59E0B" },
    { name: "Spring Boot", score: 51, target: 75, color: "#EF4444" }
  ],
  driftRiskDistribution: [
    { name: "Low Risk (Stable)", count: 3, percentage: 40, color: "#10B981" },
    { name: "Medium Risk", count: 1, percentage: 15, color: "#38BDF8" },
    { name: "High Risk", count: 2, percentage: 30, color: "#F59E0B" },
    { name: "Critical Risk", count: 1, percentage: 15, color: "#EF4444" }
  ],
  revisionEffectiveness: [
    { subject: "HashMap", before: 54, after: 72, gain: 18 },
    { subject: "SQL Joins", before: 60, after: 76, gain: 16 },
    { subject: "ArrayList", before: 78, after: 92, gain: 14 },
    { subject: "Streams API", before: 70, after: 84, gain: 14 }
  ],
  quizAccuracyTrend: [
    { date: "Sep 1", accuracy: 65 },
    { date: "Sep 5", accuracy: 70 },
    { date: "Sep 10", accuracy: 68 },
    { date: "Sep 15", accuracy: 78 },
    { date: "Sep 20", accuracy: 82 },
    { date: "Sep 24", accuracy: 85 }
  ]
};
