namespace agapovlab5
{
    public static class Menu
    {
        public static void Run()
        {
            bool isRunning = true;
            while (isRunning)
            {
                Console.Clear();
                Console.WriteLine("======================= РЕАЛІЗОВАНІ ЗАВДАННЯ ==================");
                Console.WriteLine("1. Рекурсивні обходи (PreOrder, PostOrder)");
                Console.WriteLine("2. Нерекурсивний симетричний обхід (InOrder)");
                Console.WriteLine("0. Вихід");
                Console.WriteLine("=============================================================");
                Console.Write("Виберіть завдання для виконання: ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            ExecuteTask1();
                            break;
                        case 2:
                            ExecuteTask2();
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

        // Окрема логіка для першого пункту 
        private static void ExecuteTask1()
        {
            Console.Write("Введіть кількість вузлів: ");
            if (int.TryParse(Console.ReadLine(), out int n) && n > 0)
            {
                RecursiveTree root = Service.BuildTree(n);

                Console.Write("PreOrder: ");
                root.PreOrder(root);
                Console.WriteLine();

                Console.Write("PostOrder: ");
                root.PostOrder(root);
                Console.WriteLine();
            }
            else
            {
                Console.WriteLine("Введено некоректну кількість.");
            }
            WaitForKey();
        }

        // Окрема логіка для другого пункту (Завдання 3 за методичкою)
        private static void ExecuteTask2()
        {
            Console.Write("Введіть кількість вузлів: ");
            if (int.TryParse(Console.ReadLine(), out int n) && n > 0)
            {
                RecursiveTree root = Service.BuildTree(n);

                Console.Write("Iterative InOrder: ");
                root.IterativeInOrder(root);
                Console.WriteLine();
            }
            else
            {
                Console.WriteLine("Введено некоректну кількість.");
            }
            WaitForKey();
        }

        // Спільний метод для уникнення дублювання Console.ReadKey()
        private static void WaitForKey()
        {
            Console.WriteLine("Натисніть Enter, щоб повернутись в меню...");
            Console.ReadLine(); // ReadLine працює надійніше для Enter, ніж ReadKey
        }
    }
}