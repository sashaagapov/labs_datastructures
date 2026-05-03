const homeScreen = document.getElementById("homeScreen");
const visualizerScreen = document.getElementById("visualizerScreen");
const topicGrid = document.getElementById("topicGrid");
const resetProgressLink = document.getElementById("resetProgressLink");
const backToTopicsBtn = document.getElementById("backToTopicsBtn");
const sidebarNav = document.getElementById("sidebarNav");
const activeTopicTitle = document.getElementById("activeTopicTitle");
const scenarioSelect = document.getElementById("scenarioSelect");
const customFields = document.getElementById("customFields");
const customError = document.getElementById("customError");
const treeSvg = document.getElementById("treeSvg");
const treeTitle = document.getElementById("treeTitle");
const codeBlock = document.getElementById("codeBlock");
const explanationText = document.getElementById("explanationText");
const invariantBox = document.getElementById("invariantBox");
const variablesTable = document.getElementById("variablesTable");
const explanationLevelToggle = document.getElementById("explanationLevelToggle");
const defenseModeToggle = document.getElementById("defenseModeToggle");
const defenseHintCard = document.getElementById("defenseHintCard");
const defenseHintText = document.getElementById("defenseHintText");
const prevBtn = document.getElementById("prevBtn");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const quizBtn = document.getElementById("quizBtn");
const stepCounter = document.getElementById("stepCounter");
const quizOverlay = document.getElementById("quizOverlay");
const quizTitle = document.getElementById("quizTitle");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizNextBtn = document.getElementById("quizNextBtn");
const quizCloseBtn = document.getElementById("quizCloseBtn");

const progressStorageKey = "lab6viz_progress";

let currentTopic = null;
let currentScenario = null;
let steps = [];
let currentIndex = 0;
let playTimer = null;
let explanationLevel = "normal";
let defenseModeEnabled = false;
let progressState = readProgress();
let quizState = null;

