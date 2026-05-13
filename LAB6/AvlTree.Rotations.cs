namespace agapovlab6;

/// <summary>
/// Допоміжні повороти AVL-дерева для відновлення балансу.
/// </summary>
public partial class AvlTree
{
    /// <summary>
    /// Виконує правий поворот навколо вузла <paramref name="y"/>.
    /// </summary>
    private AvlNode RightRotate(AvlNode y)
    {
        AvlNode x = y.Left!;
        AvlNode? temp = x.Right;

        // Після повороту temp стає лівим піддеревом y.
        x.Right = y;
        y.Left = temp;

        // Висоти оновлюємо знизу вгору.
        UpdateHeight(y);
        UpdateHeight(x);

        return x;
    }

    /// <summary>
    /// Виконує лівий поворот навколо вузла <paramref name="x"/>.
    /// </summary>
    private AvlNode LeftRotate(AvlNode x)
    {
        AvlNode y = x.Right!;
        AvlNode? temp = y.Left;

        // Симетрична операція до RightRotate.
        y.Left = x;
        x.Right = temp;

        UpdateHeight(x);
        UpdateHeight(y);

        return y;
    }
}
