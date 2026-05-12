namespace agapovlab6;

/// <summary>
/// Клас Menu: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public static partial class Menu
{
    /// <summary>
    /// Метод RunAvlMenu: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void RunAvlMenu()
    {
        while (true)
        {
            Console.WriteLine("\n===== AVL-дерево =====");
            Console.WriteLine("1. Побудувати AVL з введення");
            Console.WriteLine("2. Показати AVL");
            Console.WriteLine("3. Demo LL: 30, 20, 10");
            Console.WriteLine("4. Demo RR: 10, 20, 30");
            Console.WriteLine("5. Demo LR: 30, 10, 20");
            Console.WriteLine("6. Demo RL: 10, 30, 20");
            Console.WriteLine("7. Пошук в AVL");
            Console.WriteLine("0. Назад");
            Console.Write("Ваш вибір: ");

            if (!int.TryParse(Console.ReadLine(), out int choice))
            {
                Console.WriteLine("Введіть число.");
                continue;
            }

            switch (choice)
            {
                case 1:
                    BuildAvlFromInput();
                    break;

                case 2:
                    PrintCurrentAvl();
                    break;
                case 3:
                    RunAvlDemo("LL", 30, 20, 10);
                    break;

                case 4:
                    RunAvlDemo("RR", 10, 20, 30);
                    break;

                case 5:
                    RunAvlDemo("LR", 30, 10, 20);
                    break;

                case 6:
                    RunAvlDemo("RL", 10, 30, 20);
                    break;
                case 7:
                    SearchInAvl();
                    break;
                case 0:
                    return;

                default:
                    Console.WriteLine("Такий пункт ще не реалізований.");
                    break;
            }
        }
    }

    /// <summary>
    /// Метод SearchInAvl: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void SearchInAvl()
    {
        if (currentAVL == null)
        {
            Console.WriteLine("AVL-дерево ще не побудовано.");
            return;
        }

        Console.Write("Введіть значення для пошуку: ");

        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Введіть число.");
            return;
        }

        AvlNode? foundNode = currentAVL.Search(value);

        if (foundNode == null)
        {
            Console.WriteLine($"Значення {value} не знайдено в AVL-дереві.");
        }
        else
        {
            Console.WriteLine($"Значення {value} знайдено. Height = {foundNode.Height}, BalanceFactor = {currentAVL.GetNodeBalance(foundNode)}");
        }
    }

    /// <summary>
    /// Метод RunAvlDemo: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void RunAvlDemo(string caseName, params int[] values)
    {
        currentAVL = new AvlTree();

        Console.WriteLine($"\nDemo {caseName}: {string.Join(", ", values)}");

        foreach (int value in values)
        {
            Console.WriteLine($"\nВставляємо {value}:");
            currentAVL.Insert(value);
            currentAVL.PrintTree();
        }

        Console.WriteLine($"\nПісля балансування AVL-дерево для {caseName} case готове.");
    }

    /// <summary>
    /// Метод BuildAvlFromInput: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void BuildAvlFromInput()
    {
        Console.Write("Введіть кількість AVL-вузлів: ");

        if (!int.TryParse(Console.ReadLine(), out int n) || n <= 0)
        {
            Console.WriteLine("Кількість має бути додатним числом.");
            return;
        }

        currentAVL = Service.BuildAVL(n);

        Console.WriteLine("AVL-дерево побудовано.");
        currentAVL.PrintTree();
    }

    /// <summary>
    /// Метод PrintCurrentAvl: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void PrintCurrentAvl()
    {
        if (currentAVL == null)
        {
            Console.WriteLine("AVL-дерево ще не побудовано.");
            return;
        }

        currentAVL.PrintTree();
    }
}