const defenseHints = {
  "bstSearch": `
    <ul>
      <li><strong>Інваріант BST:</strong> лівий син &lt; батько &lt; правий син.</li>
      <li>Тому при пошуку ми порівнюємо <em>target</em> із поточним вузлом.</li>
      <li>Якщо <em>target</em> менший — ідемо вліво.</li>
      <li>Якщо <em>target</em> більший — вправо.</li>
      <li>Це дозволяє <strong>не переглядати все дерево</strong>, скорочуючи час пошуку до O(h).</li>
    </ul>
  `,
  "bstDelete": `
    <ul>
      <li>Спочатку шукаємо вузол $z$, який треба видалити.</li>
      <li>Якщо <strong>0 дітей:</strong> просто прибираємо вузол (замінюємо на null).</li>
      <li>Якщо <strong>1 дитина:</strong> ця дитина стає на місце видаленого вузла (операція Transplant).</li>
      <li>Якщо <strong>2 дитини:</strong> шукаємо <em>successor</em> (наступника) — мінімум у правому піддереві.</li>
      <li>Наступник переноситься на місце $z$.</li>
      <li>Функція Transplant потрібна, щоб надійно оновити зв'язки parent та root.</li>
    </ul>
  `,
  "leftRotate": `
    <ul>
      <li>$y = x.Right$ (правий син $x$).</li>
      <li>Вузол $y$ піднімається на місце $x$.</li>
      <li>Вузол $x$ "опускається" і стає лівим сином $y$.</li>
      <li>Ліве піддерево $y$ ($B = y.Left$) переходить у праве піддерево $x$ ($x.Right$).</li>
      <li><strong>BST інваріант зберігається:</strong> оскільки $x < B < y$, $B$ ідеально стає правим сином $x$.</li>
      <li>Якщо $x$ був коренем, $y$ стає новим коренем (root змінюється).</li>
    </ul>
  `,
  "rightRotate": `
    <ul>
      <li>$x = y.Left$ (лівий син $y$).</li>
      <li>Вузол $x$ піднімається на місце $y$.</li>
      <li>Вузол $y$ "опускається" і стає правим сином $x$.</li>
      <li>Праве піддерево $x$ ($B = x.Right$) переходить у ліве піддерево $y$ ($y.Left$).</li>
      <li><strong>BST інваріант зберігається:</strong> оскільки $x < B < y$, $B$ ідеально стає лівим сином $y$.</li>
      <li>Якщо $y$ був коренем, $x$ стає новим коренем (root змінюється).</li>
    </ul>
  `,
  "avlInsert": `
    <ul>
      <li><strong>AVL</strong> — це збалансоване BST (висоти піддерев відрізняються не більше ніж на 1).</li>
      <li><strong>Balance Factor (bf)</strong> = <em>height(left) - height(right)</em>. Допустимі значення: -1, 0, 1.</li>
      <li>Вставка починається як у звичайному BST.</li>
      <li>Після вставки ми <strong>піднімаємось назад до кореня</strong> (bottom-up).</li>
      <li>Перераховуємо <em>height</em> і <em>balance factor</em>.</li>
      <li>Якщо знайдено перший дисбаланс, визначаємо його тип: LL, RR, LR або RL.</li>
      <li>LL та RR виправляються одним поворотом, LR та RL — двома.</li>
    </ul>
  `,
  "avlLL": `
    <ul>
      <li><strong>Тип LL:</strong> Вставка відбулася в ліве піддерево лівого сина.</li>
      <li>Ліве піддерево стало занадто "важким".</li>
      <li>Виправляється одним <strong>RightRotate</strong> навколо незбалансованого вузла.</li>
    </ul>
  `,
  "avlRR": `
    <ul>
      <li><strong>Тип RR:</strong> Вставка відбулася в праве піддерево правого сина.</li>
      <li>Праве піддерево стало занадто "важким".</li>
      <li>Виправляється одним <strong>LeftRotate</strong> навколо незбалансованого вузла.</li>
    </ul>
  `,
  "avlLR": `
    <ul>
      <li><strong>Тип LR:</strong> Вставка відбулася в праве піддерево лівого сина.</li>
      <li>Це "зигзагоподібний" дисбаланс, один поворот не допоможе.</li>
      <li>Крок 1: <strong>LeftRotate</strong> навколо лівого сина (перетворює форму на LL).</li>
      <li>Крок 2: <strong>RightRotate</strong> навколо незбалансованого батька.</li>
    </ul>
  `,
  "avlRL": `
    <ul>
      <li><strong>Тип RL:</strong> Вставка відбулася в ліве піддерево правого сина.</li>
      <li>Це "зигзагоподібний" дисбаланс.</li>
      <li>Крок 1: <strong>RightRotate</strong> навколо правого сина (перетворює форму на RR).</li>
      <li>Крок 2: <strong>LeftRotate</strong> навколо незбалансованого батька.</li>
    </ul>
  `,
  "default": \`
    <ul>
      <li>Уважно слідкуйте за тим, які вузли є активними.</li>
      <li>Пояснюйте кожну зміну структури або змінних згідно з алгоритмом.</li>
      <li>Пам'ятайте про властивості структури даних (інваріанти), що зберігаються на кожному кроці.</li>
    </ul>
  \`
};

const codes = {
  bstSearch: [
    "public RecursiveTree Search(RecursiveTree node, int value)",
    "{",
    "    if (node == null || node.Value == value)",
    "        return node;",
    "    if (value < node.Value)",
    "        return Search(node.Left, value);",
    "    return Search(node.Right, value);",
    "}"
  ],
  leftRotate: [
    "public RecursiveTree LeftRotate(RecursiveTree root, RecursiveTree x)",
    "{",
    "    RecursiveTree y = x.Right;",
    "    RecursiveTree B = y.Left;",
    "    x.SetRight(B);",
    "    y.Parent = x.Parent;",
    "    ReplaceParentChild(root, x, y);",
    "    y.SetLeft(x);",
    "    return root;",
    "}"
  ],
  rightRotate: [
    "public RecursiveTree RightRotate(RecursiveTree root, RecursiveTree y)",
    "{",
    "    RecursiveTree x = y.Left;",
    "    RecursiveTree B = x.Right;",
    "    y.SetLeft(B);",
    "    x.Parent = y.Parent;",
    "    ReplaceParentChild(root, y, x);",
    "    x.SetRight(y);",
    "    return root;",
    "}"
  ],
  bstDelete: [
    "public RecursiveTree TreeDelete(RecursiveTree root, RecursiveTree z)",
    "{",
    "    if (z.Left == null)",
    "        Transplant(root, z, z.Right);",
    "    else if (z.Right == null)",
    "        Transplant(root, z, z.Left);",
    "    else",
    "    {",
    "        RecursiveTree y = TreeMinimum(z.Right);",
    "        if (y.Parent != z)",
    "        {",
    "            Transplant(root, y, y.Right);",
    "            y.SetRight(z.Right);",
    "        }",
    "        Transplant(root, z, y);",
    "        y.SetLeft(z.Left);",
    "    }",
    "    return root;",
    "}"
  ],
  avlInsert: [
    "public Node Insert(Node node, int value)",
    "{",
    "    node = BstInsert(node, value);",
    "    UpdateHeight(node);",
    "    int balance = GetBalanceFactor(node);",
    "    if (balance > 1 && value < node.Left.Value)",
    "        return RightRotate(node);     // LL",
    "    if (balance < -1 && value > node.Right.Value)",
    "        return LeftRotate(node);      // RR",
    "    if (balance > 1 && value > node.Left.Value)",
    "    {",
    "        node.Left = LeftRotate(node.Left);",
    "        return RightRotate(node);     // LR",
    "    }",
    "    if (balance < -1 && value < node.Right.Value)",
    "    {",
    "        node.Right = RightRotate(node.Right);",
    "        return LeftRotate(node);      // RL",
    "    }",
    "    return node;",
    "}",
    "",
    "private Node LeftRotate(Node x)",
    "{",
    "    Node y = x.Right;",
    "    Node B = y.Left;",
    "    x.SetRight(B);",
    "    y.Parent = x.Parent;",
    "    ReplaceParentChild(x, y);",
    "    y.SetLeft(x);",
    "    return y;",
    "}",
    "",
    "private Node RightRotate(Node y)",
    "{",
    "    Node x = y.Left;",
    "    Node B = x.Right;",
    "    y.SetLeft(B);",
    "    x.Parent = y.Parent;",
    "    ReplaceParentChild(y, x);",
    "    x.SetRight(y);",
    "    return x;",
    "}"
  ]
};

const scenarioDefinitions = [
  {
    id: "bst-search",
    title: "BST-пошук: знайти 15 у [20, 10, 30, 5, 15]",
    group: "BST-пошук",
    topicKey: "bstSearch",
    quizKey: "bstSearch",
    codeKey: "bstSearch",
    build: () => generateSearchScenario([20, 10, 30, 5, 15], 15)
  },
  {
    id: "left-rotate",
    title: "Лівий поворот: [40, 20, 60, 50, 70], x = 40",
    group: "Лівий поворот",
    topicKey: "leftRotate",
    quizKey: "leftRotate",
    codeKey: "leftRotate",
    build: () => generateLeftRotateScenario()
  },
  {
    id: "right-rotate",
    title: "Правий поворот: [60, 40, 70, 20, 50], y = 60",
    group: "Правий поворот",
    topicKey: "rightRotate",
    quizKey: "rightRotate",
    codeKey: "rightRotate",
    build: () => generateRightRotateScenario()
  },
  {
    id: "delete-leaf",
    title: "BST-видалення: листок, видалити 10",
    group: "BST-видалення",
    topicKey: "bstDelete",
    quizKey: "bstDelete",
    codeKey: "bstDelete",
    build: () => generateDeleteLeafScenario()
  },
  {
    id: "delete-one-child",
    title: "BST-видалення: один син, видалити 10",
    group: "BST-видалення",
    topicKey: "bstDelete",
    quizKey: "bstDelete",
    codeKey: "bstDelete",
    build: () => generateDeleteOneChildScenario()
  },
  {
    id: "delete-two-children",
    title: "BST-видалення: два сини, successor не прямий",
    group: "BST-видалення",
    topicKey: "bstDelete",
    quizKey: "bstDelete",
    codeKey: "bstDelete",
    build: () => generateDeleteTwoChildrenScenario()
  },
  {
    id: "avl-ll",
    title: "AVL-вставка LL: [30, 20, 10]",
    group: "AVL-вставка",
    topicKey: "avlInsert",
    quizKey: "avlLL",
    codeKey: "avlInsert",
    build: () => generateAvlScenario("LL", [30, 20, 10])
  },
  {
    id: "avl-rr",
    title: "AVL-вставка RR: [10, 20, 30]",
    group: "AVL-вставка",
    topicKey: "avlInsert",
    quizKey: "avlRR",
    codeKey: "avlInsert",
    build: () => generateAvlScenario("RR", [10, 20, 30])
  },
  {
    id: "avl-lr",
    title: "AVL-вставка LR: [30, 10, 20]",
    group: "AVL-вставка",
    topicKey: "avlInsert",
    quizKey: "avlLR",
    codeKey: "avlInsert",
    build: () => generateAvlScenario("LR", [30, 10, 20])
  },
  {
    id: "avl-rl",
    title: "AVL-вставка RL: [10, 30, 20]",
    group: "AVL-вставка",
    topicKey: "avlInsert",
    quizKey: "avlRL",
    codeKey: "avlInsert",
    build: () => generateAvlScenario("RL", [10, 30, 20])
  }
];

const topicDefinitions = [
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

const quizDefinitions = {
  bstSearch: {
    title: "Квіз: BST-пошук",
    questions: [
      {
        text: "Що визначає напрямок руху під час BST-пошуку?",
        options: ["Висота вузла", "Порівняння шуканого значення з поточним вузлом", "Кількість листків", "Колір вузла"],
        correct: 1,
        why: "Якщо value менше за node.Value, йдемо ліворуч; якщо більше — праворуч."
      },
      {
        text: "Коли BST-пошук завершується успішно?",
        options: ["Коли дійшли до root", "Коли node.Value дорівнює шуканому значенню", "Коли balance factor = 0", "Після трьох порівнянь"],
        correct: 1,
        why: "Успіх означає, що поточний вузол містить потрібне значення."
      },
      {
        text: "Що означає node == null під час пошуку?",
        options: ["Дерево збалансоване", "Значення не знайдено", "Потрібен поворот", "Знайдено successor"],
        correct: 1,
        why: "Null означає, що потрібної гілки більше немає, тож значення відсутнє."
      }
    ]
  },
  bstDelete: {
    title: "Квіз: BST-видалення",
    questions: [
      {
        text: "Що таке successor вузла z?",
        options: ["Максимум лівого піддерева", "Мінімум правого піддерева", "Батько z", "Правий син z"],
        correct: 1,
        why: "Successor — це наступне більше значення, тобто мінімум правого піддерева."
      },
      {
        text: "Що робить Transplant(u, v)?",
        options: ["Копіює значення v в u", "Видаляє v", "Ставить v на місце u в дереві", "Міняє u і v місцями"],
        correct: 2,
        why: "Transplant перепідключає батька u так, щоб він посилався на v."
      },
      {
        text: "Коли successor y не є прямим правим сином z, що треба зробити спочатку?",
        options: ["Видалити y", "Вирізати y зі старого місця через Transplant(y, y.Right)", "Переставити z", "Нічого"],
        correct: 1,
        why: "Інакше successor залишиться у старому місці й одночасно стане заміною z."
      }
    ]
  },
  leftRotate: {
    title: "Квіз: лівий поворот",
    questions: [
      {
        text: "Який вузол піднімається вгору при LeftRotate(x)?",
        options: ["x", "x.Right", "x.Left", "x.Parent"],
        correct: 1,
        why: "Лівий поворот піднімає правого сина x, тобто y = x.Right."
      },
      {
        text: "Що відбувається з вузлом B (y.Left) під час LeftRotate?",
        options: ["Видаляється", "Стає правим сином x", "Стає лівим сином x", "Не змінюється"],
        correct: 1,
        why: "B лежить між x та y, тому після повороту має стати x.Right."
      },
      {
        text: "Чи зберігається BST-інваріант після LeftRotate?",
        options: ["Так, якщо перед поворотом виконувалося x < B < y", "Ні, ламається", "Тільки якщо дерево ідеально збалансоване", "Тільки для AVL"],
        correct: 0,
        why: "Поворот не міняє порядок значень, він лише перепідключає ребра."
      }
    ]
  },
  rightRotate: {
    title: "Квіз: правий поворот",
    questions: [
      {
        text: "Який вузол піднімається вгору при RightRotate(y)?",
        options: ["y", "y.Right", "y.Left", "root завжди"],
        correct: 2,
        why: "Правий поворот піднімає лівого сина y, тобто x = y.Left."
      },
      {
        text: "Що стається з B = x.Right під час RightRotate?",
        options: ["Стає лівим сином y", "Стає правим сином y", "Видаляється", "Стає root завжди"],
        correct: 0,
        why: "B лежить між x та y, тому після повороту має бути y.Left."
      },
      {
        text: "Навіщо потрібен RightRotate?",
        options: ["Щоб прибрати всі листки", "Щоб підняти ліве піддерево без порушення BST", "Щоб знайти successor", "Щоб поміняти значення вузлів"],
        correct: 1,
        why: "Поворот змінює форму дерева, але не порядок значень."
      }
    ]
  },
  avlLL: {
    title: "Квіз: AVL LL",
    questions: [
      {
        text: "Яке значення balance factor вважається порушенням AVL?",
        options: ["0", "+1 або -1", "+2 або -2", "будь-яке невід'ємне"],
        correct: 2,
        why: "AVL дозволяє тільки -1, 0 або +1; +2 чи -2 означає дисбаланс."
      },
      {
        text: "Який поворот виконується при випадку LL?",
        options: ["LeftRotate", "RightRotate", "Подвійний поворот", "Жодного"],
        correct: 1,
        why: "LL означає важке ліве-ліве плече, тому потрібен RightRotate."
      },
      {
        text: "Що означає випадок LL?",
        options: ["Два лівих повороти поспіль", "Новий вузол вставлено в ліве піддерево лівого сина", "Обидва сини мають від'ємний balance", "Left-Right дисбаланс"],
        correct: 1,
        why: "Шлях вставки йде ліворуч, потім ще раз ліворуч."
      }
    ]
  },
  avlRR: {
    title: "Квіз: AVL RR",
    questions: [
      {
        text: "Який balance factor показує занадто важке праве піддерево?",
        options: ["+2", "-2", "0", "+1"],
        correct: 1,
        why: "bf = leftHeight - rightHeight, тому важке праве піддерево дає від'ємне значення."
      },
      {
        text: "Який поворот потрібен у випадку RR?",
        options: ["RightRotate", "LeftRotate", "RightRotate потім LeftRotate", "Transplant"],
        correct: 1,
        why: "RR виправляється одним LeftRotate."
      },
      {
        text: "Що піднімається при RR-балансуванні?",
        options: ["Лівий син", "Правий син", "Successor", "Parent"],
        correct: 1,
        why: "LeftRotate піднімає правого сина дисбалансного вузла."
      }
    ]
  },
  avlLR: {
    title: "Квіз: AVL LR",
    questions: [
      {
        text: "Скільки поворотів потрібно для LR?",
        options: ["0", "1", "2", "3"],
        correct: 2,
        why: "LR — це подвійний поворот: LeftRotate(leftChild), потім RightRotate."
      },
      {
        text: "Який перший поворот у LR?",
        options: ["RightRotate(node)", "LeftRotate(leftChild)", "LeftRotate(node)", "Transplant"],
        correct: 1,
        why: "Спочатку вирівнюємо лівого сина лівим поворотом."
      },
      {
        text: "Навіщо перший поворот у LR?",
        options: ["Щоб зробити форму LL", "Щоб видалити вузол", "Щоб знайти root", "Щоб скинути height"],
        correct: 0,
        why: "Після першого повороту другий стандартний RightRotate завершує балансування."
      }
    ]
  },
  avlRL: {
    title: "Квіз: AVL RL",
    questions: [
      {
        text: "Скільки поворотів потрібно для RL?",
        options: ["0", "1", "2", "4"],
        correct: 2,
        why: "RL — це подвійний поворот: RightRotate(rightChild), потім LeftRotate."
      },
      {
        text: "Який перший поворот у RL?",
        options: ["LeftRotate(node)", "RightRotate(rightChild)", "RightRotate(node)", "TreeMinimum"],
        correct: 1,
        why: "Спочатку вирівнюємо правого сина правим поворотом."
      },
      {
        text: "На що перетворюється RL після першого повороту?",
        options: ["LL", "RR", "BST-видалення", "випадок листка"],
        correct: 1,
        why: "Після RightRotate(rightChild) ситуація стає RR і завершується LeftRotate."
      }
    ]
  }
};

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressStorageKey) || "{}");
  } catch {
    return {};
  }
}

function writeProgress() {
  try {
    localStorage.setItem(progressStorageKey, JSON.stringify(progressState));
  } catch {
    // Якщо браузер блокує localStorage, візуалізатор усе одно працює без прогресу.
  }
}

function progressLabel(status) {
  if (status === "done") {
    return "Переглянуто ✓";
  }

  if (status === "in-progress") {
    return "В процесі";
  }

  return "Не переглянуто";
}

function markProgress(topicKey, status) {
  if (!topicKey || progressState[topicKey] === "done") {
    return;
  }

  progressState[topicKey] = status;
  writeProgress();
  renderProgressUi();
}

function topicIcon(type) {
  const icons = {
    tree: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8v48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="14" r="8" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="18" cy="34" r="8" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="46" cy="34" r="8" fill="none" stroke="currentColor" stroke-width="4"/><path d="M32 22 18 26m14-4 14 4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
    rotateLeft: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M42 14H24a14 14 0 0 0 0 28h18" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M28 6 18 14l10 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="44" cy="42" r="7" fill="none" stroke="currentColor" stroke-width="4"/></svg>`,
    rotateRight: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 14h18a14 14 0 0 1 0 28H22" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="m36 6 10 8-10 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="42" r="7" fill="none" stroke="currentColor" stroke-width="4"/></svg>`,
    balance: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 10v44M18 22h28M18 22l-9 18h18L18 22Zm28 0-9 18h18l-9-18Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  return icons[type] ?? icons.tree;
}

function renderHome() {
  topicGrid.innerHTML = "";

  topicDefinitions.forEach((topic) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "topic-card";
    card.style.setProperty("--accent", topic.accent);
    card.dataset.topic = topic.key;
    card.innerHTML = `
      ${topicIcon(topic.icon)}
      <h2>${topic.name}</h2>
      <p>${topic.description}</p>
      <div class="topic-meta">
        <span class="topic-badge">${topic.badge}</span>
        <span class="progress-badge ${progressState[topic.key] || "todo"}">${progressLabel(progressState[topic.key])}</span>
      </div>
    `;
    card.addEventListener("click", () => openTopic(topic.key));
    topicGrid.appendChild(card);
  });
}

function renderSidebar() {
  sidebarNav.innerHTML = "";
  const groups = [...new Set(topicDefinitions.map((topic) => topic.navGroup))];

  groups.forEach((groupName) => {
    const group = document.createElement("section");
    group.className = "sidebar-group";

    const title = document.createElement("p");
    title.className = "sidebar-group-title";
    title.textContent = groupName;
    group.appendChild(title);

    topicDefinitions
      .filter((topic) => topic.navGroup === groupName)
      .forEach((topic) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `sidebar-topic${currentTopic && currentTopic.key === topic.key ? " active" : ""}`;
        button.dataset.topic = topic.key;
        button.innerHTML = `<span class="progress-dot ${progressState[topic.key] || "todo"}"></span><span>${topic.shortName}</span>`;
        button.addEventListener("click", () => openTopic(topic.key));
        group.appendChild(button);
      });

    sidebarNav.appendChild(group);
  });
}

function renderProgressUi() {
  renderHome();
  renderSidebar();
}

function showHome() {
  stopPlay();
  quizOverlay.classList.add("hidden");
  visualizerScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  renderProgressUi();
}

function showVisualizer() {
  homeScreen.classList.add("hidden");
  visualizerScreen.classList.remove("hidden");
}

class TreeNode {
  constructor(value) {
    this.id = nodeId(value);
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 1;
    this.balanceFactor = 0;
  }
}

function nodeId(value) {
  return `n${value}`;
}

function valueOf(node) {
  return node ? node.value : null;
}

function buildBst(values) {
  const tree = {
    root: null,
    nodes: new Map()
  };

  values.forEach((value) => insertPlain(tree, value));
  recomputeAll(tree);
  return tree;
}

function insertPlain(tree, value) {
  const node = new TreeNode(value);
  tree.nodes.set(node.id, node);

  if (!tree.root) {
    tree.root = node;
    return node;
  }

  let current = tree.root;
  let parent = null;

  while (current) {
    parent = current;
    current = value < current.value ? current.left : current.right;
  }

  node.parent = parent;

  if (value < parent.value) {
    parent.left = node;
  } else {
    parent.right = node;
  }

  recomputeAll(tree);
  return node;
}

function find(tree, value) {
  return tree.nodes.get(nodeId(value)) ?? null;
}

function setLeft(parent, child) {
  parent.left = child;
  if (child) {
    child.parent = parent;
  }
}

function setRight(parent, child) {
  parent.right = child;
  if (child) {
    child.parent = parent;
  }
}

function replaceAtParent(tree, oldNode, newNode) {
  const parent = oldNode.parent;

  if (!parent) {
    tree.root = newNode;
  } else if (parent.left === oldNode) {
    parent.left = newNode;
  } else if (parent.right === oldNode) {
    parent.right = newNode;
  }

  if (newNode) {
    newNode.parent = parent;
  }
}

function detachFromParent(tree, node) {
  if (!node.parent) {
    tree.root = null;
    return;
  }

  if (node.parent.left === node) {
    node.parent.left = null;
  } else if (node.parent.right === node) {
    node.parent.right = null;
  }

  node.parent = null;
}

function transplant(tree, oldNode, newNode) {
  replaceAtParent(tree, oldNode, newNode);
  oldNode.parent = null;
  oldNode.left = null;
  oldNode.right = null;
}

function treeMinimum(node) {
  let current = node;
  while (current.left) {
    current = current.left;
  }
  return current;
}

function recomputeAll(tree) {
  const seen = new Set();

  function height(node) {
    if (!node || seen.has(node.id)) {
      return node ? node.height : 0;
    }

    seen.add(node.id);
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);
    node.height = Math.max(leftHeight, rightHeight) + 1;
    node.balanceFactor = leftHeight - rightHeight;
    return node.height;
  }

  if (tree.root) {
    height(tree.root);
  }

  tree.nodes.forEach((node) => {
    if (!seen.has(node.id)) {
      height(node);
    }
  });
}

function serializeTree(tree, detachedRootIds = []) {
  recomputeAll(tree);

  const nodes = {};
  tree.nodes.forEach((node) => {
    nodes[node.id] = {
      id: node.id,
      value: node.value,
      left: node.left ? node.left.id : null,
      right: node.right ? node.right.id : null,
      parent: node.parent ? node.parent.id : null,
      height: node.height,
      balanceFactor: node.balanceFactor
    };
  });

  return {
    rootId: tree.root ? tree.root.id : null,
    detachedRootIds: detachedRootIds.filter((id) => id && id !== (tree.root && tree.root.id)),
    nodes
  };
}

function firstSentence(text) {
  const match = String(text ?? "").match(/[^.!?。]+[.!?。]/);
  return match ? match[0].trim() : String(text ?? "").trim();
}

function buildDeepExplanation(normalText, invariantText) {
  const base = String(normalText ?? "").trim();
  const invariant = String(invariantText ?? "").trim();
  return `${base} Важливо для коректності алгоритму: цей крок не є декоративним, він зберігає потрібні зв'язки між піддеревами, щоб наступні операції працювали з правильними parent/child-посиланнями. ${invariant}`;
}

