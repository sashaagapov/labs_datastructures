namespace agapovlab6;

public static partial class Menu
{
    private static void RunRedBlackMenu()
    {
        while (true)
        {
            Console.WriteLine("\n===== Red-Black Tree =====");
            Console.WriteLine("1. Build Red-Black Tree from input");
            Console.WriteLine("2. Show Red-Black Tree");
            Console.WriteLine("3. Demo insert: 41, 38, 31, 12, 19, 8");
            Console.WriteLine("4. Delete node from Red-Black Tree");
            Console.WriteLine("5. Demo delete: leaf / one-child / two-children / root");
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
                    Console.WriteLine("Invalid choice. Try again.");
                    WaitForKey();
                    break;
            }
        }
    }

    private static void BuildRedBlackFromInput()
    {
        Console.Write("Enter number of nodes: ");

        if (!int.TryParse(Console.ReadLine(), out int n) || n <= 0)
        {
            Console.WriteLine("Count must be a positive number.");
            WaitForKey();
            return;
        }

        currentRedBlackTree = new RedBlackTree();

        for (int i = 0; i < n; i++)
        {
            Console.Write($"Enter value for node {i + 1}: ");

            if (!int.TryParse(Console.ReadLine(), out int value))
            {
                Console.WriteLine("Invalid value. Try again.");
                i--;
                continue;
            }

            currentRedBlackTree.Insert(value);
        }

        Console.WriteLine("Red-Black Tree built:");
        currentRedBlackTree.PrintTree();

        WaitForKey();
    }

    private static void PrintCurrentRedBlackTree()
    {
        if (currentRedBlackTree == null)
        {
            Console.WriteLine("Red-Black Tree is not built yet.");
            WaitForKey();
            return;
        }

        currentRedBlackTree.PrintTree();
        WaitForKey();
    }

    private static void RunRedBlackDemo()
    {
        int[] values = { 41, 38, 31, 12, 19, 8 };

        currentRedBlackTree = new RedBlackTree();

        Console.WriteLine("\nDemo Red-Black insert: 41, 38, 31, 12, 19, 8");

        foreach (int value in values)
        {
            Console.WriteLine($"\nInsert {value}:");
            currentRedBlackTree.Insert(value);
            currentRedBlackTree.PrintTree();
        }

        Console.WriteLine("\nInsert demo completed.");
        WaitForKey();
    }

    private static void DeleteFromRedBlackTree()
    {
        if (currentRedBlackTree == null)
        {
            Console.WriteLine("Red-Black Tree is not built yet.");
            WaitForKey();
            return;
        }

        Console.Write("Enter value to delete: ");

        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Enter a valid number.");
            WaitForKey();
            return;
        }

        bool deleted = currentRedBlackTree.Delete(value);
        if (!deleted)
        {
            Console.WriteLine($"Node {value} not found.");
            WaitForKey();
            return;
        }

        Console.WriteLine($"Node {value} deleted. Current Red-Black Tree:");
        currentRedBlackTree.PrintTree();
        WaitForKey();
    }

    private static void RunRedBlackDeleteDemo()
    {
        int[] values = { 41, 38, 31, 12, 19, 8 };

        currentRedBlackTree = new RedBlackTree();
        Console.WriteLine("\nDemo Red-Black delete. Initial inserts: 41, 38, 31, 12, 19, 8");

        foreach (int value in values)
        {
            currentRedBlackTree.Insert(value);
        }

        Console.WriteLine("\nInitial tree:");
        currentRedBlackTree.PrintTree();

        Console.WriteLine("\nDelete 31 (leaf):");
        currentRedBlackTree.Delete(31);
        currentRedBlackTree.PrintTree();

        Console.WriteLine("\nDelete 12 (one child):");
        currentRedBlackTree.Delete(12);
        currentRedBlackTree.PrintTree();

        Console.WriteLine("\nDelete 38 (two children):");
        currentRedBlackTree.Delete(38);
        currentRedBlackTree.PrintTree();

        int? rootValue = currentRedBlackTree.Root?.Value;
        if (rootValue.HasValue)
        {
            Console.WriteLine($"\nDelete {rootValue.Value} (root):");
            currentRedBlackTree.Delete(rootValue.Value);
            currentRedBlackTree.PrintTree();
        }

        Console.WriteLine("\nDelete demo completed.");
        WaitForKey();
    }
}
