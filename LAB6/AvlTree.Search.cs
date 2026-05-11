namespace agapovlab6;

public partial class AvlTree
{
    public AvlNode? Search(int value)
    {
        return SearchNode(Root, value);
    }

    private AvlNode? SearchNode(AvlNode? node, int value)
    {
        if (node == null)
        {
            return null;
        }

        if (value == node.Value)
        {
            return node;
        }

        if (value < node.Value)
        {
            return SearchNode(node.Left, value);
        }

        return SearchNode(node.Right, value);
    }
}