function addStep(targetSteps, tree, options) {
  const normal = options.explanationNormal ?? options.explanation ?? "";
  const invariant = options.invariant ?? "BST порядок збережено: лівий < вузол < правий.";

  targetSteps.push({
    treeSnapshot: serializeTree(tree, options.detachedRootIds ?? []),
    activeNodeIds: options.activeNodeIds ?? [],
    codeLine: options.codeLine ?? 0,
    variables: options.variables ?? {},
    explanation: normal,
    explanationShort: options.explanationShort ?? firstSentence(normal),
    explanationNormal: normal,
    explanationDeep: options.explanationDeep ?? buildDeepExplanation(normal, invariant),
    invariant,
    invariantStatus: options.invariantStatus ?? "ok",
    showAvlLabels: Boolean(options.showAvlLabels)
  });
}

function generateSearchScenario(values = [20, 10, 30, 5, 15], target = 15) {
  const tree = buildBst(values);
  const steps = [];
  let current = tree.root;
  let parent = null;

  addStep(steps, tree, {
    activeNodeIds: current ? [current.id] : [],
    codeLine: 0,
    variables: { node: valueOf(current), parent: null, target, root: valueOf(tree.root) },
    explanation: `Починаємо BST-пошук значення ${target} з кореня ${valueOf(tree.root)}. Це потрібно, бо правило BST гарантує, що всі менші значення лежать ліворуч, а всі більші — праворуч; після цього кроку поточним вузлом стає root.`,
    invariant: "BST інваріант: ліве піддерево < вузол < праве піддерево ✓"
  });

  while (current) {
    addStep(steps, tree, {
      activeNodeIds: [current.id],
      codeLine: 2,
      variables: { node: current.value, parent: valueOf(parent), target, root: valueOf(tree.root) },
      explanation: `Порівнюємо target = ${target} із поточним вузлом ${current.value}. Це потрібно, щоб зрозуміти, чи знайдено значення, чи можна відкинути одну половину дерева; після цього кроку алгоритм або завершується, або обирає напрямок руху.`,
      invariant: "BST інваріант дозволяє не перевіряти обидва піддерева одночасно ✓"
    });

    if (current.value === target) {
      addStep(steps, tree, {
        activeNodeIds: [current.id],
        codeLine: 3,
        variables: { node: `${current.value} ← знайдено`, parent: valueOf(parent), target, root: valueOf(tree.root) },
        explanation: `Значення знайдено: node.Value дорівнює target = ${target}. Це завершує BST-пошук, бо алгоритм повертає перший вузол із потрібним значенням; після цього кроку результатом є вузол ${current.value}.`,
        invariant: "BST інваріант: знайдений вузол лежить на єдиному коректному шляху пошуку ✓"
      });
      return steps;
    }

    parent = current;
    if (target < current.value) {
      current = current.left;
      addStep(steps, tree, {
        activeNodeIds: current ? [parent.id, current.id] : [parent.id],
        codeLine: 5,
        variables: { node: valueOf(current), parent: parent.value, target, root: valueOf(tree.root) },
        explanation: `target = ${target} менший за ${parent.value}, тому переходимо в ліве піддерево. Це потрібно, бо всі значення праворуч від ${parent.value} більші за нього і не можуть дорівнювати target; після цього кроку node вказує на ${formatValue(valueOf(current))}.`,
        invariant: `BST інваріант: target(${target}) < parent(${parent.value}), отже рух ліворуч коректний ✓`
      });
    } else {
      current = current.right;
      addStep(steps, tree, {
        activeNodeIds: current ? [parent.id, current.id] : [parent.id],
        codeLine: 6,
        variables: { node: valueOf(current), parent: parent.value, target, root: valueOf(tree.root) },
        explanation: `target = ${target} більший за ${parent.value}, тому переходимо в праве піддерево. Це потрібно, бо всі значення ліворуч від ${parent.value} менші за нього і не можуть дорівнювати target; після цього кроку node вказує на ${formatValue(valueOf(current))}.`,
        invariant: `BST інваріант: target(${target}) > parent(${parent.value}), отже рух праворуч коректний ✓`
      });
    }
  }

  addStep(steps, tree, {
    codeLine: 2,
    variables: { node: null, parent: valueOf(parent), target, root: valueOf(tree.root) },
    explanation: `Поточний node став null, тому значення ${target} не знайдено в дереві. Це означає, що коректний шлях пошуку закінчився без збігу; після цього кроку алгоритм повертає null.`,
    invariant: "BST інваріант: якщо шлях завершився null, такого значення в дереві немає ✓"
  });

  return steps;
}

function generateLeftRotateScenario() {
  const tree = buildBst([40, 20, 60, 50, 70]);
  const steps = [];
  const x = find(tree, 40);
  const y = x.right;
  const b = y.left;

  addStep(steps, tree, {
    activeNodeIds: [x.id],
    codeLine: 0,
    variables: { x: 40, y: null, B: null, root: 40 },
    explanation: "Початковий стан: x = 40 є коренем піддерева, яке треба повернути вліво, бо правий син y = 60 має піднятися вище без порушення BST-порядку. Після цього кроку вказівники ще не змінені, ми лише визначили вузол, навколо якого буде поворот.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    codeLine: 2,
    variables: { x: 40, y: 60, B: 50, root: 40 },
    explanation: "Зберігаємо y = x.Right, тобто y стає вузол 60. Це потрібно, бо саме правий син x підніматиметься на місце x під час лівого повороту, а результатом цього кроку є зафіксована змінна y для наступних перепідключень.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  y.left = null;
  y.parent = null;
  setRight(x, b);
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id, b.id],
    codeLine: 4,
    variables: { x: 40, y: 60, B: 50, root: 40 },
    explanation: "Виконуємо x.SetRight(y.Left): вузол B = 50 переходить із лівого посилання y у праве посилання x. Це необхідно, бо B більший за x, але менший за y, тому після повороту він має бути правим сином x; у результаті x.Right уже вказує на 50.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  y.parent = x.parent;
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id],
    codeLine: 5,
    variables: { x: 40, y: "60, Parent = null", B: 50, root: 40 },
    explanation: "Виконуємо y.Parent = x.Parent: батьківський вказівник y стає таким самим, як був у x. Це потрібно, щоб y міг зайняти позицію x у батьківській ієрархії; після цього y уже готовий стати новою вершиною піддерева.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  replaceAtParent(tree, x, y);
  x.parent = null;
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id],
    codeLine: 6,
    variables: { x: 40, y: 60, B: 50, root: "60 ← новий root" },
    explanation: "Виконуємо ReplaceParentChild(root, x, y): оскільки x був коренем, root перемикається з 40 на 60. Це потрібно, щоб дерево тримало зверху вузол y, і після цього кроку саме 60 стає новим коренем піддерева.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  setLeft(y, x);
  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    codeLine: 7,
    variables: { x: 40, y: 60, B: 50, root: 60 },
    explanation: "Виконуємо y.SetLeft(x): вузол x = 40 стає лівим сином y = 60. Це потрібно, бо всі значення під x менші за y, і після цього кроку лівий поворот завершено: 60 зверху, 40 ліворуч, B = 50 праворуч від 40.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  return steps;
}

