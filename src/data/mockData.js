// ND2 Virtual Classroom - Realistic Academic Mock Data
// Designed for National Diploma Year 2 (ND2) Department of Computer Science & Engineering

export const MOCK_DEPARTMENTS = [
  'Computer Science',
  'Electrical/Electronic Engineering',
  'Computer Engineering',
  'Science Laboratory Technology',
  'Accountancy',
  'Business Administration',
  'Mass Communication'
];

export const MOCK_USERS = {
  student: {
    id: 'usr-std-01',
    role: 'student',
    name: 'Adebayo Oluwaseun',
    matricNo: 'ND2/CS/2024/0142',
    email: 'adebayo.oluwaseun@student.nd2virtual.edu.ng',
    phone: '+234 803 456 7890',
    department: 'Computer Science',
    level: 'ND II',
    semester: 'Second Semester 2024/2025',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    enrolledCoursesCount: 6,
    attendanceRate: 91.5,
    cgpa: 3.68,
    status: 'Active'
  },
  lecturer: {
    id: 'usr-lec-01',
    role: 'lecturer',
    name: 'Engr. Dr. K. A. Adeleke',
    staffId: 'STAFF/CS/088',
    email: 'k.adeleke@lecturer.nd2virtual.edu.ng',
    phone: '+234 802 123 4567',
    department: 'Computer Science',
    designation: 'Senior Lecturer & Course Coordinator',
    office: 'Block C, Room 204, Faculty of Technology',
    officeHours: 'Tuesdays & Thursdays (2:00 PM - 4:00 PM)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedCoursesCount: 3,
    totalStudents: 185,
    status: 'Active'
  },
  admin: {
    id: 'usr-adm-01',
    role: 'admin',
    name: 'Prof. B. M. Aliyu',
    staffId: 'ADM/SYS/004',
    email: 'admin.ict@nd2virtual.edu.ng',
    department: 'Directorate of ICT & Academic Planning',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'Chief Systems Administrator',
    status: 'Active'
  }
};

export const MOCK_STUDENTS_LIST = [
  {
    id: 'std-1',
    name: 'Adebayo Oluwaseun',
    studentId: 'ND2/CS/2024/0142',
    email: 'adebayo.oluwaseun@student.nd2virtual.edu.ng',
    department: 'Computer Science',
    coursesCount: 6,
    attendance: '91.5%',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-2',
    name: 'Chioma Grace Eze',
    studentId: 'ND2/CS/2024/0155',
    email: 'chioma.eze@student.nd2virtual.edu.ng',
    department: 'Computer Science',
    coursesCount: 6,
    attendance: '88.0%',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-3',
    name: 'Musa Ibrahim Danladi',
    studentId: 'ND2/CS/2024/0168',
    email: 'musa.ibrahim@student.nd2virtual.edu.ng',
    department: 'Computer Science',
    coursesCount: 6,
    attendance: '94.2%',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-4',
    name: 'Fatima Zahra Usman',
    studentId: 'ND2/CS/2024/0189',
    email: 'fatima.usman@student.nd2virtual.edu.ng',
    department: 'Computer Science',
    coursesCount: 6,
    attendance: '72.4%',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-5',
    name: 'Emeka Victor Okafor',
    studentId: 'ND2/CS/2024/0201',
    email: 'emeka.okafor@student.nd2virtual.edu.ng',
    department: 'Computer Science',
    coursesCount: 5,
    attendance: '65.0%',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-6',
    name: 'Blessing Temitope Ajayi',
    studentId: 'ND2/CS/2024/0214',
    email: 'blessing.ajayi@student.nd2virtual.edu.ng',
    department: 'Computer Science',
    coursesCount: 6,
    attendance: '96.0%',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-7',
    name: 'Yakubu Haruna',
    studentId: 'ND2/EE/2024/0078',
    email: 'yakubu.haruna@student.nd2virtual.edu.ng',
    department: 'Electrical/Electronic Engineering',
    coursesCount: 7,
    attendance: '83.5%',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-8',
    name: 'Kafayat Motunrayo Sanni',
    studentId: 'ND2/CS/2024/0233',
    email: 'kafayat.sanni@student.nd2virtual.edu.ng',
    department: 'Computer Science',
    coursesCount: 6,
    attendance: '58.0%',
    status: 'Suspended',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  }
];

export const MOCK_LECTURERS_LIST = [
  {
    id: 'lec-1',
    name: 'Engr. Dr. K. A. Adeleke',
    staffId: 'STAFF/CS/088',
    email: 'k.adeleke@lecturer.nd2virtual.edu.ng',
    department: 'Computer Science',
    assignedCourses: ['COM 221', 'COM 224'],
    status: 'Active',
    phone: '+234 802 123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'lec-2',
    name: 'Engr. Mrs. F. O. Balogun',
    staffId: 'STAFF/CS/094',
    email: 'f.balogun@lecturer.nd2virtual.edu.ng',
    department: 'Computer Science',
    assignedCourses: ['COM 222'],
    status: 'Active',
    phone: '+234 803 234 5678',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'lec-3',
    name: 'Mr. T. J. Okonjo',
    staffId: 'STAFF/CS/102',
    email: 't.okonjo@lecturer.nd2virtual.edu.ng',
    department: 'Computer Science',
    assignedCourses: ['COM 223'],
    status: 'Active',
    phone: '+234 805 345 6789',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'lec-4',
    name: 'Mrs. A. E. Danjuma',
    staffId: 'STAFF/CS/110',
    email: 'a.danjuma@lecturer.nd2virtual.edu.ng',
    department: 'Computer Science',
    assignedCourses: ['COM 225'],
    status: 'Active',
    phone: '+234 807 456 7890',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'lec-5',
    name: 'Dr. P. C. Nwankwo',
    staffId: 'STAFF/GNS/045',
    email: 'p.nwankwo@lecturer.nd2virtual.edu.ng',
    department: 'General Studies',
    assignedCourses: ['GNS 202'],
    status: 'Active',
    phone: '+234 809 567 8901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'lec-6',
    name: 'Chief M. A. Ogundele',
    staffId: 'STAFF/EED/019',
    email: 'm.ogundele@lecturer.nd2virtual.edu.ng',
    department: 'Entrepreneurship Centre',
    assignedCourses: ['EED 216'],
    status: 'On Leave',
    phone: '+234 808 678 9012',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  }
];

