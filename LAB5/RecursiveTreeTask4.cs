namespace agapovlab5
{
    public partial class RecursiveTree
    {
        /// <summary>
        /// Завдання 6: Рекурсивна вставка вузла в BST.
        /// 1. Якщо вузол null — створюємо новий вузол і повертаємо його.
        /// 2. Якщо value менше — рекурсивно йдемо вліво.
        /// 3. Якщо value більше — рекурсивно йдемо вправо.
        /// 4. Повертаємо поточний вузол (зшиваємо дерево назад).
        /// </summary>
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