function generateRightRotateScenario() {
  const tree = buildBst([60, 40, 70, 20, 50]);
  const steps = [];
  const y = find(tree, 60);
  const x = y.left;
  const b = x.right;

  addStep(steps, tree, {
    activeNodeIds: [y.id],
    codeLine: 0,
    variables: { x: null, y: 60, B: null, root: 60 },
    explanation: "Початковий стан: y = 60 є коренем піддерева, яке треба повернути вправо, бо лівий син x = 40 має піднятися вище без порушення BST-порядку. Після цього кроку вказівники ще не змінені.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    codeLine: 2,
    variables: { x: 40, y: 60, B: 50, root: 60 },
    explanation: "Зберігаємо x = y.Left, тобто x стає вузол 40. Це потрібно, бо саме лівий син y підніматиметься на місце y під час правого повороту, а результатом цього кроку є зафіксована змінна x для наступних перепідключень.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  x.right = null;
  x.parent = null;
  setLeft(y, b);
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id, b.id],
    codeLine: 4,
    variables: { x: 40, y: 60, B: 50, root: 60 },
    explanation: "Виконуємо y.SetLeft(x.Right): вузол B = 50 переходить із правого посилання x у ліве посилання y. Це необхідно, бо B більший за x, але менший за y, тому після повороту він має бути лівим сином y; у результаті y.Left уже вказує на 50.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  x.parent = y.parent;
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id],
    codeLine: 5,
    variables: { x: "40, Parent = null", y: 60, B: 50, root: 60 },
    explanation: "Виконуємо x.Parent = y.Parent: батьківський вказівник x стає таким самим, як був у y. Це потрібно, щоб x міг зайняти позицію y у батьківській ієрархії; після цього x готовий стати новою вершиною піддерева.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  replaceAtParent(tree, y, x);
  y.parent = null;
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id],
    codeLine: 6,
    variables: { x: 40, y: 60, B: 50, root: "40 ← новий root" },
    explanation: "Виконуємо ReplaceParentChild(root, y, x): оскільки y був коренем, root перемикається з 60 на 40. Це потрібно, щоб дерево тримало зверху вузол x, і після цього кроку саме 40 стає новим коренем піддерева.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  setRight(x, y);
  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    codeLine: 7,
    variables: { x: 40, y: 60, B: 50, root: 40 },
    explanation: "Виконуємо x.SetRight(y): вузол y = 60 стає правим сином x = 40. Це потрібно, бо всі значення під y більші за x, і після цього кроку правий поворот завершено: 40 зверху, 60 праворуч, B = 50 ліворуч від 60.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  return steps;
}

function generateDeleteLeafScenario() {
  const tree = buildBst([20, 10, 30]);
  const steps = [];
  const z = find(tree, 10);

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    codeLine: 0,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Знайдено z = 10, вузол для видалення, і його батьком є 20. Це потрібно зробити перед будь-яким Transplant, бо алгоритм має знати, яке саме посилання батька буде змінено; після цього кроку ми готові перевіряти дітей z.",
    invariant: "BST інваріант: 10 < parent(20) < 30 ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    codeLine: 2,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Перевіряємо z.Left == null і бачимо, що вузол 10 не має лівого сина; також його правий син дорівнює null. Це правило видалення листка: якщо дітей немає, то посилання батька можна переключити на null, і після цього z буде від'єднаний.",
    invariant: "BST інваріант: видалення листка не змінює порядок інших вузлів ✓"
  });

  transplant(tree, z, null);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [z.id],
    codeLine: 3,
    variables: { z: "10 ← вирізано", y: null, parent: "20.Left = null" },
    explanation: "Виконуємо Transplant(root, z, z.Right), де z.Right = null, тому посилання parent.Left перемикається з 10 на null. Це потрібно, щоб фізично вирізати листок із дерева, і після цього вузол 10 більше не належить основному BST.",
    invariant: "BST інваріант: у дереві лишилися 20 < 30 ✓"
  });

  return steps;
}

function generateDeleteOneChildScenario() {
  const tree = buildBst([20, 10, 30, 5]);
  const steps = [];
  const z = find(tree, 10);
  const child = z.left;

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    codeLine: 0,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Знайдено z = 10, вузол для видалення, і його батьком є 20. Це потрібно, щоб алгоритм знав, яке батьківське посилання буде перепідключене; після цього кроку перевіряємо, скільки дітей має z.",
    invariant: "BST інваріант: 5 < z(10) < parent(20) < 30 ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [z.id, child.id],
    codeLine: 4,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Перевірка показує, що z.Right == null, а z.Left = 5, тобто у вузла 10 є рівно один син. За правилом BST-видалення єдиний син може зайняти місце z, бо все піддерево 5 менше за parent = 20; після цього кроку готуємо Transplant(z, z.Left).",
    invariant: "BST інваріант: піддерево 5 повністю менше за parent(20) ✓"
  });

  transplant(tree, z, child);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [child.id, z.id],
    codeLine: 5,
    variables: { z: "10 ← вирізано", y: null, parent: "20.Left = 5" },
    explanation: "Виконуємо Transplant(root, z, z.Left): посилання parent.Left перемикається з 10 на 5. Це потрібно, щоб зберегти все піддерево єдиного сина, і після цього вузол 5 стоїть на місці видаленого z.",
    invariant: "BST інваріант: 5 < parent(20) < 30 ✓"
  });

  return steps;
}

function generateDeleteTwoChildrenScenario() {
  const tree = buildBst([20, 10, 30, 5, 15, 12]);
  const steps = [];
  const z = find(tree, 10);
  const y = treeMinimum(z.right);
  const yRight = y.right;
  const zLeft = z.left;
  const zRight = z.right;
  const yOldParent = y.parent;

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    codeLine: 0,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Знайдено z = 10, вузол для видалення, і його батьком є 20. Це потрібно, щоб алгоритм знав, яку позицію в дереві треба замінити; після цього кроку ми бачимо, що z має ліве і праве піддерево.",
    invariant: "BST інваріант: 5 < z(10) < 12 < 15 < parent(20) < 30 ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [z.id, z.right.id],
    codeLine: 6,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "z має двох дітей, тому просте вирізання зруйнувало б зв'язок із одним із піддерев. За правилом BST-видалення треба знайти successor = TreeMinimum(z.Right), бо саме найменший вузол правого піддерева може замінити z і зберегти порядок.",
    invariant: "BST інваріант: successor має бути більшим за все ліве піддерево z і не більшим за інші вузли правого піддерева ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [y.id],
    codeLine: 8,
    variables: { z: 10, y: 12, parent: 15 },
    explanation: "Successor y знайдено: це вузол 12, мінімум правого піддерева z. Це правильно, бо 12 є першим значенням після 10 в BST-порядку; після цього кроку y буде кандидатом на місце z.",
    invariant: "BST інваріант: 5 < z(10) < y(12) < 15 < 20 ✓"
  });

  transplant(tree, y, yRight);
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [y.id, yOldParent.id],
    codeLine: 11,
    variables: { z: 10, y: "12 ← вирізано зі старого місця", parent: "15.Left = null" },
    explanation: "Оскільки y.Parent != z, спочатку виконуємо Transplant(y, y.Right): посилання parent.Left у вузлі 15 перемикається з 12 на y.Right, тобто на null. Це потрібно, щоб successor не залишився одночасно у старому місці й на місці z; після цього y тимчасово від'єднаний.",
    invariant: "BST інваріант: після вирізання successor праве піддерево z усе ще впорядковане ✓"
  });

  setRight(y, zRight);
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [y.id, zRight.id],
    codeLine: 12,
    variables: { z: 10, y: "12.Right = 15", parent: 20 },
    explanation: "Виконуємо y.SetRight(z.Right): праве піддерево z, вузол 15, переходить під successor y = 12. Це потрібно, бо після заміни z вузол 12 має зберегти всі значення, які були праворуч від 10; після цього 15 уже є правим сином 12.",
    invariant: "BST інваріант: z(10) < y(12) < 15 ✓"
  });

  transplant(tree, z, y);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [z.id, y.id],
    codeLine: 14,
    variables: { z: "10 ← вирізано", y: "12 ← на місці z", parent: "20.Left = 12" },
    explanation: "Виконуємо Transplant(z, y): посилання parent.Left у вузлі 20 перемикається з 10 на successor 12. Це потрібно, щоб y фізично зайняв позицію z у дереві, і після цього вузол 10 уже не є частиною основного BST.",
    invariant: "BST інваріант: y(12) < parent(20), тому successor може стояти на місці z ✓"
  });

  setLeft(y, zLeft);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [y.id, zLeft.id],
    codeLine: 15,
    variables: { z: "10 ← вирізано", y: "12.Left = 5", parent: 20 },
    explanation: "Виконуємо y.SetLeft(z.Left): ліве піддерево z, вузол 5, переходить під successor y = 12. Це потрібно, бо всі значення лівого піддерева z менші за 12, і після цього y має обидва піддерева, потрібні для заміни z.",
    invariant: "BST інваріант: 5 < y(12) < 15 < parent(20) ✓"
  });

  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [y.id],
    codeLine: 17,
    variables: { z: "10 ← більше не в дереві", y: "12 ← successor", parent: 20 },
    explanation: "Видалення завершено: z = 10 більше немає в основному дереві, а successor y = 12 стоїть на його місці. Це зберігає BST-правило, бо 5 лишився ліворуч від 12, 15 праворуч від 12, а 12 менший за 20.",
    invariant: "BST інваріант: 5 < y(12) < 15 < parent(20) < 30 ✓"
  });

  return steps;
}