export const MOCK_COURSES = [
  {
    id: 'com-221',
    code: 'COM 221',
    title: 'Data Structures & Algorithms',
    department: 'Computer Science',
    creditUnit: 3,
    semester: 'ND II 2nd Semester',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    lecturerId: 'lec-1',
    lecturerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    description: 'Comprehensive study of linear and non-linear data structures including Linked Lists, Stacks, Queues, Binary Trees, Hash Tables, Graph algorithms, sorting algorithms, time-complexity Big-O analysis, and practical implementations in modern software.',
    enrolledStudentsCount: 148,
    progress: 68,
    attendanceRate: 94.0,
    totalLectures: 14,
    attendedLectures: 13,
    materialsCount: 8,
    nextLecture: {
      id: 'lec-ses-01',
      title: 'Binary Search Trees & Tree Traversal Algorithms',
      date: 'Today',
      time: '10:00 AM - 12:00 PM',
      type: 'Video',
      status: 'Live Now'
    },
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Introduction to Data Structures',
        description: 'Foundations of data abstraction, primitive vs non-primitive structures, memory models, and abstract data types (ADTs).',
        status: 'Completed',
        learningObjectives: [
          'Define abstract data types and differentiate linear vs non-linear structures',
          'Understand contiguous vs dynamic memory layouts in C/C++',
          'Calculate memory address offsets for multi-dimensional arrays'
        ],
        relatedLecture: 'Module 1: Foundations of ADTs and Memory Allocation',
        materials: ['COM221-M01-LectureNotes.pdf', 'Data-Structures-Intro-Handout.pdf']
      },
      {
        moduleNumber: 2,
        title: 'Arrays, Linked Lists and Abstract Data Types',
        description: 'Singly linked lists, doubly linked lists, circular linked lists, node insertion, deletion, and pointer manipulation.',
        status: 'Completed',
        learningObjectives: [
          'Implement singly and doubly linked list pointer chains in memory',
          'Perform O(1) head insertion and O(N) traversal deletions',
          'Contrast memory fragmentation of arrays vs dynamic pointer structures'
        ],
        relatedLecture: 'Module 2: Linked List Pointer Architecture & Node Operations',
        materials: ['Lab-Manual-02-LinkedLists.cpp', 'COM221-M02-PointerChains.pdf']
      },
      {
        moduleNumber: 3,
        title: 'Stacks and Queues',
        description: 'LIFO and FIFO mechanisms, array/linked list implementations, postfix/prefix expression evaluation, and circular queues.',
        status: 'Completed',
        learningObjectives: [
          'Implement Stack LIFO operations (push, pop, peek) with overflow guards',
          'Convert infix mathematical expressions to reverse Polish notation (RPN)',
          'Design circular queue buffers using modulo arithmetic'
        ],
        relatedLecture: 'Module 3: Stack Expression Evaluation & Queue Architectures',
        materials: ['COM221-M03-StackQueueLab.pdf', 'Infix-To-Postfix-Visualizer.zip']
      },
      {
        moduleNumber: 4,
        title: 'Trees and Binary Search Trees',
        description: 'Hierarchical structures, binary trees, BST properties, node insertion, recursive search, and balanced AVL rotation mechanics.',
        status: 'Completed',
        learningObjectives: [
          'Understand tree terminology: root, leaves, height, depth, and subtrees',
          'Implement binary search tree (BST) node insertion and lookups in O(log N)',
          'Recognize degenerate tree skewing and motivation for AVL tree balance factors'
        ],
        relatedLecture: 'Module 4: Binary Search Tree Insertion and Structural Properties',
        materials: ['Module 4: Binary Search Trees & Traversal Algorithms Notes', 'Laboratory Manual: Linked Lists & Binary Tree Implementation in C/C++']
      },
      {
        moduleNumber: 5,
        title: 'Tree Traversal Algorithms',
        description: 'Depth-first traversals (In-order, Pre-order, Post-order) and breadth-first level-order traversal using queues.',
        status: 'Current',
        learningObjectives: [
          'Execute in-order traversal to retrieve strictly sorted elements from a BST',
          'Apply pre-order and post-order traversals for tree serialization and memory deallocation',
          'Implement breadth-first level-order queue traversals with time complexity analysis'
        ],
        relatedLecture: 'Binary Search Trees & Tree Traversal Algorithms (LIVE NOW)',
        materials: ['Tree-Traversal-Pseudocode-Guide.pdf', 'BST-Traversal-Animated-Slides.pdf']
      },
      {
        moduleNumber: 6,
        title: 'Graph Data Structures',
        description: 'Graphs, vertices, edges, directed vs undirected graphs, adjacency matrices, adjacency lists, and weighted networks.',
        status: 'Upcoming',
        learningObjectives: [
          'Represent graph networks using space-efficient adjacency lists and matrices',
          'Model real-world routing and dependency networks using directed graphs',
          'Compute vertex in-degree, out-degree, and connected components'
        ],
        relatedLecture: 'Module 6: Graph Representations and Adjacency Architectures',
        materials: ['COM221-M06-GraphTheory.pdf']
      },
      {
        moduleNumber: 7,
        title: 'Searching Algorithms',
        description: 'Linear search, binary search on sorted sequences, interpolation search, and time-space tradeoffs.',
        status: 'Upcoming',
        learningObjectives: [
          'Analyze average and worst-case performance of linear vs binary search',
          'Implement binary search iteratively and recursively with boundary checks',
          'Apply interpolation searching on uniformly distributed datasets'
        ],
        relatedLecture: 'Module 7: Searching Algorithms and Boundary Invariants',
        materials: ['COM221-M07-SearchTechniques.pdf']
      },
      {
        moduleNumber: 8,
        title: 'Sorting Algorithms',
        description: 'Comparison vs non-comparison sorts: Bubble, Insertion, Selection, MergeSort, QuickSort, and HeapSort.',
        status: 'Upcoming',
        learningObjectives: [
          'Compare quadratic O(N^2) sorts with divide-and-conquer O(N log N) algorithms',
          'Trace recursive partitioning in QuickSort and pivot selection strategies',
          'Demonstrate stability and in-place sorting memory trade-offs'
        ],
        relatedLecture: 'Module 8: Divide-and-Conquer Sorting Algorithms',
        materials: ['COM221-M08-SortingBenchmarks.pdf']
      },
      {
        moduleNumber: 9,
        title: 'Hash Tables',
        description: 'Hash functions, direct addressing, load factors, collision resolution via chaining and open addressing (linear/quadratic probing).',
        status: 'Upcoming',
        learningObjectives: [
          'Design uniform hash functions and calculate hash table load factors',
          'Resolve hash collisions using separate chaining linked lists',
          'Implement open addressing with linear probing and double hashing'
        ],
        relatedLecture: 'Module 9: Hash Tables and Collision Resolution',
        materials: ['COM221-M09-HashingProtocols.pdf']
      },
      {
        moduleNumber: 10,
        title: 'Algorithm Complexity and Big-O Analysis',
        description: 'Asymptotic analysis, Big-O, Big-Omega, Big-Theta notations, space-time trade-offs, and master theorem for recurrence relations.',
        status: 'Upcoming',
        learningObjectives: [
          'Formulate asymptotic growth bounds for iterative and recursive routines',
          'Apply the Master Theorem to divide-and-conquer recurrence relations',
          'Analyze worst-case, best-case, and amortized algorithmic complexities'
        ],
        relatedLecture: 'Module 10: Asymptotic Notation and Master Theorem Analysis',
        materials: ['COM221-M10-BigOComplexityGuide.pdf', 'PastExam-ComplexityQuestions.pdf']
      }
    ]
  },
  {
    id: 'com-222',
    code: 'COM 222',
    title: 'Computer Systems Troubleshooting & Maintenance',
    department: 'Computer Science',
    creditUnit: 3,
    semester: 'ND II 2nd Semester',
    lecturer: 'Engr. Mrs. F. O. Balogun',
    lecturerId: 'lec-2',
    lecturerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
    description: 'Hardware architecture diagnostic procedures, Motherboard power rails, POST beep code troubleshooting, CMOS configuration, SMPS testing, Peripheral bus interfaces, preventive system maintenance, OS recovery, and bench lab safety protocols.',
    enrolledStudentsCount: 142,
    progress: 75,
    attendanceRate: 91.0,
    totalLectures: 12,
    attendedLectures: 11,
    materialsCount: 6,
    nextLecture: {
      id: 'lec-ses-02',
      title: 'Power Supply Unit (SMPS) Testing and Voltage Rails Diagnostic',
      date: 'Tomorrow',
      time: '02:00 PM - 04:00 PM',
      type: 'Video',
      status: 'Scheduled'
    },
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Electrostatic Discharge (ESD) Protection and Lab Safety Standards',
        description: 'ESD ground mats, wrist straps, anti-static workstations, and high-voltage safety in polytechnic hardware laboratories.',
        status: 'Completed',
        learningObjectives: ['Identify ESD hazards and grounding techniques', 'Proper use of anti-static wrist straps and ESD dissipative mats', 'Comply with bench laboratory safety standards'],
        relatedLecture: 'Module 1: ESD Safety in Polytechnic Hardware Labs',
        materials: ['COM222-M01-ESDSafety.pdf']
      },
      {
        moduleNumber: 2,
        title: 'Motherboard Form Factors, Chipsets, and VRM Power Stages',
        description: 'ATX/Micro-ATX/ITX architecture, Northbridge/Southbridge functions, VRM MOSFET switching, and capacitor testing.',
        status: 'Completed',
        learningObjectives: ['Trace power rails across motherboard VRM circuits', 'Identify motherboard chipset bus routing', 'Differentiate form factors and mounting considerations'],
        relatedLecture: 'Module 2: Motherboard VRM Diagnostics',
        materials: ['COM222-M02-MotherboardVRM.pdf']
      },
      {
        moduleNumber: 3,
        title: 'POST Diagnostics and Audible Beep Code Deciphering',
        description: 'Power-On Self Test routines, AMI/Award/Phoenix BIOS beep code patterns, and debug card hex error codes.',
        status: 'Completed',
        learningObjectives: ['Decipher BIOS diagnostic beep patterns for RAM and GPU faults', 'Operate PCI debug diagnostic cards', 'Isolate boot loop root causes systematically'],
        relatedLecture: 'Module 3: POST Diagnostics & Audible Codes',
        materials: ['Hardware Troubleshooting Flowcharts & Motherboard POST Codes Guide']
      },
      {
        moduleNumber: 4,
        title: 'Storage Controllers: SATA, NVMe M.2 & RAID Troubleshooting',
        description: 'Storage bus interfaces, SMART disk telemetry, RAID 0/1/5 array degradation, and forensic disk image recovery.',
        status: 'Completed',
        learningObjectives: ['Configure hardware and software RAID volumes', 'Interpret SMART sector allocation errors', 'Troubleshoot NVMe thermal throttling and controller drops'],
        relatedLecture: 'Module 4: Storage Controllers & RAID Configuration',
        materials: ['COM222-M04-RAIDStorage.pdf']
      },
      {
        moduleNumber: 5,
        title: 'SMPS Multimeter Diagnostic & Pinout Rail Verification',
        description: 'Switched-Mode Power Supply 24-pin ATX testing, +12V/+5V/+3.3V voltage tolerance verification, and load testing.',
        status: 'Current',
        learningObjectives: ['Perform safe paperclip jumper tests on isolated power supplies', 'Measure DC voltage rails with digital multimeters under load', 'Detect ripple and short circuit protections'],
        relatedLecture: 'Power Supply Unit (SMPS) Testing and Voltage Rails Diagnostic (Next Lecture)',
        materials: ['COM222-M05-SMPSTestingGuide.pdf']
      },
      {
        moduleNumber: 6,
        title: 'Firmware Recovery, Dual-BIOS Flashing and UEFI Configuration',
        description: 'SPI EEPROM reprogramming with CH341A programmers, corrupt BIOS chip recovery, and secure boot provisioning.',
        status: 'Upcoming',
        learningObjectives: ['Flash corrupted BIOS chips using external programmers', 'Configure UEFI secure boot policies and NVRAM keys', 'Recover bricked firmware boards safely'],
        relatedLecture: 'Module 6: Hardware Firmware Recovery',
        materials: ['COM222-M06-UEFIFirmware.pdf']
      }
    ]
  },
  {
    id: 'com-223',
    code: 'COM 223',
    title: 'Unified Modelling Language (UML) & OOD',
    department: 'Computer Science',
    creditUnit: 2,
    semester: 'ND II 2nd Semester',
    lecturer: 'Mr. T. J. Okonjo',
    lecturerId: 'lec-3',
    lecturerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    description: 'Object-Oriented Analysis & Design concepts, Use Case modeling, Class Diagrams, Sequence & Collaboration diagrams, State Machine diagrams, Activity diagrams, and architectural documentation for enterprise software engineering.',
    enrolledStudentsCount: 155,
    progress: 82,
    attendanceRate: 93.3,
    totalLectures: 15,
    attendedLectures: 14,
    materialsCount: 11,
    nextLecture: {
      id: 'lec-ses-03',
      title: 'System Sequence Diagrams and Robustness Analysis',
      date: 'Thursday',
      time: '09:00 AM - 11:00 AM',
      type: 'Voice',
      status: 'Scheduled'
    },
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Principles of Object-Oriented Modeling (Encapsulation, Polymorphism)',
        description: 'Core concepts of OOP, abstraction levels, interfaces, dynamic polymorphism, and domain modeling.',
        status: 'Completed',
        learningObjectives: ['Define core OOP pillars within visual models', 'Formulate robust domain classes from business specifications', 'Map inheritance relationships cleanly'],
        relatedLecture: 'Module 1: Foundations of Object-Oriented Design',
        materials: ['UML 2.5 Quick Reference & Enterprise Architect Modeling Guide']
      },
      {
        moduleNumber: 2,
        title: 'Requirements Engineering & Use Case Specification',
        description: 'Actors, system boundaries, <<include>> and <<extend>> relationships, and formal use case narrative drafting.',
        status: 'Completed',
        learningObjectives: ['Draft structured use case specifications with precondition/postconditions', 'Accurately distinguish between include and extend dependencies', 'Model complex business boundaries'],
        relatedLecture: 'Module 2: Use Case Actor Specifications',
        materials: ['COM223-M02-UseCases.pdf']
      },
      {
        moduleNumber: 3,
        title: 'Class Diagrams: Associations, Aggregations, Compositions',
        description: 'Multiplicity, directional association, shared aggregation (white diamond) vs composite ownership (black diamond).',
        status: 'Completed',
        learningObjectives: ['Differentiate composition lifecycle coupling from aggregation', 'Specify exact attribute visibility (+, -, #, ~)', 'Draw complete architectural class hierarchies'],
        relatedLecture: 'Module 3: Class Diagrams: Aggregation vs Composition',
        materials: ['COM223-M03-ClassDiagrams.pdf']
      },
      {
        moduleNumber: 4,
        title: 'Interaction Diagrams: Sequence Diagrams and LifeLines',
        description: 'Synchronous and asynchronous message flows, lifeline activation bars, opt/alt fragments, and return values.',
        status: 'Current',
        learningObjectives: ['Design sequence diagrams detailing runtime message passing', 'Structure complex branching using alt and loop fragments', 'Map controller and entity object lifelines'],
        relatedLecture: 'Sequence Diagrams & Lifelines (Scheduled for Thursday)',
        materials: ['COM223-M04-SequenceDiagrams.pdf']
      },
      {
        moduleNumber: 5,
        title: 'State Machine & Activity Diagrams with Swimlanes',
        description: 'State transitions, guards, entry/exit actions, fork/join synchronization bars, and multi-actor swimlane flows.',
        status: 'Upcoming',
        learningObjectives: ['Model lifecycle transitions for entity objects with guards', 'Create parallel workflow activity diagrams with swimlanes', 'Validate state transitions against business rules'],
        relatedLecture: 'Module 5: State Machine Transitions and Workflows',
        materials: ['COM223-M05-StateActivity.pdf']
      }
    ]
  },
  {
    id: 'com-224',
    code: 'COM 224',
    title: 'Database Design II (Relational & SQL)',
    department: 'Computer Science',
    creditUnit: 3,
    semester: 'ND II 2nd Semester',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    lecturerId: 'lec-1',
    lecturerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    description: 'Advanced normalization techniques (3NF, BCNF, 4NF), Entity Relationship (ER) diagrams to relational mappings, Complex SQL querying, joins, nested subqueries, stored procedures, indexing strategies, ACID transaction properties, and concurrency control.',
    enrolledStudentsCount: 146,
    progress: 60,
    attendanceRate: 88.0,
    totalLectures: 10,
    attendedLectures: 9,
    materialsCount: 7,
    nextLecture: {
      id: 'lec-ses-04',
      title: 'Advanced SQL Subqueries, Window Functions & CTEs',
      date: 'Friday',
      time: '11:00 AM - 01:00 PM',
      type: 'Video',
      status: 'Scheduled'
    },
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Review of Relational Algebra and Set Theory',
        description: 'Selection, projection, Cartesian product, set union, intersection, difference, and join algebraic operators.',
        status: 'Completed',
        learningObjectives: ['Formulate relational algebra expressions for complex data queries', 'Optimize query trees using algebraic equivalence rules', 'Understand relational integrity constraints'],
        relatedLecture: 'Module 1: Relational Algebra Foundations',
        materials: ['COM224-M01-RelationalAlgebra.pdf']
      },
      {
        moduleNumber: 2,
        title: 'Functional Dependencies and Higher Normal Forms (BCNF & 4NF)',
        description: 'Armstrong axioms, canonical covers, lossless join decomposition, dependency preservation, and multivalued dependencies.',
        status: 'Completed',
        learningObjectives: ['Determine candidate keys from functional dependency sets', 'Decompose schemas into Boyce-Codd Normal Form (BCNF)', 'Eliminate update, insertion, and deletion anomalies'],
        relatedLecture: 'Module 2: Boyce-Codd Normal Form (BCNF) Proofs',
        materials: ['Relational Schema Normalization & BCNF Worked Solutions']
      },
      {
        moduleNumber: 3,
        title: 'Complex Joins (Inner, Left, Full Outer, Self-Joins)',
        description: 'Multi-table queries, cross joins, outer joins, self-referential organizational hierarchy queries, and Cartesian prevention.',
        status: 'Completed',
        learningObjectives: ['Write robust multi-table joins without accidental duplicates', 'Implement self-joins for hierarchical tree data', 'Optimize join ordering for large tables'],
        relatedLecture: 'Module 3: Complex SQL Joins & Subqueries',
        materials: ['COM224-M03-SQLJoinsWorkshop.sql']
      },
      {
        moduleNumber: 4,
        title: 'Correlated Subqueries and Common Table Expressions (CTEs)',
        description: 'EXISTS/NOT EXISTS clauses, scalar subqueries, recursive CTEs, and SQL window ranking functions (ROW_NUMBER, RANK).',
        status: 'Current',
        learningObjectives: ['Write correlated subqueries for contextual filtering', 'Build recursive Common Table Expressions (CTEs)', 'Apply analytical window functions across partitions'],
        relatedLecture: 'Advanced SQL Subqueries, Window Functions & CTEs (Scheduled for Friday)',
        materials: ['COM224-M04-CTEsAndWindowFunctions.pdf']
      },
      {
        moduleNumber: 5,
        title: 'Database Indexing (B-Tree, Hash) and Query Execution Plans',
        description: 'Clustered vs non-clustered indexes, B+ Tree depth, EXPLAIN query plan analysis, table scans vs index seeks.',
        status: 'Upcoming',
        learningObjectives: ['Analyze query bottlenecks using EXPLAIN PLAN outputs', 'Design optimal composite indexes for high-frequency queries', 'Understand index overhead on write-heavy databases'],
        relatedLecture: 'Module 5: Indexing and Performance Tuning',
        materials: ['COM224-M05-IndexingOptimization.pdf']
      }
    ]
  },
  {
    id: 'com-225',
    code: 'COM 225',
    title: 'Web Technology & Internet Programming',
    department: 'Computer Science',
    creditUnit: 3,
    semester: 'ND II 2nd Semester',
    lecturer: 'Mrs. A. E. Danjuma',
    lecturerId: 'lec-4',
    lecturerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    description: 'Modern web architecture, client-server paradigm, HTML5 semantic structure, modern CSS responsive grid and flexbox layouts, modern asynchronous JavaScript (Fetch API, Promises, Async/Await), DOM manipulation, and full-stack API consumption.',
    enrolledStudentsCount: 160,
    progress: 85,
    attendanceRate: 95.0,
    totalLectures: 20,
    attendedLectures: 19,
    materialsCount: 14,
    nextLecture: {
      id: 'lec-ses-05',
      title: 'RESTful API Architecture and Asynchronous State Handling',
      date: 'Monday',
      time: '08:00 AM - 10:00 AM',
      type: 'Video',
      status: 'Scheduled'
    },
    syllabus: [
      {
        moduleNumber: 1,
        title: 'HTTP/HTTPS Protocol Lifecycle, Headers and Status Codes',
        description: 'Client-server request/response cycle, MIME types, HTTP methods (GET, POST, PUT, DELETE), caching headers, and SSL/TLS handshakes.',
        status: 'Completed',
        learningObjectives: ['Trace the full lifecycle of an HTTP request through DNS and TCP', 'Correctly utilize standard REST status codes (200, 201, 400, 401, 404, 500)', 'Inspect headers and payload with browser network tools'],
        relatedLecture: 'Module 1: HTTP Architecture and Network Lifecycle',
        materials: ['COM225-M01-HTTPProtocols.pdf']
      },
      {
        moduleNumber: 2,
        title: 'Modern CSS Frameworks, Responsive Typography and Layouts',
        description: 'CSS Grid, Flexbox alignment, media query breakpoints, clamp typography, mobile-first responsive architecture.',
        status: 'Completed',
        learningObjectives: ['Implement adaptive CSS Flexbox and Grid layouts', 'Master mobile-first viewport scaling and typography', 'Build fluid user interfaces across diverse devices'],
        relatedLecture: 'Module 2: Responsive Design and Grid Architecture',
        materials: ['COM225-M02-ResponsiveCSS.pdf']
      },
      {
        moduleNumber: 3,
        title: 'JavaScript ES6+ Modules, Closures, and Event Loop Execution',
        description: 'Lexical scoping, higher-order functions, destructuring, modules (import/export), call stack, task queue, and microtasks.',
        status: 'Completed',
        learningObjectives: ['Understand JavaScript single-threaded concurrency and event loop', 'Utilize ES6 modularization and pure functional patterns', 'Manage memory and prevent closure leaks'],
        relatedLecture: 'Module 3: JavaScript Modules & Event Delegation',
        materials: ['Modern Asynchronous JavaScript & RESTful API Workshop Files']
      },
      {
        moduleNumber: 4,
        title: 'Async JavaScript, Promises, Fetch API and Error Handling',
        description: 'Callback hell mitigation, Promise chaining, async/await error try-catch blocks, Fetch API request headers and JSON serialization.',
        status: 'Completed',
        learningObjectives: ['Write clean asynchronous code with async/await', 'Handle network failures and HTTP exceptions gracefully', 'Consume external JSON endpoints securely'],
        relatedLecture: 'Module 4: Fetch API & Async JavaScript',
        materials: ['COM225-M04-AsyncJavaScriptLab.zip']
      },
      {
        moduleNumber: 5,
        title: 'SPA Architecture, Component State, and Virtual DOM Concepts',
        description: 'Single Page Applications, client-side routing, unidirectional data flow, component encapsulation, and virtual DOM diffing.',
        status: 'Current',
        learningObjectives: ['Structure component-driven client web applications', 'Manage state immutably across nested hierarchies', 'Integrate client-side routing and page transitions'],
        relatedLecture: 'RESTful API Architecture and Asynchronous State Handling (Next Lecture)',
        materials: ['COM225-M05-SPAFrameworks.pdf']
      }
    ]
  },
  {
    id: 'gns-202',
    code: 'GNS 202',
    title: 'Communication in English II',
    department: 'General Studies',
    creditUnit: 2,
    semester: 'ND II 2nd Semester',
    lecturer: 'Dr. P. C. Nwankwo',
    lecturerId: 'lec-5',
    lecturerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    description: 'Technical report writing, academic essay structuring, formal conference presentation techniques, business correspondence, memorandum writing, precision summarizing, and oral defense rhetoric.',
    enrolledStudentsCount: 180,
    progress: 70,
    attendanceRate: 87.5,
    totalLectures: 8,
    attendedLectures: 7,
    materialsCount: 5,
    nextLecture: {
      id: 'lec-ses-06',
      title: 'Structuring Technical Project Reports for ND2 Defense',
      date: 'Wednesday',
      time: '03:00 PM - 05:00 PM',
      type: 'Voice',
      status: 'Scheduled'
    },
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Principles of Effective Technical Communication',
        description: 'Clarity, conciseness, coherence, objectivity, audience analysis, and formal academic tone in science and engineering.',
        status: 'Completed',
        learningObjectives: ['Apply principles of technical clarity and objectivity in writing', 'Tailor academic prose to technical and non-technical audiences', 'Avoid ambiguity, jargon overload, and colloquialisms'],
        relatedLecture: 'Module 1: Foundations of Technical Communication',
        materials: ['GNS202-M01-TechnicalCommunication.pdf']
      },
      {
        moduleNumber: 2,
        title: 'Formal Letter Writing and Memorandum Preparation',
        description: 'Institutional memorandum formats, formal correspondence structure, subject lines, executive routing, and official register.',
        status: 'Completed',
        learningObjectives: ['Draft professional institutional memoranda adhering to standard layout', 'Formulate formal business and academic letters with proper salutations', 'Use appropriate administrative and technical terminology'],
        relatedLecture: 'Module 2: Administrative Memoranda and Business Letters',
        materials: ['GNS202-M02-MemoTemplates.docx']
      },
      {
        moduleNumber: 3,
        title: 'Executive Summary and Abstract Formulation',
        description: 'Condensing complex multi-page research and technical proposals into concise, high-impact 250-word executive abstracts.',
        status: 'Completed',
        learningObjectives: ['Extract key findings and methodologies into standalone abstracts', 'Write structured executive summaries for polytechnic project proposals', 'Maintain precision while omitting non-essential narrative details'],
        relatedLecture: 'Module 3: Technical Project Proposal Writing',
        materials: ['GNS202-M03-AbstractDraftingGuide.pdf']
      },
      {
        moduleNumber: 4,
        title: 'Citation Styles (IEEE, APA) and Academic Integrity Standards',
        description: 'Plagiarism prevention, in-text citation mechanics, bibliography and reference section formatting, and intellectual property ethics.',
        status: 'Current',
        learningObjectives: ['Format in-text citations using standard IEEE and APA styles', 'Compile complete reference lists for academic research reports', 'Uphold polytechnic academic integrity and anti-plagiarism standards'],
        relatedLecture: 'Structuring Technical Project Reports for ND2 Defense (Next Lecture)',
        materials: ['GNS202-M04-CitationStyleManual.pdf']
      }
    ]
  }
];

