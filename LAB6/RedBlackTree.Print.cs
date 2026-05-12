namespace agapovlab6;

/// <summary>
/// Клас RedBlackTree: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public partial class RedBlackTree
{
    /// <summary>
    /// Метод PrintTree: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    public void PrintTree()
    {
        if (Root == null)
        {
            Console.WriteLine("Red-Black Tree порожнє.");
            return;
        }

        PrintTree(Root, "", false);
    }

    /// <summary>
    /// Метод PrintTree: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void PrintTree(RedBlackNode? node, string indent, bool isLeft)
    {
        if (node == null)
        {
            return;
        }

        Console.WriteLine($"{indent}{(isLeft ? "├── " : "└── ")}{node.Value} ({node.Color})");

        string childIndent = indent + (isLeft ? "│   " : "    ");

        PrintTree(node.Right, childIndent, true);
        PrintTree(node.Left, childIndent, false);
    }
}