function generateAvlScenario(caseName, sequence) {
  const tree = { root: null, nodes: new Map() };
  const steps = [];

  addStep(steps, tree, {
    codeLine: 0,
    variables: { sequence: `[${sequence.join(", ")}]`, root: null },
    explanation: `Починаємо AVL-вставку для сценарію ${caseName}: значення будуть вставлятися як у звичайне BST, а після кожної вставки ми підніматимемося назад до кореня. Це потрібно, бо AVL-дерево зберігає баланс у кожному вузлі; після цього кроку дерево ще порожнє і готове до першої вставки.`,
    invariant: "AVL інваріант: порожнє дерево збалансоване ✓",
    showAvlLabels: true
  });

  sequence.forEach((value, index) => {
    const inserted = insertPlain(tree, value);
    addStep(steps, tree, {
      activeNodeIds: [inserted.id],
      codeLine: 2,
      variables: { node: value, parent: valueOf(inserted.parent), root: valueOf(tree.root), height: inserted.height, "balance factor": signed(inserted.balanceFactor) },
      explanation: `Вставляємо ${value} як у звичайне BST: порівняння веде новий вузол у правильне місце за правилом лівий < вузол < правий. Це потрібно, щоб перед балансуванням не порушити порядок пошуку; після цього вузол ${value} уже фізично підключений до дерева.`,
      invariant: "BST інваріант після вставки збережено ✓",
      showAvlLabels: true
    });

    const path = pathToRoot(inserted);
    path.forEach((node) => {
      recomputeAll(tree);
      addStep(steps, tree, {
        activeNodeIds: [node.id],
        codeLine: 3,
        variables: { node: node.value, parent: valueOf(node.parent), root: valueOf(tree.root), height: node.height, "balance factor": signed(node.balanceFactor) },
        explanation: `Піднімаємося до вузла ${node.value} і перераховуємо його height та balance factor за формулою height = max(left, right) + 1. Це потрібно, бо вставка нижче могла змінити висоту піддерева; після цього біля вузла ${node.value} показано актуальні h=${node.height} і bf=${signed(node.balanceFactor)}.`,
        invariant: Math.abs(node.balanceFactor) <= 1
          ? `AVL інваріант: balance factor вузла ${node.value} = ${signed(node.balanceFactor)} ✓`
          : `⚠ Порушення: bf=${signed(node.balanceFactor)}, потрібне балансування`,
        invariantStatus: Math.abs(node.balanceFactor) <= 1 ? "ok" : "warning",
        showAvlLabels: true
      });
    });
  });

  const rootBefore = findUnbalancedRoot(tree);
  if (!rootBefore) {
    return steps;
  }

  if (caseName === "LL") {
    addAvlCaseStep(steps, tree, rootBefore, 6, "LL", "Баланс вузла 30 = +2, тому ліве піддерево занадто важке. Новий вузол лежить у ліво-лівому напрямку, отже правило AVL вимагає один RightRotate; після цього 20 має піднятися над 30.");
    rightRotateDetailed(tree, rootBefore, steps, {
      lineMap: rightRotateLineMap(),
      showAvlLabels: true,
      label: "AVL LL"
    });
  }

  if (caseName === "RR") {
    addAvlCaseStep(steps, tree, rootBefore, 8, "RR", "Баланс вузла 10 = -2, тому праве піддерево занадто важке. Новий вузол лежить у право-правому напрямку, отже правило AVL вимагає один LeftRotate; після цього 20 має піднятися над 10.");
    leftRotateDetailed(tree, rootBefore, steps, {
      lineMap: leftRotateLineMap(),
      showAvlLabels: true,
      label: "AVL RR"
    });
  }

  if (caseName === "LR") {
    const leftChild = rootBefore.left;
    addAvlCaseStep(steps, tree, rootBefore, 11, "LR", "Баланс вузла 30 = +2, тому ліве піддерево занадто важке, але новий вузол прийшов у праву гілку лівого сина. Це випадок LR, тому спочатку треба виконати LeftRotate(leftChild), щоб перетворити форму на LL.");
    leftRotateDetailed(tree, leftChild, steps, {
      lineMap: leftRotateLineMap(),
      showAvlLabels: true,
      label: "AVL LR: перший поворот"
    });
    const newRoot = find(tree, 30);
    addStep(steps, tree, {
      activeNodeIds: [newRoot.id],
      codeLine: 12,
      variables: { node: 30, case: "LR", next: "RightRotate(30)", root: valueOf(tree.root), "balance factor": signed(newRoot.balanceFactor) },
      explanation: "Після першого повороту піддерево лівого сина вирівнялося так, що ситуація стала LL відносно вузла 30. Це потрібно для другого стандартного повороту; після цього кроку алгоритм переходить до RightRotate(30).",
      invariant: `⚠ Порушення: bf=${signed(newRoot.balanceFactor)}, потрібне балансування`,
      invariantStatus: "warning",
      showAvlLabels: true
    });
    rightRotateDetailed(tree, newRoot, steps, {
      lineMap: rightRotateLineMap(),
      showAvlLabels: true,
      label: "AVL LR: другий поворот"
    });
  }

  if (caseName === "RL") {
    const rightChild = rootBefore.right;
    addAvlCaseStep(steps, tree, rootBefore, 16, "RL", "Баланс вузла 10 = -2, тому праве піддерево занадто важке, але новий вузол прийшов у ліву гілку правого сина. Це випадок RL, тому спочатку треба виконати RightRotate(rightChild), щоб перетворити форму на RR.");
    rightRotateDetailed(tree, rightChild, steps, {
      lineMap: rightRotateLineMap(),
      showAvlLabels: true,
      label: "AVL RL: перший поворот"
    });
    const newRoot = find(tree, 10);
    addStep(steps, tree, {
      activeNodeIds: [newRoot.id],
      codeLine: 17,
      variables: { node: 10, case: "RL", next: "LeftRotate(10)", root: valueOf(tree.root), "balance factor": signed(newRoot.balanceFactor) },
      explanation: "Після першого повороту піддерево правого сина вирівнялося так, що ситуація стала RR відносно вузла 10. Це потрібно для другого стандартного повороту; після цього кроку алгоритм переходить до LeftRotate(10).",
      invariant: `⚠ Порушення: bf=${signed(newRoot.balanceFactor)}, потрібне балансування`,
      invariantStatus: "warning",
      showAvlLabels: true
    });
    leftRotateDetailed(tree, newRoot, steps, {
      lineMap: leftRotateLineMap(),
      showAvlLabels: true,
      label: "AVL RL: другий поворот"
    });
  }

  addStep(steps, tree, {
    activeNodeIds: [tree.root.id],
    codeLine: 19,
    variables: { node: valueOf(tree.root), parent: null, root: valueOf(tree.root), height: tree.root.height, "balance factor": signed(tree.root.balanceFactor) },
    explanation: `AVL-вставка завершена для сценарію ${caseName}: після поворотів коренем став вузол ${tree.root.value}. Це потрібно, щоб висоти лівого і правого піддерев знову відрізнялися не більше ніж на 1; після цього всі labels h/bf біля вузлів відповідають збалансованому дереву.`,
    invariant: `AVL інваріант: balance factor вузла ${tree.root.value} = ${signed(tree.root.balanceFactor)} ✓`,
    showAvlLabels: true
  });

  return steps;
}

function pathToRoot(node) {
  const result = [];
  let current = node;

  while (current) {
    result.push(current);
    current = current.parent;
  }

  return result;
}

function findUnbalancedRoot(tree) {
  recomputeAll(tree);
  let result = null;

  tree.nodes.forEach((node) => {
    if (Math.abs(node.balanceFactor) > 1 && (!result || node.height > result.height)) {
      result = node;
    }
  });

  return result;
}

function addAvlCaseStep(steps, tree, node, codeLine, caseName, explanation) {
  addStep(steps, tree, {
    activeNodeIds: [node.id],
    codeLine,
    variables: {
      node: node.value,
      case: caseName,
      height: node.height,
      "balance factor": signed(node.balanceFactor)
    },
    explanation,
    invariant: `⚠ Порушення: bf=${signed(node.balanceFactor)}, потрібне балансування`,
    invariantStatus: "warning",
    showAvlLabels: true
  });
}

function leftRotateLineMap() {
  return { save: 24, moveB: 26, parent: 27, replace: 28, finish: 29 };
}

function rightRotateLineMap() {
  return { save: 35, moveB: 37, parent: 38, replace: 39, finish: 40 };
}

function rotationInvariant(x, b, y) {
  if (b) {
    return `BST інваріант: x(${x.value}) < B(${b.value}) < y(${y.value}) ✓`;
  }

  return `BST інваріант: x(${x.value}) < y(${y.value}), B=null ✓`;
}

function leftRotateDetailed(tree, x, steps, options) {
  const y = x.right;
  const b = y ? y.left : null;
  const lines = options.lineMap ?? leftRotateLineMap();

  addStep(steps, tree, {
    activeNodeIds: y ? [x.id, y.id] : [x.id],
    codeLine: lines.save,
    variables: { x: x.value, y: valueOf(y), B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: зберігаємо y = x.Right, тобто вузол ${valueOf(y)} буде підніматися над x = ${x.value}. Це потрібно, бо лівий поворот завжди піднімає правого сина, і після цього кроку алгоритм має збережений вказівник y для безпечного перепідключення ребер.`,
    invariant: y ? rotationInvariant(x, b, y) : "⚠ Порушення: у x немає правого сина, лівий поворот неможливий",
    invariantStatus: y ? "ok" : "warning",
    showAvlLabels: options.showAvlLabels
  });

  if (!y) {
    return;
  }

  y.left = null;
  y.parent = null;
  setRight(x, b);
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: b ? [x.id, y.id, b.id] : [x.id, y.id],
    codeLine: lines.moveB,
    variables: { x: x.value, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо x.SetRight(y.Left), тому піддерево B=${formatValue(valueOf(b))} переходить із y до правого посилання x. Це потрібно, бо B більше за x і менше за y, тож після цього кроку B уже стоїть у правильному BST-місці відносно x.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  y.parent = x.parent;
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id],
    codeLine: lines.parent,
    variables: { x: x.value, y: `${y.value}, Parent=${formatValue(valueOf(y.parent))}`, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо y.Parent = x.Parent, тобто y отримує того самого батька, якого мав x. Це потрібно, щоб y міг зайняти місце x у батьківській ієрархії; після цього кроку вертикальний зв'язок y із майбутнім батьком підготовлений.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  replaceAtParent(tree, x, y);
  x.parent = null;
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id],
    codeLine: lines.replace,
    variables: { x: x.value, y: `${y.value} ← займає місце x`, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо ReplaceParentChild(x, y), тому батько піддерева тепер посилається на y замість x. Це потрібно, щоб верхівка піддерева стала коректною після повороту; після цього кроку y уже стоїть над x у зовнішньому дереві.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  setLeft(y, x);
  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    codeLine: lines.finish,
    variables: { x: x.value, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо y.SetLeft(x), тому x стає лівим сином y. Це потрібно, бо x менший за y і має лишитися ліворуч; після цього лівий поворот завершено, а AVL-висоти та balance factor перераховані для нового стану.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });
}

function rightRotateDetailed(tree, y, steps, options) {
  const x = y.left;
  const b = x ? x.right : null;
  const lines = options.lineMap ?? rightRotateLineMap();

  addStep(steps, tree, {
    activeNodeIds: x ? [x.id, y.id] : [y.id],
    codeLine: lines.save,
    variables: { x: valueOf(x), y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: зберігаємо x = y.Left, тобто вузол ${valueOf(x)} буде підніматися над y = ${y.value}. Це потрібно, бо правий поворот завжди піднімає лівого сина, і після цього кроку алгоритм має збережений вказівник x для безпечного перепідключення ребер.`,
    invariant: x ? rotationInvariant(x, b, y) : "⚠ Порушення: у y немає лівого сина, правий поворот неможливий",
    invariantStatus: x ? "ok" : "warning",
    showAvlLabels: options.showAvlLabels
  });

  if (!x) {
    return;
  }

  x.right = null;
  x.parent = null;
  setLeft(y, b);
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: b ? [x.id, y.id, b.id] : [x.id, y.id],
    codeLine: lines.moveB,
    variables: { x: x.value, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо y.SetLeft(x.Right), тому піддерево B=${formatValue(valueOf(b))} переходить із x до лівого посилання y. Це потрібно, бо B більше за x і менше за y, тож після цього кроку B уже стоїть у правильному BST-місці відносно y.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  x.parent = y.parent;
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id],
    codeLine: lines.parent,
    variables: { x: `${x.value}, Parent=${formatValue(valueOf(x.parent))}`, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо x.Parent = y.Parent, тобто x отримує того самого батька, якого мав y. Це потрібно, щоб x міг зайняти місце y у батьківській ієрархії; після цього кроку вертикальний зв'язок x із майбутнім батьком підготовлений.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  replaceAtParent(tree, y, x);
  y.parent = null;
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id],
    codeLine: lines.replace,
    variables: { x: `${x.value} ← займає місце y`, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо ReplaceParentChild(y, x), тому батько піддерева тепер посилається на x замість y. Це потрібно, щоб верхівка піддерева стала коректною після повороту; після цього кроку x уже стоїть над y у зовнішньому дереві.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  setRight(x, y);
  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    codeLine: lines.finish,
    variables: { x: x.value, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо x.SetRight(y), тому y стає правим сином x. Це потрібно, бо y більший за x і має лишитися праворуч; після цього правий поворот завершено, а AVL-висоти та balance factor перераховані для нового стану.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });
}

function parseNumbers(text) {
  const values = String(text || "")
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value));

  if (!String(text || "").trim() || values.length === 0) {
    return null;
  }

  return [...new Set(values)];
}

