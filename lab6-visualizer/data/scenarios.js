// Pure data — no references to generator functions.
// The `build` property is wired in main.js via SCENARIO_BUILDERS.
export const scenarioDefinitions = [
  {
    id: "bst-search",
    title: "BST-пошук: знайти 15 у [20, 10, 30, 5, 15]",
    group: "BST-пошук",
    topicKey: "bstSearch",
    quizKey: "bstSearch",
    codeKey: "bstSearch"
  },
  {
    id: "left-rotate",
    title: "Лівий поворот: [40, 20, 60, 50, 70], x = 40",
    group: "Лівий поворот",
    topicKey: "leftRotate",
    quizKey: "leftRotate",
    codeKey: "leftRotate"
  },
  {
    id: "right-rotate",
    title: "Правий поворот: [60, 40, 70, 20, 50], y = 60",
    group: "Правий поворот",
    topicKey: "rightRotate",
    quizKey: "rightRotate",
    codeKey: "rightRotate"
  },
  {
    id: "delete-leaf",
    title: "BST-видалення: листок, видалити 10",
    group: "BST-видалення",
    topicKey: "bstDelete",
    quizKey: "bstDelete",
    codeKey: "bstDelete"
  },
  {
    id: "delete-one-child",
    title: "BST-видалення: один син, видалити 10",
    group: "BST-видалення",
    topicKey: "bstDelete",
    quizKey: "bstDelete",
    codeKey: "bstDelete"
  },
  {
    id: "delete-two-children",
    title: "BST-видалення: два сини, successor не прямий",
    group: "BST-видалення",
    topicKey: "bstDelete",
    quizKey: "bstDelete",
    codeKey: "bstDelete"
  },
  {
    id: "avl-ll",
    title: "AVL-вставка LL: [30, 20, 10]",
    group: "AVL-вставка",
    topicKey: "avlInsert",
    quizKey: "avlLL",
    codeKey: "avlInsert"
  },
  {
    id: "avl-rr",
    title: "AVL-вставка RR: [10, 20, 30]",
    group: "AVL-вставка",
    topicKey: "avlInsert",
    quizKey: "avlRR",
    codeKey: "avlInsert"
  },
  {
    id: "avl-lr",
    title: "AVL-вставка LR: [30, 10, 20]",
    group: "AVL-вставка",
    topicKey: "avlInsert",
    quizKey: "avlLR",
    codeKey: "avlInsert"
  },
  {
    id: "avl-rl",
    title: "AVL-вставка RL: [10, 30, 20]",
    group: "AVL-вставка",
    topicKey: "avlInsert",
    quizKey: "avlRL",
    codeKey: "avlInsert"
  }
];
