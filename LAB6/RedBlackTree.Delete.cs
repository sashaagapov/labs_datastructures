namespace agapovlab6;

/// <summary>
/// Операції видалення з червоно-чорного дерева.
/// </summary>
public partial class RedBlackTree
{
    private RedBlackNode? Search(int value)
    {
        RedBlackNode? current = Root;

        while (current != null)
        {
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
                return current;
            }
        }

        return null;
    }

    private static RedBlackNode Minimum(RedBlackNode node)
    {
        RedBlackNode current = node;

        while (current.Left != null)
        {
            current = current.Left;
        }

        return current;
    }

    private void Transplant(RedBlackNode u, RedBlackNode? v)
    {
        if (u.Parent == null)
        {
            Root = v;
        }
        else if (u == u.Parent.Left)
        {
            u.Parent.Left = v;
        }
        else
        {
            u.Parent.Right = v;
        }

        if (v != null)
        {
            v.Parent = u.Parent;
        }
    }

    /// <summary>
    /// Видаляє вузол за значенням. Повертає false, якщо значення не знайдено.
    /// </summary>
    public bool Delete(int value)
    {
        RedBlackNode? z = Search(value);

        if (z == null)
        {
            return false;
        }

        RedBlackNode y = z;
        NodeColor yOriginalColor = y.Color;
        RedBlackNode? x;
        RedBlackNode? xParent;

        if (z.Left == null)
        {
            x = z.Right;
            xParent = z.Parent;
            Transplant(z, z.Right);
        }
        else if (z.Right == null)
        {
            x = z.Left;
            xParent = z.Parent;
            Transplant(z, z.Left);
        }
        else
        {
            y = Minimum(z.Right);
            yOriginalColor = y.Color;
            x = y.Right;

            if (y.Parent == z)
            {
                xParent = y;
            }
            else
            {
                xParent = y.Parent;
                Transplant(y, y.Right);
                y.Right = z.Right;
                if (y.Right != null)
                {
                    y.Right.Parent = y;
                }
            }

            Transplant(z, y);
            y.Left = z.Left;
            if (y.Left != null)
            {
                y.Left.Parent = y;
            }

            y.Color = z.Color;
        }

        if (yOriginalColor == NodeColor.Black)
        {
            DeleteFixup(x, xParent);
        }

        SetColor(Root, NodeColor.Black);
        return true;
    }

    /// <summary>
    /// Відновлює RB-властивості після видалення чорного вузла.
    /// </summary>
    private void DeleteFixup(RedBlackNode? node, RedBlackNode? parent)
    {
        while (node != Root && IsBlack(node))
        {
            if (parent == null)
            {
                break;
            }

            if (node == parent.Left)
            {
                RedBlackNode? sibling = parent.Right;

                if (IsRed(sibling))
                {
                    SetColor(sibling, NodeColor.Black);
                    SetColor(parent, NodeColor.Red);
                    LeftRotate(parent);
                    sibling = parent.Right;
                }

                // Якщо sibling чорний і обидві дитини чорні, "дефіцит чорного"
                // піднімається до батька.
                if (IsBlack(sibling?.Left) && IsBlack(sibling?.Right))
                {
                    SetColor(sibling, NodeColor.Red);
                    node = parent;
                    parent = node.Parent;
                }
                else
                {
                    if (IsBlack(sibling?.Right))
                    {
                        SetColor(sibling?.Left, NodeColor.Black);
                        SetColor(sibling, NodeColor.Red);
                        if (sibling != null)
                        {
                            RightRotate(sibling);
                        }

                        sibling = parent.Right;
                    }

                    SetColor(sibling, GetColor(parent));
                    SetColor(parent, NodeColor.Black);
                    SetColor(sibling?.Right, NodeColor.Black);
                    LeftRotate(parent);
                    node = Root;
                    parent = null;
                }
            }
            else
            {
                RedBlackNode? sibling = parent.Left;

                if (IsRed(sibling))
                {
                    SetColor(sibling, NodeColor.Black);
                    SetColor(parent, NodeColor.Red);
                    RightRotate(parent);
                    sibling = parent.Left;
                }

                if (IsBlack(sibling?.Left) && IsBlack(sibling?.Right))
                {
                    SetColor(sibling, NodeColor.Red);
                    node = parent;
                    parent = node.Parent;
                }
                else
                {
                    if (IsBlack(sibling?.Left))
                    {
                        SetColor(sibling?.Right, NodeColor.Black);
                        SetColor(sibling, NodeColor.Red);
                        if (sibling != null)
                        {
                            LeftRotate(sibling);
                        }

                        sibling = parent.Left;
                    }

                    SetColor(sibling, GetColor(parent));
                    SetColor(parent, NodeColor.Black);
                    SetColor(sibling?.Left, NodeColor.Black);
                    RightRotate(parent);
                    node = Root;
                    parent = null;
                }
            }
        }

        SetColor(node, NodeColor.Black);
    }
}
