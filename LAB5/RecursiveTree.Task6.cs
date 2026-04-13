namespace agapovlab5
{
    /// <summary>
    /// Завдання 6: Рекурсивна вставка вузла в BST.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Рекурсивна вставка нового вузла в бінарне дерево пошуку (BST).
        /// 1. Якщо вузол null — створюємо новий вузол і повертаємо його.
        /// 2. Якщо value менше за поточний вузол — рекурсивно йдемо вліво.
        /// 3. Якщо value більше за поточний вузол — рекурсивно йдемо вправо.
        /// 4. Повертаємо поточний вузол — зшиваємо дерево назад.
        /// </summary>
        /// <param name="node">Поточний вузол дерева</param>
        /// <param name="value">Значення яке потрібно вставити</param>
        /// <returns>Корінь дерева після вставки</returns>
        public static RecursiveTree TreeInsert(RecursiveTree node, int value)
        {
            if (node == null)
            {
                return new RecursiveTree(value);
            }

            if (value < node.NodeValue)
            {
                node.SetLeft(TreeInsert(node.Left, value));
            }
            else if (value > node.NodeValue)
            {
                node.SetRight(TreeInsert(node.Right, value));
            }

            return node;
        }
    }
}
