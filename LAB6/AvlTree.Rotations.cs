namespace agapovlab6;

public partial class AvlTree
{
    private AvlNode RightRotate(AvlNode y)
    {
        AvlNode x = y.Left!;
        AvlNode? temp = x.Right;

        x.Right = y;
        y.Left = temp;

        UpdateHeight(y);
        UpdateHeight(x);

        return x;
    }

    private AvlNode LeftRotate(AvlNode x)
    {
        AvlNode y = x.Right!;
        AvlNode? temp = y.Left;

        y.Left = x;
        x.Right = temp;

        UpdateHeight(x);
        UpdateHeight(y);

        return y;
    }
}
