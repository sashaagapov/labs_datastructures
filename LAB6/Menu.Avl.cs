namespace agapovlab6;

public static partial class Menu
{
    private static void RunAvlMenu()
    {
        while (true)
        {
            Console.WriteLine("\n===== AVL Tree =====");
            Console.WriteLine("1. Build AVL from input");
            Console.WriteLine("2. Show AVL tree");
            Console.WriteLine("3. Demo LL: 30, 20, 10");
            Console.WriteLine("4. Demo RR: 10, 20, 30");
            Console.WriteLine("5. Demo LR: 30, 10, 20");
            Console.WriteLine("6. Demo RL: 10, 30, 20");
            Console.WriteLine("7. Search in AVL");
            Console.WriteLine("8. Delete value from AVL");
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
                case 8:
                    DeleteFromAvl();
                    break;
                case 0:
                    return;
                default:
                    Console.WriteLine("Invalid choice. Try again.");
                    break;
            }
        }
    }

    private static void SearchInAvl()
    {
        if (currentAVL == null)
        {
            Console.WriteLine("AVL tree is not built yet.");
            return;
        }

        Console.Write("Enter value to search: ");

        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Enter a number.");
            return;
        }

        AvlNode? foundNode = currentAVL.Search(value);

        if (foundNode == null)
        {
            Console.WriteLine($"Value {value} not found in AVL tree.");
        }
        else
        {
            Console.WriteLine($"Found {value}. Height = {foundNode.Height}, BalanceFactor = {currentAVL.GetNodeBalance(foundNode)}");
        }
    }

    private static void RunAvlDemo(string caseName, params int[] values)
    {
        currentAVL = new AvlTree();

        Console.WriteLine($"\nDemo {caseName}: {string.Join(", ", values)}");

        foreach (int value in values)
        {
            Console.WriteLine($"\nInsert {value}:");
            currentAVL.Insert(value);
            currentAVL.PrintTree();
        }

        Console.WriteLine($"\nAVL balancing demo for {caseName} completed.");
    }

    private static void BuildAvlFromInput()
    {
        Console.Write("Enter number of AVL nodes: ");

        if (!int.TryParse(Console.ReadLine(), out int n) || n <= 0)
        {
            Console.WriteLine("Count must be a positive number.");
            return;
        }

        currentAVL = Service.BuildAVL(n);

        Console.WriteLine("AVL tree built.");
        currentAVL.PrintTree();
    }

    private static void PrintCurrentAvl()
    {
        if (currentAVL == null)
        {
            Console.WriteLine("AVL tree is not built yet.");
            return;
        }

        currentAVL.PrintTree();
    }

    private static void DeleteFromAvl()
    {
        if (currentAVL == null)
        {
            Console.WriteLine("AVL tree is not built yet.");
            return;
        }

        Console.Write("Enter value to delete: ");
        if (!int.TryParse(Console.ReadLine(), out int value))
        {
            Console.WriteLine("Enter a number.");
            return;
        }

        currentAVL.Delete(value);
        Console.WriteLine($"Delete operation for {value} completed.");
        Console.WriteLine("AVL tree after delete:");
        currentAVL.PrintTree();
    }
}