function showCustomError(message) {
  customError.textContent = message;
}

function clearCustomError() {
  customError.textContent = "";
}

function generateLeftRotateCustom(values, rotateValue) {
  const tree = buildBst(values);
  const x = find(tree, rotateValue);
  const steps = [];

  if (!x || !x.right) {
    return null;
  }

  addStep(steps, tree, {
    activeNodeIds: [x.id],
    codeLine: 0,
    variables: { x: x.value, y: valueOf(x.right), B: valueOf(x.right.left), root: valueOf(tree.root) },
    explanation: `Починаємо лівий поворот навколо x = ${x.value} у власному дереві. Це можливо лише тоді, коли x має правого сина, бо саме він піднімається вгору; після цього кроку перевірка умови завершена.`,
    invariant: "BST інваріант перед поворотом збережено ✓"
  });

  leftRotateDetailed(tree, x, steps, {
    lineMap: { save: 2, moveB: 4, parent: 5, replace: 6, finish: 7 },
    showAvlLabels: false,
    label: "Лівий поворот"
  });

  return steps;
}

function generateRightRotateCustom(values, rotateValue) {
  const tree = buildBst(values);
  const y = find(tree, rotateValue);
  const steps = [];

  if (!y || !y.left) {
    return null;
  }

  addStep(steps, tree, {
    activeNodeIds: [y.id],
    codeLine: 0,
    variables: { x: valueOf(y.left), y: y.value, B: valueOf(y.left.right), root: valueOf(tree.root) },
    explanation: `Починаємо правий поворот навколо y = ${y.value} у власному дереві. Це можливо лише тоді, коли y має лівого сина, бо саме він піднімається вгору; після цього кроку перевірка умови завершена.`,
    invariant: "BST інваріант перед поворотом збережено ✓"
  });

  rightRotateDetailed(tree, y, steps, {
    lineMap: { save: 2, moveB: 4, parent: 5, replace: 6, finish: 7 },
    showAvlLabels: false,
    label: "Правий поворот"
  });

  return steps;
}

function generateDeleteCustom(values, deleteValue) {
  const tree = buildBst(values);
  const steps = [];
  const z = find(tree, deleteValue);

  if (!z) {
    return null;
  }

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    codeLine: 0,
    variables: { z: z.value, y: null, parent: valueOf(z.parent) },
    explanation: `Знайдено z = ${z.value}, вузол для видалення у власному дереві. Це потрібно, щоб визначити конкретне батьківське посилання для Transplant; після цього кроку алгоритм перевіряє дітей z.`,
    invariant: "BST інваріант перед видаленням збережено ✓"
  });

  if (!z.left) {
    const replacement = z.right;
    addStep(steps, tree, {
      activeNodeIds: replacement ? [z.id, replacement.id] : [z.id],
      codeLine: 2,
      variables: { z: z.value, y: null, parent: valueOf(z.parent) },
      explanation: `z.Left дорівнює null, тому z можна замінити його правим піддеревом. Це правило покриває листок і вузол з одним правим сином; після цього кроку готується Transplant(z, z.Right).`,
      invariant: "BST інваріант: праве піддерево z більше за z і може зайняти його позицію ✓"
    });
    transplant(tree, z, replacement);
    addStep(steps, tree, {
      detachedRootIds: [z.id],
      activeNodeIds: replacement ? [replacement.id, z.id] : [z.id],
      codeLine: 3,
      variables: { z: `${z.value} ← вирізано`, y: null, parent: valueOf(replacement ? replacement.parent : null) },
      explanation: `Виконуємо Transplant(z, z.Right): батько z тепер посилається на ${formatValue(valueOf(replacement))}. Це фізично прибирає z з дерева, і після цього основне дерево зберігає всі потрібні піддерева.`,
      invariant: "BST інваріант після Transplant збережено ✓"
    });
    return steps;
  }

  if (!z.right) {
    const replacement = z.left;
    addStep(steps, tree, {
      activeNodeIds: [z.id, replacement.id],
      codeLine: 4,
      variables: { z: z.value, y: null, parent: valueOf(z.parent) },
      explanation: `z.Right дорівнює null, тому z можна замінити його лівим піддеревом. Це правило потрібне для вузла з одним лівим сином; після цього кроку готується Transplant(z, z.Left).`,
      invariant: "BST інваріант: ліве піддерево z менше за батьківську межу і може піднятися ✓"
    });
    transplant(tree, z, replacement);
    addStep(steps, tree, {
      detachedRootIds: [z.id],
      activeNodeIds: [replacement.id, z.id],
      codeLine: 5,
      variables: { z: `${z.value} ← вирізано`, y: null, parent: valueOf(replacement.parent) },
      explanation: `Виконуємо Transplant(z, z.Left): батько z тепер посилається на ${replacement.value}. Це зберігає єдине піддерево z і прибирає сам вузол z з основного дерева.`,
      invariant: "BST інваріант після Transplant збережено ✓"
    });
    return steps;
  }

  const y = treeMinimum(z.right);
  const yRight = y.right;
  const zLeft = z.left;
  const zRight = z.right;
  const yOldParent = y.parent;

  addStep(steps, tree, {
    activeNodeIds: [z.id, z.right.id],
    codeLine: 6,
    variables: { z: z.value, y: null, parent: valueOf(z.parent) },
    explanation: `z має двох дітей, тому потрібно знайти successor = TreeMinimum(z.Right). Це правило гарантує, що заміна буде найменшим більшим значенням; після цього кроку алгоритм переходить у праве піддерево z.`,
    invariant: "BST інваріант: successor буде більшим за ліве піддерево z і меншим або рівним іншим правим вузлам ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [y.id],
    codeLine: 8,
    variables: { z: z.value, y: y.value, parent: valueOf(y.parent) },
    explanation: `Successor y знайдено: це вузол ${y.value}. Це мінімум правого піддерева z, тому він може замінити z без порушення порядку; після цього кроку y стає кандидатом на нову позицію.`,
    invariant: "BST інваріант для successor збережено ✓"
  });

  if (y.parent !== z) {
    transplant(tree, y, yRight);
    addStep(steps, tree, {
      detachedRootIds: [y.id],
      activeNodeIds: [y.id, yOldParent.id],
      codeLine: 11,
      variables: { z: z.value, y: `${y.value} ← вирізано`, parent: valueOf(yOldParent) },
      explanation: `Оскільки y.Parent != z, виконуємо Transplant(y, y.Right), щоб вирізати successor зі старого місця. Це потрібно, аби y не був у дереві двічі; після цього його старий батько посилається на ${formatValue(valueOf(yRight))}.`,
      invariant: "BST інваріант у старому місці successor збережено ✓"
    });
    setRight(y, zRight);
    addStep(steps, tree, {
      detachedRootIds: [y.id],
      activeNodeIds: [y.id, zRight.id],
      codeLine: 12,
      variables: { z: z.value, y: `${y.value}.Right = ${zRight.value}`, parent: valueOf(z.parent) },
      explanation: `Виконуємо y.SetRight(z.Right), тому праве піддерево z переходить під successor. Це потрібно, щоб після заміни z не втратити вузли, більші за y; після цього y має правильне праве піддерево.`,
      invariant: `BST інваріант: z(${z.value}) < y(${y.value}) < right(${zRight.value}) ✓`
    });
  }

  transplant(tree, z, y);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [z.id, y.id],
    codeLine: 14,
    variables: { z: `${z.value} ← вирізано`, y: `${y.value} ← на місці z`, parent: valueOf(y.parent) },
    explanation: `Виконуємо Transplant(z, y), тому successor стає на місце вузла, який видаляється. Це потрібно, щоб головне батьківське посилання тепер вело до y; після цього z уже не належить основному дереву.`,
    invariant: "BST інваріант: successor може стояти на місці z ✓"
  });

  setLeft(y, zLeft);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [y.id, zLeft.id],
    codeLine: 15,
    variables: { z: `${z.value} ← вирізано`, y: `${y.value}.Left = ${zLeft.value}`, parent: valueOf(y.parent) },
    explanation: `Виконуємо y.SetLeft(z.Left), тому ліве піддерево z переходить під successor. Це потрібно, бо всі ці значення менші за y; після цього видалення завершене й обидва піддерева збережені.`,
    invariant: "BST інваріант після видалення збережено ✓"
  });

  return steps;
}

