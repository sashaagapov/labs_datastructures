namespace agapovlab6
{
    /// <summary>
    /// Клас для управління меню програми.
    /// Зберігає стан двох дерев — звичайного та BST.
    /// </summary>
    public static partial class Menu
    {
        private static RecursiveTree currentTree = null;
        private static RecursiveTree currentBST = null;
        private static AvlTree? currentAVL;

        /// <summary>
        /// Запускає головне меню програми та обробляє вибір користувача.
        /// </summary>
        public static void Run()
        {
            bool isRunning = true;
            while (isRunning)
            {
                Console.WriteLine("========================== LAB6 ==============================");
                Console.WriteLine($"Звичайне дерево:   {(currentTree != null ? "створено" : "не створено")}");
                Console.WriteLine($"BST:               {(currentBST != null ? "створено" : "не створено")}");
                Console.WriteLine($"AVL:               {(currentAVL != null ? "створено" : "не створено")}");
                Console.WriteLine("==============================================================");
                Console.WriteLine("1. Звичайне бінарне дерево");
                Console.WriteLine("2. Бінарне дерево пошуку BST");
                Console.WriteLine("3. AVL-дерево");
                Console.WriteLine("4. Червоно-чорне дерево");
                Console.WriteLine("==============================================================");
                Console.WriteLine("0. Вихід");
                Console.WriteLine("==============================================================");
                Console.Write("Виберіть дію: ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            RunBinaryTreeMenu();
                            break;
                        case 2:
                            RunBstMenu();
                            break;
                        case 3:
                            RunAvlMenu();
                            break;
                        case 4:
                            Console.WriteLine("Red-Black Tree ще не реалізовано.");
                            WaitForKey();
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

        /// <summary>
        /// Очікує натискання Enter перед поверненням у меню.
        /// </summary>
        private static void WaitForKey()
        {
            Console.WriteLine("Натисніть Enter, щоб повернутись в меню...");
            Console.ReadLine();
        }
    }
}
