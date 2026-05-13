namespace agapovlab6;

/// <summary>
/// Операції видалення вузла з AVL-дерева з автоматичним ребалансуванням.
/// </summary>
public partial class AvlTree
{
    /// <summary>
    /// Видаляє значення з AVL-дерева, якщо воно існує.
    /// </summary>
    public void Delete(int value)
    {
        Root = DeleteNode(Root, value);
    }

    private AvlNode? DeleteNode(AvlNode? node, int value)
    {
        if (node == null)
        {
            return null;
        }

        if (value < node.Value)
        {
            node.Left = DeleteNode(node.Left, value);
        }
        else if (value > node.Value)
        {
            node.Right = DeleteNode(node.Right, value);
        }
        else
        {
            if (node.Left == null && node.Right == null)
            {
                return null;
            }

            if (node.Left == null)
            {
                return node.Right;
            }

            if (node.Right == null)
            {
                return node.Left;
            }

            AvlNode successor = MinNode(node.Right);
            node.Value = successor.Value;
            node.Right = DeleteNode(node.Right, successor.Value);
        }

        // Після фізичного видалення вузла обов'язково оновлюємо висоту
        // та відновлюємо AVL-баланс локальними поворотами.
        UpdateHeight(node);
        int balance = GetBalance(node);

        if (balance > 1 && GetBalance(node.Left) >= 0)
        {
            return RightRotate(node);
        }

        if (balance > 1 && GetBalance(node.Left) < 0)
        {
            node.Left = LeftRotate(node.Left!);
            return RightRotate(node);
        }

        if (balance < -1 && GetBalance(node.Right) <= 0)
        {
            return LeftRotate(node);
        }

        if (balance < -1 && GetBalance(node.Right) > 0)
        {
            node.Right = RightRotate(node.Right!);
            return LeftRotate(node);
        }

        return node;
    }

    private static AvlNode MinNode(AvlNode node)
    {
        AvlNode current = node;
        while (current.Left != null)
        {
            current = current.Left;
        }
        return current;
    }
}