function generateAvlCustom(values, insertValue) {
  const tree = buildBst(values);
  const steps = [];

  addStep(steps, tree, {
    activeNodeIds: tree.root ? [tree.root.id] : [],
    codeLine: 0,
    variables: { node: null, parent: null, root: valueOf(tree.root), height: valueOf(tree.root) ? tree.root.height : 0, "balance factor": valueOf(tree.root) ? signed(tree.root.balanceFactor) : 0 },
    explanation: `Побудовано власне AVL/BST-дерево з чисел ${values.join(", ")}. Тепер вставимо ${insertValue} і піднімемося назад до кореня, щоб перерахувати висоти та balance factor; після цього кроку початковий стан готовий.`,
    invariant: "BST інваріант перед AVL-вставкою збережено ✓",
    showAvlLabels: true
  });

  const inserted = insertPlain(tree, insertValue);
  addStep(steps, tree, {
    activeNodeIds: [inserted.id],
    codeLine: 2,
    variables: { node: insertValue, parent: valueOf(inserted.parent), root: valueOf(tree.root), height: inserted.height, "balance factor": signed(inserted.balanceFactor) },
    explanation: `Вставляємо ${insertValue} як у звичайне BST, тобто новий вузол підключається за правилом порівняння. Це потрібно, щоб спочатку зберегти порядок пошуку; після цього починається AVL-перерахунок вгору.`,
    invariant: "BST інваріант після вставки збережено ✓",
    showAvlLabels: true
  });

  pathToRoot(inserted).forEach((node) => {
    recomputeAll(tree);
    addStep(steps, tree, {
      activeNodeIds: [node.id],
      codeLine: 3,
      variables: { node: node.value, parent: valueOf(node.parent), root: valueOf(tree.root), height: node.height, "balance factor": signed(node.balanceFactor) },
      explanation: `Перераховуємо вузол ${node.value}: висота й balance factor могли змінитися через вставку нижче. Це потрібно, бо AVL-рішення про поворот приймається саме за bf; після цього біля вузла видно h=${node.height}, bf=${signed(node.balanceFactor)}.`,
      invariant: Math.abs(node.balanceFactor) <= 1 ? `AVL інваріант: balance factor вузла ${node.value} = ${signed(node.balanceFactor)} ✓` : `⚠ Порушення: bf=${signed(node.balanceFactor)}, потрібне балансування`,
      invariantStatus: Math.abs(node.balanceFactor) <= 1 ? "ok" : "warning",
      showAvlLabels: true
    });
  });

  const unbalanced = findUnbalancedRoot(tree);
  if (!unbalanced) {
    addStep(steps, tree, {
      activeNodeIds: [inserted.id],
      codeLine: 19,
      variables: { node: insertValue, parent: valueOf(inserted.parent), root: valueOf(tree.root), height: tree.root.height, "balance factor": signed(tree.root.balanceFactor) },
      explanation: `Після вставки ${insertValue} жоден вузол не має bf поза межами [-1; +1]. Це означає, що поворот не потрібен; після цього AVL-вставка завершена.`,
      invariant: "AVL інваріант збережено для всіх вузлів ✓",
      showAvlLabels: true
    });
    return steps;
  }

  if (unbalanced.balanceFactor > 1 && insertValue < unbalanced.left.value) {
    addAvlCaseStep(steps, tree, unbalanced, 6, "LL", `Виявлено LL: bf вузла ${unbalanced.value} = ${signed(unbalanced.balanceFactor)}, а новий вузол лежить у лівій гілці лівого сина. Це вимагає RightRotate(${unbalanced.value}); після повороту лівий син підніметься вгору.`);
    rightRotateDetailed(tree, unbalanced, steps, { lineMap: rightRotateLineMap(), showAvlLabels: true, label: "AVL LL" });
  } else if (unbalanced.balanceFactor < -1 && insertValue > unbalanced.right.value) {
    addAvlCaseStep(steps, tree, unbalanced, 8, "RR", `Виявлено RR: bf вузла ${unbalanced.value} = ${signed(unbalanced.balanceFactor)}, а новий вузол лежить у правій гілці правого сина. Це вимагає LeftRotate(${unbalanced.value}); після повороту правий син підніметься вгору.`);
    leftRotateDetailed(tree, unbalanced, steps, { lineMap: leftRotateLineMap(), showAvlLabels: true, label: "AVL RR" });
  } else if (unbalanced.balanceFactor > 1) {
    addAvlCaseStep(steps, tree, unbalanced, 11, "LR", `Виявлено LR: bf вузла ${unbalanced.value} = ${signed(unbalanced.balanceFactor)}, але новий вузол у правій гілці лівого сина. Це вимагає LeftRotate(leftChild), а потім RightRotate(${unbalanced.value}).`);
    leftRotateDetailed(tree, unbalanced.left, steps, { lineMap: leftRotateLineMap(), showAvlLabels: true, label: "AVL LR: перший поворот" });
    rightRotateDetailed(tree, unbalanced, steps, { lineMap: rightRotateLineMap(), showAvlLabels: true, label: "AVL LR: другий поворот" });
  } else {
    addAvlCaseStep(steps, tree, unbalanced, 16, "RL", `Виявлено RL: bf вузла ${unbalanced.value} = ${signed(unbalanced.balanceFactor)}, але новий вузол у лівій гілці правого сина. Це вимагає RightRotate(rightChild), а потім LeftRotate(${unbalanced.value}).`);
    rightRotateDetailed(tree, unbalanced.right, steps, { lineMap: rightRotateLineMap(), showAvlLabels: true, label: "AVL RL: перший поворот" });
    leftRotateDetailed(tree, unbalanced, steps, { lineMap: leftRotateLineMap(), showAvlLabels: true, label: "AVL RL: другий поворот" });
  }

  addStep(steps, tree, {
    activeNodeIds: tree.root ? [tree.root.id] : [],
    codeLine: 19,
    variables: { node: insertValue, parent: null, root: valueOf(tree.root), height: tree.root ? tree.root.height : 0, "balance factor": tree.root ? signed(tree.root.balanceFactor) : 0 },
    explanation: `Власна AVL-вставка завершена: після потрібних поворотів коренем є ${valueOf(tree.root)}. Це відновлює AVL-інваріант, і після цього всі вузли мають balance factor у дозволених межах.`,
    invariant: "AVL інваріант відновлено ✓",
    showAvlLabels: true
  });

  return steps;
}

function signed(number) {
  if (number > 0) {
    return `+${number}`;
  }

  return String(number);
}

function findTopic(key) {
  return topicDefinitions.find((topic) => topic.key === key) ?? topicDefinitions[0];
}

function findScenario(id) {
  return scenarioDefinitions.find((definition) => definition.id === id) ?? scenarioDefinitions[0];
}

function populateScenarioSelect(topic) {
  scenarioSelect.innerHTML = "";
  topic.scenarioIds.forEach((scenarioId) => {
    const definition = findScenario(scenarioId);
    const option = document.createElement("option");
    option.value = definition.id;
    option.textContent = definition.title;
    scenarioSelect.appendChild(option);
  });
}

function openTopic(topicKey, preferredScenarioId = null) {
  currentTopic = findTopic(topicKey);
  activeTopicTitle.textContent = currentTopic.name;
  populateScenarioSelect(currentTopic);
  renderCustomFields(currentTopic);
  markProgress(currentTopic.key, "in-progress");
  showVisualizer();
  renderSidebar();
  loadScenario(preferredScenarioId ?? currentTopic.scenarioIds[0]);
}

function loadScenario(id, customSteps = null, customTitle = null, customCodeKey = null) {
  stopPlay();
  currentScenario = customCodeKey
    ? { ...findScenario(id), title: customTitle ?? "Власний сценарій", codeKey: customCodeKey, quizKey: findScenario(id).quizKey }
    : findScenario(id);
  steps = customSteps ?? currentScenario.build();
  currentIndex = 0;
  treeTitle.textContent = currentScenario.title;
  scenarioSelect.value = id;
  render();
}

function render() {
  const step = steps[currentIndex];

  if (!step) {
    return;
  }

  renderTree(step);
  renderCode(codes[currentScenario.codeKey], step.codeLine);
  renderExplanation(step);
  updateControls();
}

function renderTree(step) {
  const snapshot = step.treeSnapshot;
  const width = Math.max(treeSvg.clientWidth, 680);
  const height = Math.max(treeSvg.clientHeight, 520);
  treeSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  treeSvg.innerHTML = "";

  const defs = createSvgElement("defs");
  defs.innerHTML = `
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#22c55e"></path>
    </marker>
  `;
  treeSvg.appendChild(defs);

  const roots = [snapshot.rootId, ...snapshot.detachedRootIds].filter(Boolean);

  if (roots.length === 0) {
    const emptyText = createSvgElement("text");
    emptyText.setAttribute("x", width / 2);
    emptyText.setAttribute("y", height / 2);
    emptyText.setAttribute("fill", "#94a3b8");
    emptyText.setAttribute("font-size", "18");
    emptyText.setAttribute("text-anchor", "middle");
    emptyText.textContent = "Дерево порожнє";
    treeSvg.appendChild(emptyText);
    return;
  }

  const positions = new Map();
  roots.forEach((rootId, index) => {
    const segmentWidth = width / roots.length;
    const startX = segmentWidth * index + segmentWidth / 2;
    const offset = Math.max(segmentWidth / 4, 72);
    calculatePositions(snapshot, rootId, startX, 86, offset, positions);
  });

  roots.forEach((rootId) => drawLinks(snapshot, rootId, positions));
  roots.forEach((rootId, index) => drawNodes(snapshot, rootId, positions, step, index > 0));
}

function calculatePositions(snapshot, nodeIdValue, x, y, offset, positions) {
  const node = snapshot.nodes[nodeIdValue];
  if (!node || positions.has(nodeIdValue)) {
    return;
  }

  positions.set(nodeIdValue, { x, y });
  const nextOffset = Math.max(offset / 2, 48);

  if (node.left) {
    calculatePositions(snapshot, node.left, x - offset, y + 104, nextOffset, positions);
  }

  if (node.right) {
    calculatePositions(snapshot, node.right, x + offset, y + 104, nextOffset, positions);
  }
}

function drawLinks(snapshot, nodeIdValue, positions, visited = new Set()) {
  if (visited.has(nodeIdValue)) {
    return;
  }
  visited.add(nodeIdValue);

  const node = snapshot.nodes[nodeIdValue];
  const position = positions.get(nodeIdValue);

  ["left", "right"].forEach((side) => {
    const childId = node[side];
    if (!childId) {
      return;
    }

    const childPosition = positions.get(childId);
    const line = createSvgElement("line");
    line.setAttribute("class", "tree-link");
    line.setAttribute("x1", position.x);
    line.setAttribute("y1", position.y + 25);
    line.setAttribute("x2", childPosition.x);
    line.setAttribute("y2", childPosition.y - 25);
    treeSvg.appendChild(line);
    drawLinks(snapshot, childId, positions, visited);
  });
}

function drawNodes(snapshot, nodeIdValue, positions, step, isDetached, visited = new Set()) {
  if (visited.has(nodeIdValue)) {
    return;
  }
  visited.add(nodeIdValue);

  const node = snapshot.nodes[nodeIdValue];
  const position = positions.get(nodeIdValue);
  const isRoot = nodeIdValue === snapshot.rootId;
  const isActive = step.activeNodeIds.includes(nodeIdValue);

  const group = createSvgElement("g");
  group.setAttribute("class", `tree-node${isActive ? " active" : ""}${isRoot ? " root" : ""}`);
  group.setAttribute("transform", `translate(${position.x}, ${position.y})`);

  const circle = createSvgElement("circle");
  circle.setAttribute("class", "node-circle");
  circle.setAttribute("r", "25");
  group.appendChild(circle);

  const text = createSvgElement("text");
  text.setAttribute("class", "node-text");
  text.textContent = node.value;
  group.appendChild(text);

  if (step.showAvlLabels) {
    const meta = createSvgElement("text");
    meta.setAttribute("class", "node-meta");
    meta.setAttribute("y", "42");
    meta.textContent = `h=${node.height} bf=${signed(node.balanceFactor)}`;
    group.appendChild(meta);
  }

  if (isRoot) {
    const label = createSvgElement("text");
    label.setAttribute("class", "root-label");
    label.setAttribute("y", "-43");
    label.textContent = "root";
    group.appendChild(label);

    const arrow = createSvgElement("line");
    arrow.setAttribute("class", "root-arrow");
    arrow.setAttribute("x1", "0");
    arrow.setAttribute("y1", "-35");
    arrow.setAttribute("x2", "0");
    arrow.setAttribute("y2", "-26");
    group.appendChild(arrow);
  }

  if (isDetached) {
    const label = createSvgElement("text");
    label.setAttribute("class", "detached-label");
    label.setAttribute("y", "-43");
    label.textContent = "тимчасово";
    group.appendChild(label);
  }

  treeSvg.appendChild(group);

  if (node.left) {
    drawNodes(snapshot, node.left, positions, step, false, visited);
  }

  if (node.right) {
    drawNodes(snapshot, node.right, positions, step, false, visited);
  }
}

