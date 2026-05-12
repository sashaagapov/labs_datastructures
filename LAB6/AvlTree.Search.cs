namespace agapovlab6;

/// <summary>
/// Клас AvlTree: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public partial class AvlTree
{
    /// <summary>
    /// Метод Search: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
    public AvlNode? Search(int value)
    {
        return SearchNode(Root, value);
    }

    /// <summary>
    /// Метод SearchNode: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
    /// </summary>
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
