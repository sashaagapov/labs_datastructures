namespace agapovlab6;

/// <summary>
/// Клас AvlTree: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public partial class AvlTree
{
    /// <summary>
    /// Метод RightRotate: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
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

    /// <summary>
    /// Метод LeftRotate: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
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
