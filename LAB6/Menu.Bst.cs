namespace agapovlab6;

public static partial class Menu
{
    private static void RunBstMenu()
    {
        while (true)
        {
            Console.WriteLine("\n===== BST =====");
            Console.WriteLine("1. Create BST");
            Console.WriteLine("2. Show BST");
            Console.WriteLine("3. Iterative InOrder");
            Console.WriteLine("4. TreeMinimum / TreeMaximum");
            Console.WriteLine("5. TreePredecessor");
            Console.WriteLine("6. TreeSuccessor");
            Console.WriteLine("7. TreeInsert check (InOrder)");
            Console.WriteLine("8. TreeDelete");
            Console.WriteLine("9. LeftRotate");
            Console.WriteLine("10. RightRotate");
            Console.WriteLine("0. Back");
            Console.Write("Your choice: ");

            if (!int.TryParse(Console.ReadLine(), out int choice))
            {
                Console.WriteLine("Enter a number.");
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
                    Console.WriteLine("Invalid choice. Try again.");
                    WaitForKey();
                    break;
            }
        }
    }

    private static void CreateBST()
    {
        Console.Write("Enter number of nodes: ");
        if (int.TryParse(Console.ReadLine(), out int n) && n > 0)
        {
            currentBST = Service.BuildBST(n);
            Console.WriteLine("BST created.");
        }
        else
        {
            Console.WriteLine("Invalid count.");
        }
        WaitForKey();
    }

    private static void ShowBST()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Create BST first (option 1).");
            WaitForKey();
            return;
        }

        Console.WriteLine("BST:");
        Service.PrintTree(currentBST, "", false);
        WaitForKey();
    }

    private static void ExecuteTask4()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Create BST first (option 1).");
            WaitForKey();
            return;
        }

        Console.WriteLine($"Minimum: {RecursiveTree.TreeMinimum(currentBST).NodeValue}");
        Console.WriteLine($"Maximum: {RecursiveTree.TreeMaximum(currentBST).NodeValue}");

        WaitForKey();
    }

    private static void ExecuteTask5()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Create BST first (option 1).");
            WaitForKey();
            return;
        }
        Console.Write("Enter value to find predecessor: ");
        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Enter a number.");
            WaitForKey();
            return;
        }
        RecursiveTree predecessor = RecursiveTree.TreePredecessor(currentBST, value);

        if (predecessor == null)
        {
            Console.WriteLine("Predecessor does not exist.");
        }
        else
        {
            Console.WriteLine($"Predecessor for {value}: {predecessor.NodeValue}");
        }

        WaitForKey();
    }

    private static void ExecuteTask5Successor()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Create BST first (option 1).");
            WaitForKey();
            return;
        }

        Console.Write("Enter value to find successor: ");
        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Enter a number.");
            WaitForKey();
            return;
        }

        RecursiveTree? successor = RecursiveTree.TreeSuccessor(currentBST, value);

        if (successor == null)
        {
            Console.WriteLine("Successor does not exist.");
        }
        else
        {
            Console.WriteLine($"Successor for {value}: {successor.NodeValue}");
        }

        WaitForKey();
    }

    private static void ExecuteTask6()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Create BST first (option 1).");
            WaitForKey();
            return;
        }

        Console.Write("InOrder: ");
        currentBST.IterativeInOrder(currentBST);
        Console.WriteLine();

        WaitForKey();
    }

    private static void ExecuteTask7()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Create BST first (option 1).");
            WaitForKey();
            return;
        }

        Console.Write("Enter value to delete: ");
        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Enter a number.");
            WaitForKey();
            return;
        }

        currentBST = RecursiveTree.TreeDelete(currentBST, value);
        Console.WriteLine($"Delete operation for {value} completed.");

        WaitForKey();
    }

    private static void ExecuteTask8()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Create BST first.");
            WaitForKey();
            return;
        }

        Console.Write("Enter node value for left rotate: ");

        if (!int.TryParse(Console.ReadLine(), out int leftRotateValue))
        {
            Console.WriteLine("Invalid value.");
            WaitForKey();
            return;
        }

        RecursiveTree? leftRotateNode = RecursiveTree.Search(currentBST, leftRotateValue);

        if (leftRotateNode == null)
        {
            Console.WriteLine("Node not found.");
            WaitForKey();
            return;
        }

        currentBST = RecursiveTree.LeftRotate(currentBST, leftRotateNode);

        Console.WriteLine("BST after left rotate:");
        Service.PrintTree(currentBST, "", false);

        WaitForKey();
    }

    private static void ExecuteTask9()
    {
        if (currentBST == null)
        {
            Console.WriteLine("Create BST first.");
            WaitForKey();
            return;
        }

        Console.Write("Enter node value for right rotate: ");

        if (!int.TryParse(Console.ReadLine(), out int rightRotateValue))
        {
            Console.WriteLine("Invalid value.");
            WaitForKey();
            return;
        }

        RecursiveTree? rightRotateNode = RecursiveTree.Search(currentBST, rightRotateValue);

        if (rightRotateNode == null)
        {
            Console.WriteLine("Node not found.");
            WaitForKey();
            return;
        }

        currentBST = RecursiveTree.RightRotate(currentBST, rightRotateNode);

        Console.WriteLine("BST after right rotate:");
        Service.PrintTree(currentBST, "", false);

        WaitForKey();
    }
}
