namespace agapovlab6;

/// <summary>
/// Клас Menu: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public static partial class Menu
{
    /// <summary>
    /// Метод RunBstMenu: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void RunBstMenu()
    {
        while (true)
        {
            Console.WriteLine("\n===== Бінарне дерево пошуку BST =====");
            Console.WriteLine("1. Створити BST");
            Console.WriteLine("2. Показати BST");
            Console.WriteLine("3. Iterative InOrder");
            Console.WriteLine("4. TreeMinimum / TreeMaximum");
            Console.WriteLine("5. TreePredecessor");
            Console.WriteLine("6. TreeSuccessor");
            Console.WriteLine("7. TreeInsert — перевірка BST");
            Console.WriteLine("8. TreeDelete");
            Console.WriteLine("9. LeftRotate");
            Console.WriteLine("10. RightRotate");
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
                    CreateBST();
                    break;
                case 2:
                    ShowBST();
                    break;
                case 3:
                    ExecuteTask6();
                    break;
                case 4:
                    ExecuteTask4();
                    break;
                case 5:
                    ExecuteTask5();
                    break;
                case 6:
                    ExecuteTask5Successor();
                    break;
                case 7:
                    ExecuteTask6();
                    break;
                case 8:
                    ExecuteTask7();
                    break;
                case 9:
                    ExecuteTask8();
                    break;
                case 10:
                    ExecuteTask9();
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
    /// Метод CreateBST: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
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
    /// Метод ShowBST: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void ShowBST()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Спочатку створіть BST (пункт 1).");
            WaitForKey();
            return;
        }

        Console.WriteLine("BST:");
        Service.PrintTree(currentBST, "", false);
        WaitForKey();
    }

    /// <summary>
    /// Метод ExecuteTask4: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void ExecuteTask4()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Спочатку створіть BST (пункт 1).");
            WaitForKey();
            return;
        }

        Console.WriteLine($"Мінімум в дереві: {RecursiveTree.TreeMinimum(currentBST).NodeValue}");
        Console.WriteLine($"Максимум в дереві: {RecursiveTree.TreeMaximum(currentBST).NodeValue}");

        WaitForKey();
    }

    /// <summary>
    /// Метод ExecuteTask5: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void ExecuteTask5()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Спочатку створіть BST (пункт 1).");
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
    /// Метод ExecuteTask5Successor: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void ExecuteTask5Successor()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Спочатку створіть BST (пункт 1).");
            WaitForKey();
            return;
        }

        Console.Write("Введіть значення вузла для якого шукаєте successor: ");
        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Введіть число: ");
            WaitForKey();
            return;
        }

        RecursiveTree? successor = RecursiveTree.TreeSuccessor(currentBST, value);

        if (successor == null)
        {
            Console.WriteLine("Successor не існує — це максимальний елемент дерева.");
        }
        else
        {
            Console.WriteLine($"Successor для {value}: {successor.NodeValue}");
        }

        WaitForKey();
    }

    /// <summary>
    /// Метод ExecuteTask6: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void ExecuteTask6()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Спочатку створіть BST (пункт 1).");
            WaitForKey();
            return;
        }

        Console.Write("InOrder (перевірка BST): ");
        currentBST.IterativeInOrder(currentBST);
        Console.WriteLine();

        WaitForKey();
    }

    /// <summary>
    /// Метод ExecuteTask7: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void ExecuteTask7()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Спочатку створіть BST (пункт 1).");
            WaitForKey();
            return;
        }

        Console.Write("Введіть значення вузла для видалення: ");
        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Введіть число: ");
            WaitForKey();
            return;
        }

        currentBST = RecursiveTree.TreeDelete(currentBST, value);
        Console.WriteLine($"Вузол зі значенням {value} видалено (якщо він існував).");

        WaitForKey();
    }

    /// <summary>
    /// Метод ExecuteTask8: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void ExecuteTask8()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Спочатку створіть BST.");
            WaitForKey();
            return;
        }

        Console.Write("Введіть значення вузла для лівого повороту: ");

        if (!int.TryParse(Console.ReadLine(), out int leftRotateValue))
        {
            Console.WriteLine("Некоректне значення.");
            WaitForKey();
            return;
        }

        RecursiveTree? leftRotateNode = RecursiveTree.Search(currentBST, leftRotateValue);

        if (leftRotateNode == null)
        {
            Console.WriteLine("Вузол не знайдено.");
            WaitForKey();
            return;
        }

        currentBST = RecursiveTree.LeftRotate(currentBST, leftRotateNode);

        Console.WriteLine("BST після лівого повороту:");
        Service.PrintTree(currentBST, "", false);

        WaitForKey();
    }

    /// <summary>
    /// Метод ExecuteTask9: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void ExecuteTask9()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Спочатку створіть BST.");
            WaitForKey();
            return;
        }

        Console.Write("Введіть значення вузла для правого повороту: ");

        if (!int.TryParse(Console.ReadLine(), out int rightRotateValue))
        {
            Console.WriteLine("Некоректне значення.");
            WaitForKey();
            return;
        }

        RecursiveTree? rightRotateNode = RecursiveTree.Search(currentBST, rightRotateValue);

        if (rightRotateNode == null)
        {
            Console.WriteLine("Вузол не знайдено.");
            WaitForKey();
            return;
        }

        currentBST = RecursiveTree.RightRotate(currentBST, rightRotateNode);

        Console.WriteLine("BST після правого повороту:");
        Service.PrintTree(currentBST, "", false);

        WaitForKey();
    }
}
