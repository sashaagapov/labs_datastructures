namespace agapovlab6;

public partial class AvlTree
{
    public void Insert(int value)
    {
        Root = InsertNode(Root, value);
    }

    private AvlNode InsertNode(AvlNode? node, int value)
    {
        if (node == null)
        {
            return new AvlNode(value);
        }

        if (value < node.Value)
        {
            node.Left = InsertNode(node.Left, value);
        }
        else if (value > node.Value)
        {
            node.Right = InsertNode(node.Right, value);
        }
        else
        {
            return node;
        }

        UpdateHeight(node);

        int balance = GetBalance(node);

        // LL case
        if (balance > 1 && value < node.Left!.Value)
        {
            return RightRotate(node);
        }

        // RR case
        if (balance < -1 && value > node.Right!.Value)
        {
            return LeftRotate(node);
        }

        // LR case
        if (balance > 1 && value > node.Left!.Value)
        {
            node.Left = LeftRotate(node.Left);
            return RightRotate(node);
        }

        // RL case
        if (balance < -1 && value < node.Right!.Value)
        {
            node.Right = RightRotate(node.Right);
            return LeftRotate(node);
        }

        return node;
    }
}
