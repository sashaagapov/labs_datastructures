namespace agapovlab6;

/// <summary>
/// Клас AvlTree: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public partial class AvlTree
{
    /// <summary>
    /// Властивість Root: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public AvlNode? Root { get; private set; }

    /// <summary>
    /// Метод GetHeight: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private int GetHeight(AvlNode? node)
    {
        if (node == null)
        {
            return 0;
        }

        return node.Height;
    }

    /// <summary>
    /// Метод GetBalance: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private int GetBalance(AvlNode? node)
    {
        if (node == null)
        {
            return 0;
        }

        return GetHeight(node.Left) - GetHeight(node.Right);
    }

    /// <summary>
    /// Метод GetNodeBalance: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    public int GetNodeBalance(AvlNode node)
    {
        return GetBalance(node);
    }

    /// <summary>
    /// Метод UpdateHeight: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    private void UpdateHeight(AvlNode node)
    {
        node.Height = 1 + Math.Max(GetHeight(node.Left), GetHeight(node.Right));
    }
}
