namespace agapovlab5
{
    public static class Menu
    {
        public static void Run()
        {
            bool isRunning = false;
            while (isRunning == false)
            {
                Console.WriteLine("=======================РЕАЛІЗОВАНІ ЗАВДАННЯ==================");
                Console.WriteLine("1.Рекурсивний алгоритм,який здійснює прямий та зворотний обходи дерева з n вузлвми за час O(n)");
                Console.WriteLine("=============================================================");
                Console.Write("Виберіть завдання для виконання: ");
                int choice = int.Parse(Console.ReadLine() ?? "");
                switch (choice)
                {
                    case 1:
                        Console.Write("Введіть кількість вузлів: ");
                        int n = int.Parse(Console.ReadLine() ?? "");
                        RecursiveTree node1 = new RecursiveTree(1);
                        RecursiveTree node2 = new RecursiveTree(2);
                        RecursiveTree node3 = new RecursiveTree(3);
                        node1.SetLeft(node2);
                        node1.SetRight(node3);
                        Console.Write("PreOrder: ");
                        node1.PreOrder(node1);
                        Console.WriteLine();
                        Console.Write("PosyOrder: ");
                        node1.PostOrder(node1);
                        Console.WriteLine();
                        Console.WriteLine("Натисніть Enter,щоб повернутись в меню");
                        Console.ReadKey();
                        break;
                }
            }
        }
    }
}
