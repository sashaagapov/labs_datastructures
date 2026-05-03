export const quizDefinitions = {
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