export const MOCK_LECTURES = [
  {
    id: 'lec-ses-01',
    courseId: 'com-221',
    courseCode: 'COM 221',
    courseTitle: 'Data Structures & Algorithms',
    title: 'Binary Search Trees & Tree Traversal Algorithms',
    description: 'In-depth analysis of BST node insertion, deletion edge cases, in-order, pre-order, post-order depth-first traversals, and breadth-first level-order queue implementations.',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    lecturerId: 'lec-1',
    lecturerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-12',
    dateFormatted: 'Today (Wed, Aug 12)',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    duration: '120 mins',
    type: 'Video',
    status: 'Live Now', // 'Live Now', 'Scheduled', 'Completed'
    meetingId: 'room-com221-live',
    attendeesCount: 42,
    maxCapacity: 150,
    roomPasscode: 'COM221-ND2',
    allowStudentScreenShare: false,
    recordSession: true,
    autoAttendance: true,
    resources: [
      { name: 'BST_Traversal_Slides.pdf', size: '2.4 MB' },
      { name: 'tree_traversal_lab.c', size: '14 KB' }
    ]
  },
  {
    id: 'lec-ses-02',
    courseId: 'com-222',
    courseCode: 'COM 222',
    courseTitle: 'Computer Systems Troubleshooting & Maintenance',
    title: 'Power Supply Unit (SMPS) Testing and Voltage Rails Diagnostic',
    description: 'Hands-on live hardware demonstration: Using a digital multimeter to test +12V, +5V, +3.3V, and -12V rail lines, paperclip jump test safely, and power good wire diagnostics.',
    lecturer: 'Engr. Mrs. F. O. Balogun',
    lecturerId: 'lec-2',
    lecturerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-13',
    dateFormatted: 'Tomorrow (Thu, Aug 13)',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    duration: '120 mins',
    type: 'Video',
    status: 'Scheduled',
    meetingId: 'room-com222-smps',
    attendeesCount: 0,
    maxCapacity: 150,
    roomPasscode: 'SMPS-774',
    allowStudentScreenShare: true,
    recordSession: true,
    autoAttendance: true
  },
  {
    id: 'lec-ses-03',
    courseId: 'com-223',
    courseCode: 'COM 223',
    courseTitle: 'Unified Modelling Language (UML) & OOD',
    title: 'System Sequence Diagrams and Robustness Analysis',
    description: 'Constructing lifeline messages, synchronous vs asynchronous calls, activation bars, self-calls, and mapping boundary, control, entity objects in Enterprise Architect.',
    lecturer: 'Mr. T. J. Okonjo',
    lecturerId: 'lec-3',
    lecturerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-14',
    dateFormatted: 'Friday, Aug 14',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    duration: '120 mins',
    type: 'Voice',
    status: 'Scheduled',
    meetingId: 'room-com223-seq',
    attendeesCount: 0,
    maxCapacity: 150,
    roomPasscode: 'UML-2026',
    allowStudentScreenShare: false,
    recordSession: true,
    autoAttendance: true
  },
  {
    id: 'lec-ses-04',
    courseId: 'com-224',
    courseCode: 'COM 224',
    courseTitle: 'Database Design II (Relational & SQL)',
    title: 'Advanced SQL Subqueries, Window Functions & CTEs',
    description: 'Analyzing ranking functions (ROW_NUMBER, RANK, DENSE_RANK), Partition By clauses, recursive CTEs, and optimizing execution plans for complex joins.',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    lecturerId: 'lec-1',
    lecturerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-17',
    dateFormatted: 'Monday, Aug 17',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    duration: '120 mins',
    type: 'Video',
    status: 'Scheduled',
    meetingId: 'room-com224-sql',
    attendeesCount: 0,
    maxCapacity: 150,
    roomPasscode: 'SQL-ND2',
    allowStudentScreenShare: true,
    recordSession: true,
    autoAttendance: true
  },
  {
    id: 'lec-ses-05',
    courseId: 'com-225',
    courseCode: 'COM 225',
    courseTitle: 'Web Technology & Internet Programming',
    title: 'RESTful API Architecture and Asynchronous State Handling',
    description: 'REST constraints, JSON payload handling, status codes 200/201/400/404/500, JWT token headers, and handling loading/error UI states.',
    lecturer: 'Mrs. A. E. Danjuma',
    lecturerId: 'lec-4',
    lecturerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-18',
    dateFormatted: 'Tuesday, Aug 18',
    startTime: '08:00 AM',
    endTime: '10:00 AM',
    duration: '120 mins',
    type: 'Video',
    status: 'Scheduled',
    meetingId: 'room-com225-web',
    attendeesCount: 0,
    maxCapacity: 160,
    roomPasscode: 'WEB-ND2',
    allowStudentScreenShare: true,
    recordSession: true,
    autoAttendance: true
  },
  {
    id: 'lec-ses-00',
    courseId: 'com-221',
    courseCode: 'COM 221',
    courseTitle: 'Data Structures & Algorithms',
    title: 'Stack & Queue ADT: Linked vs Array-backed Implementations',
    description: 'Evaluation of stack overflow/underflow conditions, circular queue modulo arithmetic, and infix-to-postfix conversion algorithms.',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    lecturerId: 'lec-1',
    lecturerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-05',
    dateFormatted: 'Wed, Aug 05 (Previous)',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    duration: '120 mins',
    type: 'Video',
    status: 'Completed',
    meetingId: 'room-com221-past-05',
    attendeesCount: 138,
    maxCapacity: 150,
    recordingUrl: '#',
    hasRecording: true,
    attendanceRecorded: '93.2%'
  },
  {
    id: 'lec-ses-06',
    courseId: 'gns-202',
    courseCode: 'GNS 202',
    courseTitle: 'Communication in English II',
    title: 'Technical Project Proposal Writing & Report Structure',
    description: 'Guidelines for executive summaries, problem statements, methodology drafting, literature review synthesis, and IEEE reference citations.',
    lecturer: 'Dr. P. C. Nwankwo',
    lecturerId: 'lec-5',
    lecturerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-19',
    dateFormatted: 'Wednesday, Aug 19',
    startTime: '03:00 PM',
    endTime: '05:00 PM',
    duration: '120 mins',
    type: 'Voice',
    status: 'Scheduled',
    meetingId: 'room-gns202-proposal',
    attendeesCount: 0,
    maxCapacity: 160,
    roomPasscode: 'GNS-ND2',
    allowStudentScreenShare: false,
    recordSession: true,
    autoAttendance: true
  },
  {
    id: 'lec-ses-07',
    courseId: 'eed-216',
    courseCode: 'EED 216',
    courseTitle: 'Practice of Entrepreneurship',
    title: 'Feasibility Analysis & ICT Venture Business Models',
    description: 'Financial forecasting, breakeven analysis, market segmentation strategies, and investor pitch deck preparation for tech startups.',
    lecturer: 'Chief M. A. Ogundele',
    lecturerId: 'lec-6',
    lecturerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-04',
    dateFormatted: 'Tue, Aug 04 (Previous)',
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    duration: '120 mins',
    type: 'Video',
    status: 'Completed',
    meetingId: 'room-eed216-past-04',
    attendeesCount: 145,
    maxCapacity: 160,
    recordingUrl: '#',
    hasRecording: true,
    attendanceRecorded: '90.6%'
  }
];

