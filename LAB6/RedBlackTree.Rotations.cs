namespace agapovlab6;

/// <summary>
/// Клас RedBlackTree: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public partial class RedBlackTree
{
    /// <summary>
    /// Метод LeftRotate: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private void LeftRotate(RedBlackNode x)
    {
        RedBlackNode y = x.Right!;

        x.Right = y.Left;

        if (y.Left != null)
        {
            y.Left.Parent = x;
        }

        y.Parent = x.Parent;

        if (x.Parent == null)
        {
            Root = y;
        }
        else if (x == x.Parent.Left)
        {
            x.Parent.Left = y;
        }
        else
        {
            x.Parent.Right = y;
        }

        y.Left = x;
        x.Parent = y;
    }

    /// <summary>
    /// Метод RightRotate: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private void RightRotate(RedBlackNode y)
    {
        RedBlackNode x = y.Left!;

        y.Left = x.Right;

        if (x.Right != null)
        {
            x.Right.Parent = y;
        }

        x.Parent = y.Parent;

        if (y.Parent == null)
        {
            Root = x;
        }
        else if (y == y.Parent.Right)
        {
            y.Parent.Right = x;
        }
        else
        {
            y.Parent.Left = x;
        }

        x.Right = y;
        y.Parent = x;
    }
}
