namespace agapovlab6
{
    public static partial class Menu
    {
        private static RecursiveTree currentTree = null;
        private static RecursiveTree currentBST = null;
        private static AvlTree? currentAVL;
        private static RedBlackTree? currentRedBlackTree;

        public static void Run()
        {
            bool isRunning = true;
            while (isRunning)
            {
                Console.WriteLine("========================== LAB6 ==============================");
                Console.WriteLine($"Binary tree:        {(currentTree != null ? "created" : "not created")}");
                Console.WriteLine($"BST:                {(currentBST != null ? "created" : "not created")}");
                Console.WriteLine($"AVL:                {(currentAVL != null ? "created" : "not created")}");
                Console.WriteLine($"Red-Black Tree:     {(currentRedBlackTree != null ? "created" : "not created")}");
                Console.WriteLine("==============================================================");
                Console.WriteLine("1. Binary tree");
                Console.WriteLine("2. BST tree");
                Console.WriteLine("3. AVL tree");
                Console.WriteLine("4. Red-Black tree");
                Console.WriteLine("5. Interval tree LEFT-ROTATE demo");
                Console.WriteLine("==============================================================");
                Console.WriteLine("0. Exit");
                Console.WriteLine("==============================================================");
                Console.Write("Select action: ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            RunBinaryTreeMenu();
                            break;
                        case 2:
                            RunBstMenu();
                            break;
                        case 3:
                            RunAvlMenu();
                            break;
                        case 4:
                            RunRedBlackMenu();
                            break;
                        case 5:
                            IntervalTreeDemo.Run();
                            WaitForKey();
                            break;
                        case 0:
                            isRunning = false;
                            break;
                        default:
                            Console.WriteLine("Invalid choice. Try again.");
                            WaitForKey();
                            break;
                    }
                }
            }
        }

        private static void WaitForKey()
        {
            Console.WriteLine("Press Enter to return to menu...");
            Console.ReadLine();
        }
    }
}