export const MOCK_ATTENDANCE = [
  {
    courseId: 'com-221',
    courseCode: 'COM 221',
    courseTitle: 'Data Structures & Algorithms',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    creditUnit: 3,
    totalLectures: 14,
    attended: 13,
    missed: 1,
    percentage: 92.8,
    status: 'Good Standing', // 'Good Standing' (>=75%), 'Warning' (60-74%), 'Defaulter' (<60%)
    history: [
      { date: '2026-08-12', lecture: 'Binary Search Trees & Traversal', status: 'Present', duration: '118 mins', timeJoined: '10:01 AM' },
      { date: '2026-08-05', lecture: 'Stack & Queue ADT Implementation', status: 'Present', duration: '120 mins', timeJoined: '09:58 AM' },
      { date: '2026-07-29', lecture: 'Doubly Linked Lists & Memory Locality', status: 'Present', duration: '115 mins', timeJoined: '10:05 AM' },
      { date: '2026-07-22', lecture: 'Singly Linked List Node Insertion & Deletion', status: 'Absent', duration: '0 mins', reason: 'Medical Excuse Submitted' },
      { date: '2026-07-15', lecture: 'Asymptotic Analysis & Big-O Notation', status: 'Present', duration: '120 mins', timeJoined: '10:00 AM' }
    ]
  },
  {
    courseId: 'com-222',
    courseCode: 'COM 222',
    courseTitle: 'Computer Systems Troubleshooting & Maintenance',
    lecturer: 'Engr. Mrs. F. O. Balogun',
    creditUnit: 3,
    totalLectures: 12,
    attended: 11,
    missed: 1,
    percentage: 91.6,
    status: 'Good Standing',
    history: [
      { date: '2026-08-06', lecture: 'Storage Controllers & RAID Configuration', status: 'Present', duration: '116 mins', timeJoined: '02:02 PM' },
      { date: '2026-07-30', lecture: 'POST Diagnostics & Audible Codes', status: 'Present', duration: '120 mins', timeJoined: '01:59 PM' },
      { date: '2026-07-23', lecture: 'Motherboard VRM Diagnostics', status: 'Present', duration: '110 mins', timeJoined: '02:05 PM' },
      { date: '2026-07-16', lecture: 'ESD Safety in Polytechnic Hardware Labs', status: 'Present', duration: '120 mins', timeJoined: '02:00 PM' }
    ]
  },
  {
    courseId: 'com-223',
    courseCode: 'COM 223',
    courseTitle: 'Unified Modelling Language (UML) & OOD',
    lecturer: 'Mr. T. J. Okonjo',
    creditUnit: 2,
    totalLectures: 15,
    attended: 14,
    missed: 1,
    percentage: 93.3,
    status: 'Good Standing',
    history: [
      { date: '2026-08-07', lecture: 'Sequence Diagrams & Lifelines', status: 'Present', duration: '120 mins', timeJoined: '09:00 AM' },
      { date: '2026-07-31', lecture: 'Class Diagrams: Aggregation vs Composition', status: 'Present', duration: '118 mins', timeJoined: '09:02 AM' },
      { date: '2026-07-24', lecture: 'Use Case Actor Specifications', status: 'Present', duration: '120 mins', timeJoined: '08:58 AM' }
    ]
  },
  {
    courseId: 'com-224',
    courseCode: 'COM 224',
    courseTitle: 'Database Design II (Relational & SQL)',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    creditUnit: 3,
    totalLectures: 10,
    attended: 9,
    missed: 1,
    percentage: 90.0,
    status: 'Good Standing',
    history: [
      { date: '2026-08-03', lecture: 'Complex SQL Joins & Subqueries', status: 'Present', duration: '115 mins', timeJoined: '11:03 AM' },
      { date: '2026-07-27', lecture: 'Boyce-Codd Normal Form (BCNF) Proofs', status: 'Present', duration: '120 mins', timeJoined: '10:59 AM' }
    ]
  },
  {
    courseId: 'com-225',
    courseCode: 'COM 225',
    courseTitle: 'Web Technology & Internet Programming',
    lecturer: 'Mrs. A. E. Danjuma',
    creditUnit: 3,
    totalLectures: 20,
    attended: 19,
    missed: 1,
    percentage: 95.0,
    status: 'Good Standing',
    history: [
      { date: '2026-08-11', lecture: 'Fetch API & Async JavaScript', status: 'Present', duration: '120 mins', timeJoined: '08:00 AM' },
      { date: '2026-08-04', lecture: 'JavaScript Modules & Event Delegation', status: 'Present', duration: '120 mins', timeJoined: '07:58 AM' }
    ]
  },
  {
    courseId: 'gns-202',
    courseCode: 'GNS 202',
    courseTitle: 'Communication in English II',
    lecturer: 'Dr. P. C. Nwankwo',
    creditUnit: 2,
    totalLectures: 8,
    attended: 7,
    missed: 1,
    percentage: 87.5,
    status: 'Good Standing',
    history: [
      { date: '2026-08-05', lecture: 'Technical Project Proposal Writing', status: 'Present', duration: '110 mins', timeJoined: '03:04 PM' }
    ]
  }
];

