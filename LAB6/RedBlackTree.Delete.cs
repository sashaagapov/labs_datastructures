namespace agapovlab6;

/// <summary>
/// Клас RedBlackTree: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public partial class RedBlackTree
{
    /// <summary>
    /// Шукає вузол із заданим значенням у червоно-чорному дереві.
    /// </summary>
    /// <param name="value">Значення вузла для пошуку.</param>
    /// <returns>Знайдений вузол або null, якщо значення відсутнє.</returns>
    private RedBlackNode? Search(int value)
    {
        RedBlackNode? current = Root;

        // Стандартний ітеративний пошук у BST за властивістю впорядкованості.
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

    /// <summary>
    /// Знаходить вузол із мінімальним значенням у піддереві.
    /// </summary>
    /// <param name="node">Корінь піддерева для пошуку мінімуму.</param>
    /// <returns>Найлівіший вузол піддерева.</returns>
    private static RedBlackNode Minimum(RedBlackNode node)
    {
        RedBlackNode current = node;

        // Мінімум у BST завжди знаходиться в крайньому лівому вузлі.
        while (current.Left != null)
        {
            current = current.Left;
        }

        return current;
    }

    /// <summary>
    /// Замінює піддерево з коренем u на піддерево з коренем v.
    /// </summary>
    /// <param name="u">Вузол, який замінюємо.</param>
    /// <param name="v">Вузол, який стає на місце u.</param>
    private void Transplant(RedBlackNode u, RedBlackNode? v)
    {
        // Переприв'язуємо посилання від батька u на новий вузол v.
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
    /// Видаляє вузол із заданим значенням з червоно-чорного дерева.
    /// </summary>
    /// <param name="value">Значення вузла, який потрібно видалити.</param>
    /// <returns>true, якщо вузол був знайдений і видалений; інакше false.</returns>
    public bool Delete(int value)
    {
        RedBlackNode? z = Search(value);

        // Немає такого значення в дереві.
        if (z == null)
        {
            return false;
        }

        // y — вузол, який фізично видаляється з дерева.
        RedBlackNode y = z;
        NodeColor yOriginalColor = y.Color;
        RedBlackNode? x;
        RedBlackNode? xParent;

        // Випадок 1: у z немає лівого нащадка.
        if (z.Left == null)
        {
            x = z.Right;
            xParent = z.Parent;
            Transplant(z, z.Right);
        }
        // Випадок 2: у z немає правого нащадка.
        else if (z.Right == null)
        {
            x = z.Left;
            xParent = z.Parent;
            Transplant(z, z.Left);
        }
        // Випадок 3: у z є обидва нащадки.
        else
        {
            // Беремо наступника z (мінімум у правому піддереві).
            y = Minimum(z.Right);
            yOriginalColor = y.Color;
            x = y.Right;

            // Якщо y безпосередньо під z, то батьком x після видалення буде y.
            if (y.Parent == z)
            {
                xParent = y;
            }
            else
            {
                // Вирізаємо y з поточного місця і піднімаємо його на місце z.
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

        // Якщо видалили чорний вузол, потрібно відновити властивості RB-дерева.
        if (yOriginalColor == NodeColor.Black)
        {
            DeleteFixup(x, xParent);
        }

        // Корінь червоно-чорного дерева завжди має бути чорним.
        SetColor(Root, NodeColor.Black);
        return true;
    }

    /// <summary>
    /// Відновлює інваріанти червоно-чорного дерева після видалення.
    /// </summary>
    /// <param name="node">Поточний вузол, з якого починається балансування.</param>
    /// <param name="parent">Батько поточного вузла.</param>
    private void DeleteFixup(RedBlackNode? node, RedBlackNode? parent)
    {
        // Піднімаємо "подвійну чорність" вгору, доки не відновимо баланс.
        while (node != Root && IsBlack(node))
        {
            if (parent == null)
            {
                break;
            }

            // Вузол node є лівим сином: розглядаємо правого брата.
            if (node == parent.Left)
            {
                RedBlackNode? sibling = parent.Right;

                // Case 1: брат червоний — перетворюємо до випадків з чорним братом.
                if (IsRed(sibling))
                {
                    SetColor(sibling, NodeColor.Black);
                    SetColor(parent, NodeColor.Red);
                    LeftRotate(parent);
                    sibling = parent.Right;
                }

                // Case 2: брат чорний і обидва його діти чорні.
                if (IsBlack(sibling?.Left) && IsBlack(sibling?.Right))
                {
                    SetColor(sibling, NodeColor.Red);
                    node = parent;
                    parent = node.Parent;
                }
                else
                {
                    // Case 3: брат чорний, дальній племінник чорний, ближній червоний.
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

                    // Case 4: брат чорний і дальній племінник червоний.
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
                // Дзеркальні випадки: node є правим сином.
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

        // Фінально робимо поточний вузол чорним.
        SetColor(node, NodeColor.Black);
    }
}
