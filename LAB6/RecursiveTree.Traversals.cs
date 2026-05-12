namespace agapovlab6
{
    /// <summary>
    /// Завдання 2: Рекурсивні обходи дерева — PreOrder та PostOrder.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Рекурсивний прямий обхід дерева (PreOrder).
        /// Порядок обходу: Корінь - Ліво - Право.
        /// Якщо поточний вузол є null — рекурсія зупиняється.
        /// </summary>
        /// <param name="node">Поточний вузол дерева</param>
        /// <summary>
        /// Метод PreOrder: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
        /// </summary>
        public void PreOrder(RecursiveTree node)
        {
            if (node == null)
            {
                return;
            }

            Console.Write($"{node.nodeValue} ");
            PreOrder(node.left);
            PreOrder(node.right);
        }

        /// <summary>
        /// Рекурсивний зворотний обхід дерева (PostOrder).
        /// Порядок обходу: Ліво - Право - Корінь.
        /// Якщо поточний вузол є null — рекурсія зупиняється.
        /// </summary>
        /// <param name="node">Поточний вузол дерева</param>
        /// <summary>
        /// Метод PostOrder: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
        /// </summary>
        public void PostOrder(RecursiveTree node)
        {
            if (node == null)
            {
                return;
            }

            PostOrder(node.left);
            PostOrder(node.right);
            Console.Write($"{node.nodeValue} ");
        }
    }
}
