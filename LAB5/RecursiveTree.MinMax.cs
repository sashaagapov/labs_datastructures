namespace agapovlab5
{
    /// <summary>
    /// Завдання 4: Рекурсивні процедури TreeMinimum та TreeMaximum.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Рекурсивний пошук мінімального вузла в BST.
        /// Мінімальний вузол завжди знаходиться в крайньому лівому вузлі дерева.
        /// Базовий випадок: якщо лівий нащадок null — поточний вузол і є мінімумом.
        /// </summary>
        /// <param name="node">Поточний вузол дерева</param>
        /// <returns>Вузол з мінімальним значенням</returns>
        public static RecursiveTree TreeMinimum(RecursiveTree node)
        {
            if (node.Left == null)
            {
                return node;
            }

            return TreeMinimum(node.Left);
        }

        /// <summary>
        /// Рекурсивний пошук максимального вузла в BST.
        /// Максимальний вузол завжди знаходиться в крайньому правому вузлі дерева.
        /// Базовий випадок: якщо правий нащадок null — поточний вузол і є максимумом.
        /// </summary>
        /// <param name="node">Поточний вузол дерева</param>
        /// <returns>Вузол з максимальним значенням</returns>
        public static RecursiveTree TreeMaximum(RecursiveTree node)
        {
            if (node.Right == null)
            {
                return node;
            }

            return TreeMaximum(node.Right);
        }
    }
}
