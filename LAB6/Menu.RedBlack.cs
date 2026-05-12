namespace agapovlab6;

/// <summary>
/// Клас Menu: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public static partial class Menu
{
    /// <summary>
    /// Метод RunRedBlackMenu: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void RunRedBlackMenu()
    {
        while (true)
        {
            Console.WriteLine("\n===== Червоно-чорне дерево =====");
            Console.WriteLine("1. Побудувати Red-Black Tree з введення");
            Console.WriteLine("2. Показати Red-Black Tree");
            Console.WriteLine("3. Demo insert: 41, 38, 31, 12, 19, 8");
            Console.WriteLine("4. Видалити вузол з Red-Black Tree");
            Console.WriteLine("5. Demo delete: leaf / one-child / two-children / root");
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
                    BuildRedBlackFromInput();
                    break;

                case 2:
                    PrintCurrentRedBlackTree();
                    break;

                case 3:
                    RunRedBlackDemo();
                    break;

                case 4:
                    DeleteFromRedBlackTree();
                    break;

                case 5:
                    RunRedBlackDeleteDemo();
                    break;

                case 0:
                    return;

                default:
                    Console.WriteLine("Невірний вибір. Спробуйте ще раз.");
                    WaitForKey();
                    break;
            }
        }
    }

    /// <summary>
    /// Метод BuildRedBlackFromInput: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void BuildRedBlackFromInput()
    {
        Console.Write("Введіть кількість вузлів: ");

        if (!int.TryParse(Console.ReadLine(), out int n) || n <= 0)
        {
            Console.WriteLine("Кількість має бути додатним числом.");
            WaitForKey();
            return;
        }

        currentRedBlackTree = new RedBlackTree();

        for (int i = 0; i < n; i++)
        {
            Console.Write($"Введіть значення вузла {i + 1}: ");

            if (!int.TryParse(Console.ReadLine(), out int value))
            {
                Console.WriteLine("Некоректне значення. Спробуйте ще раз.");
                i--;
                continue;
            }

            currentRedBlackTree.Insert(value);
        }

        Console.WriteLine("Red-Black Tree побудовано:");
        currentRedBlackTree.PrintTree();

        WaitForKey();
    }

    /// <summary>
    /// Метод PrintCurrentRedBlackTree: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void PrintCurrentRedBlackTree()
    {
        if (currentRedBlackTree == null)
        {
            Console.WriteLine("Red-Black Tree ще не побудовано.");
            WaitForKey();
            return;
        }

        currentRedBlackTree.PrintTree();
        WaitForKey();
    }

    /// <summary>
    /// Метод RunRedBlackDemo: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void RunRedBlackDemo()
    {
        int[] values = { 41, 38, 31, 12, 19, 8 };

        currentRedBlackTree = new RedBlackTree();

        Console.WriteLine("\nDemo Red-Black insert: 41, 38, 31, 12, 19, 8");

        foreach (int value in values)
        {
            Console.WriteLine($"\nВставляємо {value}:");
            currentRedBlackTree.Insert(value);
            currentRedBlackTree.PrintTree();
        }

        Console.WriteLine("\nDemo завершено.");
        WaitForKey();
    }

    /// <summary>
    /// Метод DeleteFromRedBlackTree: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void DeleteFromRedBlackTree()
    {
        if (currentRedBlackTree == null)
        {
            Console.WriteLine("Red-Black Tree ще не побудовано.");
            WaitForKey();
            return;
        }

        Console.Write("Введіть значення вузла для видалення: ");

        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Введіть коректне число.");
            WaitForKey();
            return;
        }

        bool deleted = currentRedBlackTree.Delete(value);
        if (!deleted)
        {
            Console.WriteLine($"Вузол {value} не знайдено.");
            WaitForKey();
            return;
        }

        Console.WriteLine($"Вузол {value} видалено. Поточне Red-Black Tree:");
        currentRedBlackTree.PrintTree();
        WaitForKey();
    }

    /// <summary>
    /// Метод RunRedBlackDeleteDemo: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void RunRedBlackDeleteDemo()
    {
        int[] values = { 41, 38, 31, 12, 19, 8 };

        currentRedBlackTree = new RedBlackTree();
        Console.WriteLine("\nDemo Red-Black delete. Початкові вставки: 41, 38, 31, 12, 19, 8");

        foreach (int value in values)
        {
            currentRedBlackTree.Insert(value);
        }

        Console.WriteLine("\nПочаткове дерево:");
        currentRedBlackTree.PrintTree();

        Console.WriteLine("\nВидалення 31 (leaf):");
        currentRedBlackTree.Delete(31);
        currentRedBlackTree.PrintTree();

        Console.WriteLine("\nВидалення 12 (вузол з одним child):");
        currentRedBlackTree.Delete(12);
        currentRedBlackTree.PrintTree();

        Console.WriteLine("\nВидалення 38 (вузол з двома children):");
        currentRedBlackTree.Delete(38);
        currentRedBlackTree.PrintTree();

        int? rootValue = currentRedBlackTree.Root?.Value;
        if (rootValue.HasValue)
        {
            Console.WriteLine($"\nВидалення {rootValue.Value} (root):");
            currentRedBlackTree.Delete(rootValue.Value);
            currentRedBlackTree.PrintTree();
        }

        Console.WriteLine("\nDemo delete завершено.");
        WaitForKey();
    }
}
