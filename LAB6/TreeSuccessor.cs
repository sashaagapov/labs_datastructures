namespace agapovlab6
{
    /// <summary>
    /// Завдання: процедура TreeSuccessor для пошуку наступного елемента в BST.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Знаходить successor (наступний елемент) для заданого значення в BST.
        /// Successor — це найменший елемент який більший за задане значення.
        /// </summary>
        /// <param name="node">Поточний вузол дерева</param>
        /// <param name="value">Значення для якого шукаємо successor</param>
        /// <param name="candidate">Кандидат на successor — останній вузол звідки йшли вліво</param>
        /// <returns>Вузол successor або null якщо successor не існує</returns>
        public static RecursiveTree? TreeSuccessor(RecursiveTree? node, int value, RecursiveTree? candidate = null) // Шукаємо наступний більший вузол
        {
            if (node == null) // Дерево закінчилось, тому повертаємо найкращий знайдений кандидат
            {
                return candidate;
            }

            if (value < node.NodeValue) // Поточний вузол більший за value, тобто може бути наступником
            {
                return TreeSuccessor(node.Left, value, node); // Йдемо ліворуч, бо там може бути ще менший підходящий вузол
            }

            if (value > node.NodeValue) // Шукане значення більше за поточний вузол
            {
                return TreeSuccessor(node.Right, value, candidate); // Йдемо праворуч, кандидат поки не змінюється
            }

            if (node.Right != null) // Якщо знайшли вузол і в нього є праве піддерево
            {
                return TreeMinimum(node.Right); // Наступник тоді буде найменшим вузлом справа
            }

            return candidate; // Правого піддерева немає, тому наступник - останній більший предок
        }
    }
}
