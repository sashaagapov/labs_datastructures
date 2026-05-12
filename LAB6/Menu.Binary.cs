namespace agapovlab6;

/// <summary>
/// Клас Menu: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public static partial class Menu
{
    /// <summary>
    /// Метод RunBinaryTreeMenu: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void RunBinaryTreeMenu()
    {
        while (true)
        {
            Console.WriteLine("\n===== Звичайне бінарне дерево =====");
            Console.WriteLine("1. Створити звичайне дерево");
            Console.WriteLine("2. Показати звичайне дерево");
            Console.WriteLine("3. PreOrder / PostOrder");
            Console.WriteLine("4. InOrder (нерекурсивний)");
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
                    CreateTree();
                    break;
                case 2:
                    ShowTree();
                    break;
                case 3:
                    ExecuteTask2();
                    break;
                case 4:
                    ExecuteTask3();
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
    /// Метод CreateTree: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
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
    /// Метод ShowTree: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
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
    /// Метод ExecuteTask2: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
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
    /// Метод ExecuteTask3: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
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
}
