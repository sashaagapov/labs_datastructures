namespace agapovlab5
{
    /// <summary>
    /// Клас для управління меню програми.
    /// Зберігає стан двох дерев — звичайного та BST.
    /// </summary>
    public static class Menu
    {
        private static RecursiveTree currentTree = null;
        private static RecursiveTree currentBST = null;

        public static void Run()
        {
            bool isRunning = true;
            while (isRunning)
            {
                Console.WriteLine("======================= УПРАВЛІННЯ ДЕРЕВАМИ ==================");
                Console.WriteLine($"Звичайне дерево: {(currentTree != null ? "створено" : "не створено")}");
                Console.WriteLine($"BST:             {(currentBST != null ? "створено" : "не створено")}");
                Console.WriteLine("=============================================================");
                Console.WriteLine("1. Створити звичайне дерево");
                Console.WriteLine("2. Створити BST");
                Console.WriteLine("3. Показати звичайне дерево");
                Console.WriteLine("4. Показати BST");
                Console.WriteLine("======================= ЗАВДАННЯ ============================");
                Console.WriteLine("5. Завдання 2: PreOrder / PostOrder");
                Console.WriteLine("6. Завдання 3: InOrder (нерекурсивний)");
                Console.WriteLine("7. Завдання 4: TreeMinimum / TreeMaximum");
                Console.WriteLine("8. Завдання 5: TreePredecessor ");
                Console.WriteLine("9. Завдання 6: TreeInsert — перевірка BST");
                Console.WriteLine("=============================================================");
                Console.WriteLine("0. Вихід");
                Console.WriteLine("=============================================================");
                Console.Write("Виберіть дію: ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            CreateTree();
                            break;
                        case 2:
                            CreateBST();
                            break;
                        case 3:
                            ShowTree();
                            break;
                        case 4:
                            ShowBST();
                            break;
                        case 5:
                            ExecuteTask2();
                            break;
                        case 6:
                            ExecuteTask3();
                            break;
                        case 7:
                            ExecuteTask4();
                            break;
                        case 8:
                            ExecuteTask5();
                            break;
                        case 9:
                            ExecuteTask6();
                            break;
                        case 0:
                            isRunning = false;
                            break;
                        default:
                            Console.WriteLine("Невірний вибір. Спробуйте ще раз.");
                            WaitForKey();
                            break;
                    }
                }
            }
        }

        // ==================== УПРАВЛІННЯ ДЕРЕВАМИ ====================

        /// <summary>
        /// Створює звичайне дерево і зберігає його в currentTree.
        /// </summary>
        private static void CreateTree()
        {
            Console.Write("Введіть кількість вузлів: ");
            if (int.TryParse(Console.ReadLine(), out int n) && n > 0)
            {
                currentTree = Service.BuildTree(n);
                Console.WriteLine("Звичайне дерево успішно створено!");
            }
            else
            {
                Console.WriteLine("Введено некоректну кількість.");
            }
            WaitForKey();
        }

        /// <summary>
        /// Створює BST і зберігає його в currentBST.
        /// </summary>
        private static void CreateBST()
        {
            Console.Write("Введіть кількість вузлів: ");
            if (int.TryParse(Console.ReadLine(), out int n) && n > 0)
            {
                currentBST = Service.BuildBST(n);
                Console.WriteLine("BST успішно створено!");
            }
            else
            {
                Console.WriteLine("Введено некоректну кількість.");
            }
            WaitForKey();
        }

        /// <summary>
        /// Виводить візуалізацію звичайного дерева.
        /// </summary>
        private static void ShowTree()
        {
            if (currentTree == null)
            {
                Console.WriteLine("Спочатку створіть звичайне дерево (пункт 1).");
                WaitForKey();
                return;
            }

            Console.WriteLine("Звичайне дерево:");
            Service.PrintTree(currentTree, "", false);
            WaitForKey();
        }

        /// <summary>
        /// Виводить візуалізацію BST.
        /// </summary>
        private static void ShowBST()
        {
            if (currentBST == null)
            {
                Console.WriteLine("Спочатку створіть BST (пункт 2).");
                WaitForKey();
                return;
            }

            Console.WriteLine("BST:");
            Service.PrintTree(currentBST, "", false);
            WaitForKey();
        }

        // ==================== ЗАВДАННЯ ====================

        /// <summary>
        /// Завдання 2: Рекурсивні обходи PreOrder та PostOrder.
        /// </summary>
        private static void ExecuteTask2()
        {
            if (currentTree == null)
            {
                Console.WriteLine("Спочатку створіть звичайне дерево (пункт 1).");
                WaitForKey();
                return;
            }

            Console.Write("PreOrder:  ");
            currentTree.PreOrder(currentTree);
            Console.WriteLine();

            Console.Write("PostOrder: ");
            currentTree.PostOrder(currentTree);
            Console.WriteLine();

            WaitForKey();
        }

        /// <summary>
        /// Завдання 3: Нерекурсивний симетричний обхід InOrder.
        /// </summary>
        private static void ExecuteTask3()
        {
            if (currentTree == null)
            {
                Console.WriteLine("Спочатку створіть звичайне дерево (пункт 1).");
                WaitForKey();
                return;
            }

            Console.Write("Iterative InOrder: ");
            currentTree.IterativeInOrder(currentTree);
            Console.WriteLine();

            WaitForKey();
        }

        /// <summary>
        /// Завдання 4: Пошук мінімального та максимального вузла в BST.
        /// </summary>
        private static void ExecuteTask4()
        {
            if (currentBST == null)
            {
                Console.WriteLine("Спочатку створіть BST (пункт 2).");
                WaitForKey();
                return;
            }

            Console.WriteLine($"Мінімум в дереві: {RecursiveTree.TreeMinimum(currentBST).NodeValue}");
            Console.WriteLine($"Максимум в дереві: {RecursiveTree.TreeMaximum(currentBST).NodeValue}");

            WaitForKey();
        }

        /// <summary>
        /// Завдання 5: TreePredecessor.
        /// </summary>
        private static void ExecuteTask5()
        {
            if (currentBST == null)
            {
                Console.WriteLine("Спочатку створіть BST (пункт 2).");
                WaitForKey();
                return;
            }
            Console.Write("Введіть значення вузла для якого шукаєте predecessor: ");
            if (!int.TryParse(Console.ReadLine(), out int value))
            {
                Console.WriteLine("Введіть число: ");
                WaitForKey();
                return;
            }
            RecursiveTree predecessor = RecursiveTree.TreePredecessor(currentBST, value);

            if (predecessor == null)
            {
                Console.WriteLine("Predecessor не існує — це мінімальний елемент дерева.");
            }
            else
            {
                Console.WriteLine($"Predecessor для {value}: {predecessor.NodeValue}");
            }

            WaitForKey();
        }

        /// <summary>
        /// Завдання 6: Перевірка коректності BST через InOrder обхід.
        /// </summary>
        private static void ExecuteTask6()
        {
            if (currentBST == null)
            {
                Console.WriteLine("Спочатку створіть BST (пункт 2).");
                WaitForKey();
                return;
            }

            Console.Write("InOrder (перевірка BST): ");
            currentBST.IterativeInOrder(currentBST);
            Console.WriteLine();

            WaitForKey();
        }


        private static void WaitForKey()
        {
            Console.WriteLine("Натисніть Enter, щоб повернутись в меню...");
            Console.ReadLine();
        }
    }
}