export const MOCK_MATERIALS = [
  {
    id: 'mat-1',
    courseId: 'com-221',
    courseCode: 'COM 221',
    courseTitle: 'Data Structures & Algorithms',
    title: 'Module 4: Binary Search Trees & Traversal Algorithms Notes',
    category: 'Lecture Notes',
    format: 'PDF',
    size: '4.2 MB',
    uploadedBy: 'Engr. Dr. K. A. Adeleke',
    uploadedDate: '2026-08-10',
    downloads: 142,
    description: 'Comprehensive slides and mathematical proofs for AVL tree balancing and BST search complexity.'
  },
  {
    id: 'mat-2',
    courseId: 'com-221',
    courseCode: 'COM 221',
    courseTitle: 'Data Structures & Algorithms',
    title: 'Laboratory Manual: Linked Lists & Binary Tree Implementation in C/C++',
    category: 'Lab Manual',
    format: 'PDF',
    size: '2.8 MB',
    uploadedBy: 'Engr. Dr. K. A. Adeleke',
    uploadedDate: '2026-08-02',
    downloads: 139,
    description: 'Weekly practical programming assignments, memory allocation tests, and expected output guidelines.'
  },
  {
    id: 'mat-2b',
    courseId: 'com-221',
    courseCode: 'COM 221',
    courseTitle: 'Data Structures & Algorithms',
    title: 'Module 1-3 Handout: Abstract Data Types, Stacks, & Infix Expression Evaluation',
    category: 'Lecture Notes',
    format: 'PDF',
    size: '3.4 MB',
    uploadedBy: 'Engr. Dr. K. A. Adeleke',
    uploadedDate: '2026-07-20',
    downloads: 148,
    description: 'Theoretical explanations and worked examples of stack overflow guards and reverse Polish notation.'
  },
  {
    id: 'mat-2c',
    courseId: 'com-221',
    courseCode: 'COM 221',
    courseTitle: 'Data Structures & Algorithms',
    title: 'Algorithm Complexity & Big-O Asymptotic Notation Reference Card',
    category: 'Reference Guide',
    format: 'PDF',
    size: '1.2 MB',
    uploadedBy: 'Engr. Dr. K. A. Adeleke',
    uploadedDate: '2026-07-15',
    downloads: 154,
    description: 'Time and space complexity cheat-sheet for standard searching, sorting, and tree traversal algorithms.'
  },
  {
    id: 'mat-3',
    courseId: 'com-222',
    courseCode: 'COM 222',
    courseTitle: 'Computer Systems Troubleshooting',
    title: 'Hardware Troubleshooting Flowcharts & Motherboard POST Codes Guide',
    category: 'Handout',
    format: 'PDF',
    size: '5.1 MB',
    uploadedBy: 'Engr. Mrs. F. O. Balogun',
    uploadedDate: '2026-07-28',
    downloads: 130,
    description: 'Illustrated step-by-step decision tree for computer hardware diagnostics, power rail checking, and component substitution.'
  },
  {
    id: 'mat-4',
    courseId: 'com-223',
    courseCode: 'COM 223',
    courseTitle: 'Unified Modelling Language (UML)',
    title: 'UML 2.5 Quick Reference & Enterprise Architect Modeling Guide',
    category: 'Reference Guide',
    format: 'PDF',
    size: '3.6 MB',
    uploadedBy: 'Mr. T. J. Okonjo',
    uploadedDate: '2026-08-01',
    downloads: 145,
    description: 'Standard notations for Use Cases, Sequence Diagrams, Activity Diagrams, and Class Associations.'
  },
  {
    id: 'mat-5',
    courseId: 'com-224',
    courseCode: 'COM 224',
    courseTitle: 'Database Design II',
    title: 'Relational Schema Normalization & BCNF Worked Solutions',
    category: 'Past Questions & Solutions',
    format: 'PDF',
    size: '1.9 MB',
    uploadedBy: 'Engr. Dr. K. A. Adeleke',
    uploadedDate: '2026-07-25',
    downloads: 156,
    description: 'Sample examination questions with step-by-step functional dependency decomposition.'
  },
  {
    id: 'mat-6',
    courseId: 'com-225',
    courseCode: 'COM 225',
    courseTitle: 'Web Technology & Internet Programming',
    title: 'Modern Asynchronous JavaScript & RESTful API Workshop Files',
    category: 'Lab Manual',
    format: 'ZIP',
    size: '8.4 MB',
    uploadedBy: 'Mrs. A. E. Danjuma',
    uploadedDate: '2026-08-08',
    downloads: 162,
    description: 'Starter code repositories, mock REST servers, and practical DOM manipulation challenges.'
  },
  {
    id: 'mat-7',
    courseId: 'gns-202',
    courseCode: 'GNS 202',
    courseTitle: 'Communication in English II',
    title: 'Technical Project Proposal Writing & ND2 Defense Style Guide',
    category: 'Handout',
    format: 'PDF',
    size: '2.1 MB',
    uploadedBy: 'Dr. P. C. Nwankwo',
    uploadedDate: '2026-08-03',
    downloads: 175,
    description: 'Guidelines for technical formatting, executive summary drafting, and APA/IEEE reference bibliography citations.'
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Live Lecture in Progress: COM 221',
    message: 'Engr. Dr. K. A. Adeleke has started the live video session for "Binary Search Trees & Traversal Algorithms". Click to join the virtual classroom.',
    type: 'live',
    priority: 'high',
    timestamp: '10 mins ago',
    date: '2026-08-12 10:00 AM',
    read: false,
    actionUrl: '/meeting/room-com221-live',
    actionText: 'Join Classroom'
  },
  {
    id: 'notif-2',
    title: 'Upcoming Lecture Reminder: COM 222',
    message: 'Scheduled lecture on "Power Supply Unit (SMPS) Testing" is set for tomorrow, Thursday at 2:00 PM.',
    type: 'lecture',
    priority: 'medium',
    timestamp: '2 hours ago',
    date: '2026-08-12 08:30 AM',
    read: false,
    actionUrl: '/student/lectures',
    actionText: 'View Schedule'
  },
  {
    id: 'notif-3',
    title: 'New Study Material Uploaded: COM 225',
    message: 'Mrs. A. E. Danjuma uploaded "Modern Asynchronous JavaScript & RESTful API Workshop Files" to the course repository.',
    type: 'material',
    priority: 'low',
    timestamp: 'Yesterday at 4:15 PM',
    date: '2026-08-11 04:15 PM',
    read: true,
    actionUrl: '/student/materials',
    actionText: 'Download Material'
  },
  {
    id: 'notif-4',
    title: 'Mid-Semester Continuous Assessment (CA) Notice',
    message: 'Academic Planning Directorate: ND2 Computer Science CBT Continuous Assessment tests commence next week Monday.',
    type: 'system',
    priority: 'high',
    timestamp: '2 days ago',
    date: '2026-08-10 11:00 AM',
    read: true,
    actionUrl: '/student/dashboard',
    actionText: 'Read Directive'
  },
  {
    id: 'notif-5',
    title: 'Attendance Compliance Warning Threshold (75%)',
    message: 'Reminder: Polytechnic examination regulations require at least 75% attendance in every course to be eligible for 2nd semester examinations.',
    type: 'warning',
    priority: 'medium',
    timestamp: '3 days ago',
    date: '2026-08-09 09:00 AM',
    read: true,
    actionUrl: '/student/attendance',
    actionText: 'Check Attendance'
  }
];

