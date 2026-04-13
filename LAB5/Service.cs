namespace agapovlab5
{
    public static class Service
    {
        public static void Welcome()
        {
            Console.WriteLine("=============================================================");
            Console.WriteLine("Лабораторна робота №5.З дисципліни Аналіз структури даних. ");
            Console.WriteLine("Агапов Олександр ІПЗ-11(1)");
            Console.WriteLine("=============================================================");
        }
        /// <summary>
        /// Метод для побудови дерева на основі введених користувачем даних.
        /// Він приймає кількість вузлів (n) як аргумент і виконує наступні кроки:
        /// 1. Створює масив типу RecursiveTree розміром n для зберігання вузлів дерева.
        /// 2. Заповнює масив, запитуючи користувача ввести значення для кожного вузла.
        /// 3. Зв'язує вузли між собою, встановлюючи лівого та правого нащадків відповідно до формули:
        ///    - Лівий нащадок для вузла з індексом i знаходиться за індексом 2*i + 1.
        ///    - Правий нащадок для вузла з індексом i знаходиться за індексом 2*i + 2.
        /// </summary>
        /// <param name="n"></param>
        /// <returns></returns>
        public static RecursiveTree BuildTree(int n)
        {
            RecursiveTree[] recursiveTrees = new RecursiveTree[n];

            // Заповнюємо масив вузлами
            for (int i = 0; i < n; i++)
            {
                Console.Write($"Введіть значення вузла [{i}]: ");
                if (int.TryParse(Console.ReadLine(), out int value))
                {
                    recursiveTrees[i] = new RecursiveTree(value);
                }
                else
                {
                    Console.WriteLine("Введіть число.");
                    i--; // Відкочуємо лічильник, щоб повторити спробу для цього індексу
                }
            }

            // Зв'язуємо вузли
            for (int i = 0; i < n; i++)
            {
                int leftChildIndex = 2 * i + 1;
                int rightChildIndex = 2 * i + 2;

                // Встановлюємо лівого нащадка батьку recursiveTrees[i]
                if (leftChildIndex < n)
                {
                    recursiveTrees[i].SetLeft(recursiveTrees[leftChildIndex]);
                }

                // Встановлюємо правого нащадка батьку recursiveTrees[i]
                if (rightChildIndex < n)
                {
                    recursiveTrees[i].SetRight(recursiveTrees[rightChildIndex]);
                }
            }

            // Повертаємо найперший елемент (корінь дерева)
            return recursiveTrees[0];
        }
        /// <summary>
        /// Метод для побудови бінарного дерева пошуку (BST) на основі введених користувачем даних.
        /// Він приймає кількість вузлів (n) як аргумент і виконує наступні кроки:
        /// 1. Запитує користувача ввести значення для кожного вузла.
        /// 2. Кожне введене значення вставляє в BST через рекурсивний TreeInsert.
        /// 3. BST-властивість гарантується автоматично: ліві нащадки менші, праві більші.
        /// </summary>
        /// <param name="n">Кількість вузлів які потрібно вставити</param>
        /// <returns>Корінь побудованого BST</returns>
        public static RecursiveTree BuildBST(int n)
        {
            RecursiveTree root = null;  // дерево порожнє на початку

            for (int i = 0; i < n; i++)
            {
                Console.Write($"Введіть значення вузла [{i}]: ");
                if (int.TryParse(Console.ReadLine(), out int value))
                {
                    root = RecursiveTree.TreeInsert(root, value);
                }
                else
                {
                    Console.WriteLine("Введіть число.");
                    i--;
                }
            }

            return root;
        }
        /// <summary>
        /// Візуальний вивід дерева в консоль у вигляді ієрархічної структури.
        /// Використовує рекурсію для обходу вузлів.
        /// </summary>
        /// <param name="node">Поточний вузол</param>
        /// <param name="indent">Відступ для поточного рівня</param>
        /// <param name="isLeft">Чи є поточний вузол лівим нащадком</param>
        public static void PrintTree(RecursiveTree node, string indent, bool isLeft)
        {
            if (node == null)
            {
                return;
            }

            Console.WriteLine($"{indent}{(isLeft ? "├── " : "└── ")}{node.NodeValue}");

            string childIndent = indent + (isLeft ? "│   " : "    ");

            PrintTree(node.Right, childIndent, true);
            PrintTree(node.Left, childIndent, false);
        }
    }

}
