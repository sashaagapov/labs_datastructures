namespace agapovlab6;

public partial class AvlTree
{
    public AvlNode? Root { get; private set; }

    private int GetHeight(AvlNode? node)
    {
        if (node == null)
        {
            return 0;
        }

        return node.Height;
    }

    private int GetBalance(AvlNode? node)
    {
        if (node == null)
        {
            return 0;
        }

        return GetHeight(node.Left) - GetHeight(node.Right);
    }

    public int GetNodeBalance(AvlNode node)
    {
        return GetBalance(node);
    }

    private void UpdateHeight(AvlNode node)
    {
        node.Height = 1 + Math.Max(GetHeight(node.Left), GetHeight(node.Right));
    }
}