export const MOCK_CLASSROOM_PARTICIPANTS = [
  {
    id: 'part-0',
    name: 'Engr. Dr. K. A. Adeleke',
    role: 'Lecturer',
    isHost: true,
    isMuted: false,
    isVideoOn: true,
    isScreenSharing: true,
    hasHandRaised: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    matricNo: 'STAFF/CS/088',
    networkQuality: 'excellent'
  },
  {
    id: 'part-1',
    name: 'Adebayo Oluwaseun (You)',
    role: 'Student',
    isHost: false,
    isMuted: true,
    isVideoOn: true,
    isScreenSharing: false,
    hasHandRaised: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    matricNo: 'ND2/CS/2024/0142',
    networkQuality: 'good'
  },
  {
    id: 'part-2',
    name: 'Chioma Grace Eze',
    role: 'Student',
    isHost: false,
    isMuted: true,
    isVideoOn: false,
    isScreenSharing: false,
    hasHandRaised: true,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    matricNo: 'ND2/CS/2024/0155',
    networkQuality: 'good'
  },
  {
    id: 'part-3',
    name: 'Musa Ibrahim Danladi',
    role: 'Student',
    isHost: false,
    isMuted: true,
    isVideoOn: true,
    isScreenSharing: false,
    hasHandRaised: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    matricNo: 'ND2/CS/2024/0168',
    networkQuality: 'excellent'
  },
  {
    id: 'part-4',
    name: 'Blessing Temitope Ajayi',
    role: 'Student',
    isHost: false,
    isMuted: true,
    isVideoOn: false,
    isScreenSharing: false,
    hasHandRaised: true,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    matricNo: 'ND2/CS/2024/0214',
    networkQuality: 'fair'
  },
  {
    id: 'part-5',
    name: 'Emeka Victor Okafor',
    role: 'Student',
    isHost: false,
    isMuted: true,
    isVideoOn: true,
    isScreenSharing: false,
    hasHandRaised: false,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    matricNo: 'ND2/CS/2024/0201',
    networkQuality: 'good'
  },
  {
    id: 'part-6',
    name: 'Fatima Zahra Usman',
    role: 'Student',
    isHost: false,
    isMuted: true,
    isVideoOn: false,
    isScreenSharing: false,
    hasHandRaised: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    matricNo: 'ND2/CS/2024/0189',
    networkQuality: 'good'
  }
];

