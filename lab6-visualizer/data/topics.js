export const topicDefinitions = [
  {
    key: "bstSearch",
    navGroup: "BST",
    name: "BST — Пошук",
    shortName: "Пошук",
    description: "Побачиш, як дерево відсікає половину варіантів на кожному порівнянні.",
    badge: "1 сценарій",
    accent: "#3b82f6",
    icon: "tree",
    scenarioIds: ["bst-search"],
    customType: "search"
  },
  {
    key: "bstDelete",
    navGroup: "BST",
    name: "BST — Видалення",
    shortName: "Видалення",
    description: "Розбереш листок, один син і складний випадок із successor.",
    badge: "3 сценарії",
    accent: "#3b82f6",
    icon: "tree",
    scenarioIds: ["delete-leaf", "delete-one-child", "delete-two-children"],
    customType: "delete"
  },
  {
    key: "leftRotate",
    navGroup: "Повороти",
    name: "Лівий поворот",
    shortName: "Лівий поворот",
    description: "Покроково побачиш, як правий син піднімається над вузлом.",
    badge: "1 сценарій",
    accent: "#f59e0b",
    icon: "rotateLeft",
    scenarioIds: ["left-rotate"],
    customType: "leftRotate"
  },
  {
    key: "rightRotate",
    navGroup: "Повороти",
    name: "Правий поворот",
    shortName: "Правий поворот",
    description: "Дзеркальний поворот із переносом піддерева B без втрати BST-порядку.",
    badge: "1 сценарій",
    accent: "#f59e0b",
    icon: "rotateRight",
    scenarioIds: ["right-rotate"],
    customType: "rightRotate"
  },
  {
    key: "avlInsert",
    navGroup: "AVL",
    name: "AVL — Вставка",
    shortName: "Вставка",
    description: "Вставка, підйом до кореня, перерахунок висот і балансування.",
    badge: "4 сценарії",
    accent: "#22c55e",
    icon: "balance",
    scenarioIds: ["avl-ll", "avl-rr", "avl-lr", "avl-rl"],
    customType: "avl"
  },
  {
    key: "avlCases",
    navGroup: "AVL",
    name: "AVL — Випадки LL / RR / LR / RL",
    shortName: "Випадки LL/RR/LR/RL",
    description: "Порівняєш одиночні та подвійні повороти в AVL.",
    badge: "4 сценарії",
    accent: "#22c55e",
    icon: "balance",
    scenarioIds: ["avl-ll", "avl-rr", "avl-lr", "avl-rl"],
    customType: "avl"
  }
];
