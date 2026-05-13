namespace agapovlab6;

/// <summary>
/// Операції вставки в червоно-чорне дерево.
/// </summary>
public partial class RedBlackTree
{
    /// <summary>
    /// Вставляє значення у дерево. Дублікати ігноруються.
    /// </summary>
    public void Insert(int value)
    {
        // Новий вузол вставляється червоним, щоб не збільшувати black-height шляхів.
        RedBlackNode newNode = new RedBlackNode(value);

        RedBlackNode? parent = null;
        RedBlackNode? current = Root;

        while (current != null)
        {
            parent = current;

            if (value < current.Value)
            {
                current = current.Left;
            }
            else if (value > current.Value)
            {
                current = current.Right;
            }
            else
            {
                return;
            }
        }

        newNode.Parent = parent;

        if (parent == null)
        {
            Root = newNode;
        }
        else if (value < parent.Value)
        {
            parent.Left = newNode;
        }
        else
        {
            parent.Right = newNode;
        }

        InsertFixup(newNode);
    }

    /// <summary>
    /// Відновлює властивості RB-дерева після вставки.
    /// </summary>
    private void InsertFixup(RedBlackNode node)
    {
        while (IsRed(node.Parent))
        {
            RedBlackNode grandparent = node.Parent!.Parent!;

            if (node.Parent == grandparent.Left)
            {
                RedBlackNode? uncle = grandparent.Right;

                // Якщо дядько червоний, робимо лише перефарбування і піднімаємось вище.
                if (IsRed(uncle))
                {
                    SetColor(node.Parent, NodeColor.Black);
                    SetColor(uncle, NodeColor.Black);
                    SetColor(grandparent, NodeColor.Red);
                    node = grandparent;
                }
                else
                {
                    // Випадок "кут" перетворюємо в "лінію", потім робимо поворот.
                    if (node == node.Parent!.Right)
                    {
                        node = node.Parent;
                        LeftRotate(node);
                    }

                    SetColor(node.Parent, NodeColor.Black);
                    SetColor(grandparent, NodeColor.Red);
                    RightRotate(grandparent);
                }
            }
            else
            {
                RedBlackNode? uncle = grandparent.Left;

                if (IsRed(uncle))
                {
                    SetColor(node.Parent, NodeColor.Black);
                    SetColor(uncle, NodeColor.Black);
                    SetColor(grandparent, NodeColor.Red);
                    node = grandparent;
                }
                else
                {
                    if (node == node.Parent!.Left)
                    {
                        node = node.Parent;
                        RightRotate(node);
                    }

                    SetColor(node.Parent, NodeColor.Black);
                    SetColor(grandparent, NodeColor.Red);
                    LeftRotate(grandparent);
                }
            }
        }

        SetColor(Root, NodeColor.Black);
    }
}