export const MOCK_CLASSROOM_CHAT = [
  {
    id: 'msg-1',
    senderId: 'part-0',
    senderName: 'Engr. Dr. K. A. Adeleke',
    senderRole: 'Lecturer',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    text: 'Good morning ND2 class. Welcome to today\'s session on Binary Search Trees (BST). Please confirm you can see my slide presentation clearly.',
    time: '10:02 AM',
    isPinned: true
  },
  {
    id: 'msg-2',
    senderId: 'part-1',
    senderName: 'Adebayo Oluwaseun',
    senderRole: 'Student',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    text: 'Good morning Sir! Screen and audio are loud and crystal clear.',
    time: '10:03 AM'
  },
  {
    id: 'msg-3',
    senderId: 'part-2',
    senderName: 'Chioma Grace Eze',
    senderRole: 'Student',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    text: 'Morning Sir, I can see the slide on In-order traversal.',
    time: '10:04 AM'
  },
  {
    id: 'msg-4',
    senderId: 'part-0',
    senderName: 'Engr. Dr. K. A. Adeleke',
    senderRole: 'Lecturer',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    text: 'Remember that In-order traversal of a BST always yields sorted keys in ascending order: Left Subtree -> Root -> Right Subtree.',
    time: '10:08 AM'
  },
  {
    id: 'msg-5',
    senderId: 'part-4',
    senderName: 'Blessing Temitope Ajayi',
    senderRole: 'Student',
    senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
    text: 'Sir, I have raised my hand regarding the node deletion algorithm when a node has two children.',
    time: '10:14 AM'
  }
];

