namespace agapovlab6;

public partial class AvlTree
{
    public void PrintTree()
    {
        PrintTree(Root, "", false);
    }

    private void PrintTree(AvlNode? node, string indent, bool isLeft)
    {
        if (node == null)
        {
            return;
        }

        int balance = GetBalance(node);

        Console.WriteLine($"{indent}{(isLeft ? "├── " : "└── ")}{node.Value} (h={node.Height}, bf={balance})");

        string childIndent = indent + (isLeft ? "│   " : "    ");

        PrintTree(node.Right, childIndent, true);
        PrintTree(node.Left, childIndent, false);
    }
}
