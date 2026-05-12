namespace agapovlab6;

/// <summary>
/// Клас RedBlackTree: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public partial class RedBlackTree
{
    /// <summary>
    /// Властивість Root: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public RedBlackNode? Root { get; private set; }

    /// <summary>
    /// Метод GetColor: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static NodeColor GetColor(RedBlackNode? node)
    {
        if (node == null)
        {
            return NodeColor.Black;
        }

        return node.Color;
    }

    /// <summary>
    /// Метод SetColor: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static void SetColor(RedBlackNode? node, NodeColor color)
    {
        if (node != null)
        {
            node.Color = color;
        }
    }

    /// <summary>
    /// Метод IsRed: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static bool IsRed(RedBlackNode? node)
    {
        return GetColor(node) == NodeColor.Red;
    }

    /// <summary>
    /// Метод IsBlack: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private static bool IsBlack(RedBlackNode? node)
    {
        return GetColor(node) == NodeColor.Black;
    }
}