export const MOCK_ADMIN_METRICS = {
  totalStudents: 420,
  totalLecturers: 28,
  totalCourses: 32,
  activeLectures: 3,
  totalLectureSessions: 142,
  overallAttendanceRate: 88.4,
  departmentsCount: 7,
  bandwidthUsageGb: 418.6
};

export const MOCK_STUDENTS = MOCK_STUDENTS_LIST;
export const MOCK_LECTURERS = MOCK_LECTURERS_LIST;
export const MOCK_CLASSROOM_STATE = {
  lectureTitle: 'Binary Search Trees & Tree Traversal Algorithms',
  courseCode: 'COM 221',
  lecturer: 'Engr. Dr. K. A. Adeleke',
  participants: MOCK_CLASSROOM_PARTICIPANTS,
  chat: MOCK_CLASSROOM_CHAT
};

export const MOCK_GENERAL_SESSIONS = [
  {
    id: 'gen-ses-01',
    sessionType: 'general',
    title: 'ND2 Software Project Defence & Methodology Q&A',
    category: 'Project Discussion',
    description: 'Interactive coordination and feedback session for ND2 Computer Science final year software project defense preparation, system architecture diagrams, and testing methodologies.',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    lecturerId: 'usr-lec-01',
    lecturerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: '2026-08-12',
    dateFormatted: 'Today, Aug 12',
    startTime: '04:00 PM',
    endTime: '05:30 PM',
    duration: '90 mins',
    mode: 'video',
    status: 'live',
    meetingId: 'room-gen-nd2-project',
    attendeesCount: 28,
    maxCapacity: 100,
    allowStudentScreenShare: true,
    recordSession: true,
    autoAttendance: true
  },
  {
    id: 'gen-ses-02',
    sessionType: 'general',
    title: 'Departmental Academic Planning & Curriculum Review',
    category: 'Department Meeting',
    description: 'Faculty and student representative voice conference on second semester continuous assessment timelines, laboratory equipment allocation, and exam schedule.',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    lecturerId: 'usr-lec-01',
    lecturerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: '2026-08-14',
    dateFormatted: 'Friday, Aug 14',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    duration: '90 mins',
    mode: 'voice',
    status: 'scheduled',
    meetingId: 'room-gen-dept-meeting',
    attendeesCount: 0,
    maxCapacity: 50,
    allowStudentScreenShare: false,
    recordSession: true,
    autoAttendance: false
  },
  {
    id: 'gen-ses-03',
    sessionType: 'general',
    title: 'Faculty Student Office Consultation Hour',
    category: 'Student Consultation',
    description: 'Open door virtual office hours for academic advising, course registration queries, and career mentoring for ND2 students.',
    lecturer: 'Engr. Dr. K. A. Adeleke',
    lecturerId: 'usr-lec-01',
    lecturerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: '2026-08-18',
    dateFormatted: 'Tuesday, Aug 18',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    duration: '120 mins',
    mode: 'video',
    status: 'scheduled',
    meetingId: 'room-gen-office-hour',
    attendeesCount: 0,
    maxCapacity: 30,
    allowStudentScreenShare: true,
    recordSession: false,
    autoAttendance: false
  },
  {
    id: 'gen-ses-04',
    sessionType: 'general',
    title: 'ICT Entrepreneurship & Innovation Seminar',
    category: 'Seminar',
    description: 'Special guest presentation on tech startup funding, IP rights, software patents, and business incubator opportunities for Computer Science graduates.',
    lecturer: 'Chief M. A. Ogundele',
    lecturerId: 'usr-lec-06',
    lecturerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    date: '2026-08-05',
    dateFormatted: 'Wed, Aug 05 (Completed)',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    duration: '120 mins',
    mode: 'video',
    status: 'completed',
    meetingId: 'room-gen-entrepreneurship',
    attendeesCount: 85,
    maxCapacity: 150,
    allowStudentScreenShare: true,
    recordSession: true,
    autoAttendance: true
  }
];


