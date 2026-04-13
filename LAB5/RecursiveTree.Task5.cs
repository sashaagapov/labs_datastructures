namespace agapovlab5
{
    /// <summary>
    /// Завдання 5: Процедура TreePredecessor.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Знаходить predecessor (попередній елемент) вузла з заданим значенням в BST.
        /// Predecessor — це найбільший елемент який менший за задане значення.
        /// </summary>
        /// <param name="node">Поточний вузол дерева</param>
        /// <param name="value">Значення для якого шукаємо predecessor</param>
        /// <param name="candidate">Кандидат на predecessor — останній вузол звідки йшли вправо</param>
        /// <returns>Вузол predecessor або null якщо predecessor не існує</returns>
        public static RecursiveTree TreePredecessor(RecursiveTree node, int value, RecursiveTree candidate = null)
        {
            // Якщо дійшли до null — повертаємо кандидата
            if (node == null)
            {
                return candidate;
            }

            // Знайшли вузол з потрібним значенням
            if (value == node.NodeValue)
            {
                // Є ліве піддерево — predecessor це максимум лівого піддерева
                if (node.Left != null)
                {
                    return TreeMaximum(node.Left);
                }

                // Немає лівого піддерева — повертаємо кандидата
                return candidate;
            }

            // Значення більше — йдемо вправо і запамятовуємо поточний вузол як кандидата
            if (value > node.NodeValue)
            {
                return TreePredecessor(node.Right, value, node);
            }

            // Значення менше — йдемо вліво, кандидат не змінюється
            return TreePredecessor(node.Left, value, candidate);
        }
    }
}