function createSvgElement(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function renderCode(lines, activeLine) {
  codeBlock.innerHTML = "";

  lines.forEach((line, index) => {
    const row = document.createElement("div");
    row.className = `code-line${index === activeLine ? " active" : ""}`;

    const number = document.createElement("span");
    number.className = "line-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const code = document.createElement("span");
    code.textContent = line;

    row.append(number, code);
    codeBlock.appendChild(row);
  });
}

function renderExplanation(step) {
  const explanationByLevel = {
    short: step.explanationShort,
    normal: step.explanationNormal,
    deep: step.explanationDeep
  };

  explanationText.textContent = explanationByLevel[explanationLevel] ?? step.explanationNormal ?? step.explanation;
  invariantBox.textContent = step.invariant;
  invariantBox.classList.toggle("warning", step.invariantStatus === "warning");
  invariantBox.classList.toggle("danger", step.invariantStatus === "danger");

  if (defenseModeEnabled) {
    defenseHintCard.classList.remove("hidden");
    let hintKey = "default";
    if (currentScenario) {
      const id = currentScenario.id || currentTopic?.key;
      if (id === "bst-search" || id === "bstSearch") hintKey = "bstSearch";
      else if (id && id.includes("delete")) hintKey = "bstDelete";
      else if (id === "left-rotate" || id === "leftRotate") hintKey = "leftRotate";
      else if (id === "right-rotate" || id === "rightRotate") hintKey = "rightRotate";
      else if (id === "avl-ll") hintKey = "avlLL";
      else if (id === "avl-rr") hintKey = "avlRR";
      else if (id === "avl-lr") hintKey = "avlLR";
      else if (id === "avl-rl") hintKey = "avlRL";
      else if (id && id.includes("avl")) hintKey = "avlInsert";
    }
    defenseHintText.innerHTML = defenseHints[hintKey] || defenseHints["default"];
  } else {
    defenseHintCard.classList.add("hidden");
  }

  variablesTable.innerHTML = "";
  const entries = Object.entries(step.variables);

  if (entries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "variable-value";
    empty.textContent = "На цьому кроці немає активних змінних.";
    variablesTable.appendChild(empty);
    return;
  }

  entries.forEach(([name, value]) => {
    const row = document.createElement("div");
    row.className = "variable-row";

    const variableName = document.createElement("span");
    variableName.className = "variable-name";
    variableName.textContent = name;

    const variableValue = document.createElement("span");
    variableValue.className = "variable-value";
    variableValue.textContent = formatValue(value);

    row.append(variableName, variableValue);
    variablesTable.appendChild(row);
  });
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  return String(value);
}

function updateControls() {
  const lastIndex = steps.length - 1;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === lastIndex;
  resetBtn.disabled = currentIndex === 0;
  stepCounter.textContent = `Крок ${currentIndex + 1} / ${steps.length}`;
  playBtn.textContent = playTimer ? "Пауза" : "Пуск";
  quizBtn.classList.toggle("hidden", currentIndex !== lastIndex);

  if (currentIndex === lastIndex && currentTopic) {
    markProgress(currentTopic.key, "done");
  }
}

function goToStep(index) {
  currentIndex = Math.max(0, Math.min(index, steps.length - 1));
  render();
}

function startPlay() {
  if (playTimer) {
    return;
  }

  playTimer = window.setInterval(() => {
    if (currentIndex >= steps.length - 1) {
      stopPlay();
      return;
    }

    goToStep(currentIndex + 1);
  }, 1500);

  updateControls();
}

function stopPlay() {
  if (playTimer) {
    window.clearInterval(playTimer);
    playTimer = null;
  }

  updateControls();
}

function renderCustomFields(topic) {
  clearCustomError();
  const placeholder = "30, 20, 10, 25";

  if (topic.customType === "search") {
    customFields.innerHTML = `
      <div class="custom-row">
        <input id="customValuesInput" type="text" placeholder="Числа: ${placeholder}">
        <button id="customBuildBtn" type="button">Побудувати дерево</button>
      </div>
      <div id="customActionRow" class="custom-row hidden">
        <input id="customActionInput" type="number" placeholder="Знайти вузол">
        <button id="customRunBtn" type="button">Шукати</button>
      </div>
    `;
  } else if (topic.customType === "delete") {
    customFields.innerHTML = `
      <div class="custom-row">
        <input id="customValuesInput" type="text" placeholder="Числа: ${placeholder}">
        <button id="customBuildBtn" type="button">Побудувати дерево</button>
      </div>
      <div id="customActionRow" class="custom-row hidden">
        <input id="customActionInput" type="number" placeholder="Видалити вузол">
        <button id="customRunBtn" type="button">Запустити</button>
      </div>
    `;
  } else if (topic.customType === "avl") {
    customFields.innerHTML = `
      <div class="custom-row">
        <input id="customValuesInput" type="text" placeholder="Початкові числа: ${placeholder}">
        <button id="customBuildBtn" type="button">Побудувати дерево</button>
      </div>
      <div id="customActionRow" class="custom-row hidden">
        <input id="customActionInput" type="number" placeholder="Додати вузол">
        <button id="customRunBtn" type="button">Вставити</button>
      </div>
    `;
  } else {
    customFields.innerHTML = `
      <div class="custom-row three">
        <input id="customValuesInput" type="text" placeholder="Числа: ${topic.customType === "leftRotate" ? "40, 20, 60, 50, 70" : "60, 40, 70, 20, 50"}">
        <input id="customActionInput" type="number" placeholder="Вузол для повороту">
        <button id="customRunBtn" type="button">Запустити поворот</button>
      </div>
    `;
  }

  const buildBtn = document.getElementById("customBuildBtn");
  if (buildBtn) {
    buildBtn.addEventListener("click", () => {
      clearCustomError();
      const values = parseNumbers(document.getElementById("customValuesInput").value);
      if (!values) {
        showCustomError("Введи коректні числа");
        return;
      }
      document.getElementById("customActionRow").classList.remove("hidden");
    });
  }

  document.getElementById("customRunBtn").addEventListener("click", () => runCustomScenario(topic));
}

function runCustomScenario(topic) {
  clearCustomError();
  const values = parseNumbers(document.getElementById("customValuesInput").value);
  const actionValue = Number(document.getElementById("customActionInput").value);

  if (!values || !Number.isFinite(actionValue)) {
    showCustomError("Введи коректні числа");
    return;
  }

  let customSteps = null;
  let scenarioId = topic.scenarioIds[0];
  let title = "Власний сценарій";
  let codeKey = findScenario(scenarioId).codeKey;

  if (topic.customType === "search") {
    customSteps = generateSearchScenario(values, actionValue);
    scenarioId = "bst-search";
    codeKey = "bstSearch";
    title = `Власний BST-пошук: знайти ${actionValue}`;
  } else if (topic.customType === "delete") {
    if (!find(buildBst(values), actionValue)) {
      showCustomError(`Вузол ${actionValue} не знайдено в дереві`);
      return;
    }
    customSteps = generateDeleteCustom(values, actionValue);
    scenarioId = "delete-two-children";
    codeKey = "bstDelete";
    title = `Власне BST-видалення: ${actionValue}`;
  } else if (topic.customType === "leftRotate") {
    const tree = buildBst(values);
    const node = find(tree, actionValue);
    if (!node) {
      showCustomError(`Вузол ${actionValue} не знайдено в дереві`);
      return;
    }
    if (!node.right) {
      showCustomError(`У вузла ${actionValue} немає правого сина для лівого повороту`);
      return;
    }
    customSteps = generateLeftRotateCustom(values, actionValue);
    scenarioId = "left-rotate";
    codeKey = "leftRotate";
    title = `Власний лівий поворот: x = ${actionValue}`;
  } else if (topic.customType === "rightRotate") {
    const tree = buildBst(values);
    const node = find(tree, actionValue);
    if (!node) {
      showCustomError(`Вузол ${actionValue} не знайдено в дереві`);
      return;
    }
    if (!node.left) {
      showCustomError(`У вузла ${actionValue} немає лівого сина для правого повороту`);
      return;
    }
    customSteps = generateRightRotateCustom(values, actionValue);
    scenarioId = "right-rotate";
    codeKey = "rightRotate";
    title = `Власний правий поворот: y = ${actionValue}`;
  } else if (topic.customType === "avl") {
    if (values.includes(actionValue)) {
      showCustomError(`Вузол ${actionValue} вже є в дереві`);
      return;
    }
    customSteps = generateAvlCustom(values, actionValue);
    scenarioId = "avl-ll";
    codeKey = "avlInsert";
    title = `Власна AVL-вставка: додати ${actionValue}`;
  }

  if (!customSteps) {
    showCustomError(`Вузол ${actionValue} не знайдено в дереві`);
    return;
  }

  loadScenario(scenarioId, customSteps, title, codeKey);
}

function startQuiz() {
  const quiz = quizDefinitions[currentScenario.quizKey] ?? quizDefinitions[currentTopic.key] ?? quizDefinitions.bstSearch;
  quizState = {
    quiz,
    index: 0,
    score: 0,
    answered: false
  };
  quizOverlay.classList.remove("hidden");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const { quiz, index, score } = quizState;

  if (index >= quiz.questions.length) {
    quizTitle.textContent = quiz.title;
    quizQuestion.textContent = score === 3
      ? `${score}/3 — Відмінно! ✓`
      : `${score}/3 — Майже! Повтори ключові кроки й спробуй ще раз.`;
    quizOptions.innerHTML = "";
    quizFeedback.textContent = "Квіз завершено.";
    quizNextBtn.textContent = "Закрити";
    quizState.answered = true;
    return;
  }

  const question = quiz.questions[index];
  quizTitle.textContent = quiz.title;
  quizQuestion.textContent = `${index + 1}. ${question.text}`;
  quizOptions.innerHTML = "";
  quizFeedback.textContent = "";
  quizNextBtn.textContent = "Наступне питання";
  quizState.answered = false;

  question.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + optionIndex)}) ${option}`;
    button.addEventListener("click", () => answerQuiz(optionIndex));
    quizOptions.appendChild(button);
  });
}

function answerQuiz(optionIndex) {
  if (quizState.answered) {
    return;
  }

  const question = quizState.quiz.questions[quizState.index];
  quizState.answered = true;

  [...quizOptions.children].forEach((button, index) => {
    if (index === question.correct) {
      button.classList.add("correct");
    } else if (index === optionIndex) {
      button.classList.add("wrong");
    }
  });

  if (optionIndex === question.correct) {
    quizState.score += 1;
    quizFeedback.textContent = `Правильно. ${question.why}`;
  } else {
    quizFeedback.textContent = `Не зовсім. ${question.why}`;
  }
}

function nextQuizStep() {
  if (!quizState) {
    return;
  }

  if (quizState.index >= quizState.quiz.questions.length) {
    quizOverlay.classList.add("hidden");
    return;
  }

  if (!quizState.answered) {
    quizFeedback.textContent = "Спочатку обери відповідь.";
    return;
  }

  quizState.index += 1;
  renderQuizQuestion();
}

scenarioSelect.addEventListener("change", () => loadScenario(scenarioSelect.value));
prevBtn.addEventListener("click", () => goToStep(currentIndex - 1));
nextBtn.addEventListener("click", () => goToStep(currentIndex + 1));
resetBtn.addEventListener("click", () => {
  stopPlay();
  goToStep(0);
});
playBtn.addEventListener("click", () => {
  if (playTimer) {
    stopPlay();
  } else {
    startPlay();
  }
});
backToTopicsBtn.addEventListener("click", showHome);
resetProgressLink.addEventListener("click", () => {
  progressState = {};
  writeProgress();
  renderProgressUi();
});
quizBtn.addEventListener("click", startQuiz);
quizCloseBtn.addEventListener("click", () => quizOverlay.classList.add("hidden"));
quizNextBtn.addEventListener("click", nextQuizStep);
explanationLevelToggle.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-level]");
  if (!button) {
    return;
  }

  explanationLevel = button.dataset.level;
  [...explanationLevelToggle.querySelectorAll("button")].forEach((item) => {
    item.classList.toggle("active", item === button);
  });
  renderExplanation(steps[currentIndex]);
});

defenseModeToggle.addEventListener("click", () => {
  defenseModeEnabled = !defenseModeEnabled;
  defenseModeToggle.classList.toggle("active", defenseModeEnabled);
  defenseModeToggle.setAttribute("aria-pressed", defenseModeEnabled);
  
  if (defenseModeEnabled) {
    document.body.classList.add("mode-defense");
  } else {
    document.body.classList.remove("mode-defense");
  }
  
  if (steps[currentIndex]) {
    renderExplanation(steps[currentIndex]);
  }
});

window.addEventListener("resize", () => render());

renderProgressUi();
showHome();
