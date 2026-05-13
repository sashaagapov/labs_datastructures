namespace agapovlab6;

public static partial class Menu
{
    private static void RunBinaryTreeMenu()
    {
        while (true)
        {
            Console.WriteLine("\n===== Binary Tree =====");
            Console.WriteLine("1. Create binary tree");
            Console.WriteLine("2. Show binary tree");
            Console.WriteLine("3. PreOrder / PostOrder");
            Console.WriteLine("4. InOrder (iterative)");
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
                    Console.WriteLine("Invalid choice. Try again.");
                    WaitForKey();
                    break;
            }
        }
    }

    private static void CreateTree()
    {
        Console.Write("Enter number of nodes: ");
        if (int.TryParse(Console.ReadLine(), out int n) && n > 0)
        {
            currentTree = Service.BuildTree(n);
            Console.WriteLine("Binary tree created.");
        }
        else
        {
            Console.WriteLine("Invalid count.");
        }
        WaitForKey();
    }

    private static void ShowTree()
    {
        if (currentTree == null)
        {
            Console.WriteLine("Create binary tree first (option 1).");
            WaitForKey();
            return;
        }

        Console.WriteLine("Binary tree:");
        Service.PrintTree(currentTree, "", false);
        WaitForKey();
    }

    private static void ExecuteTask2()
    {
        if (currentTree == null)
        {
            Console.WriteLine("Create binary tree first (option 1).");
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

    private static void ExecuteTask3()
    {
        if (currentTree == null)
        {
            Console.WriteLine("Create binary tree first (option 1).");
            WaitForKey();
            return;
        }

        Console.Write("Iterative InOrder: ");
        currentTree.IterativeInOrder(currentTree);
        Console.WriteLine();

        WaitForKey();
    }
}
