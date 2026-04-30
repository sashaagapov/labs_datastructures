namespace agapovlab6
{
    /// <summary>
    /// Завдання: рекурсивний пошук вузла в бінарному дереві пошуку.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Шукає вузол із заданим значенням у BST.
        /// </summary>
        /// <param name="node">Поточний вузол дерева</param>
        /// <param name="value">Значення яке потрібно знайти</param>
        /// <returns>Знайдений вузол або null якщо такого значення немає</returns>
        public static RecursiveTree? Search(RecursiveTree? node, int value) // Шукаємо вузол з потрібним значенням у BST
        {
            if (node == null) // Якщо дійшли до порожнього місця, такого значення в дереві немає
            {
                return null;
            }

            if (value == node.NodeValue) // Поточний вузол має потрібне значення
            {
                return node;
            }

            if (value < node.NodeValue) // Менші значення в BST лежать у лівому піддереві
            {
                return Search(node.Left, value); // Продовжуємо пошук ліворуч
            }

            return Search(node.Right, value); // Якщо значення більше, шукаємо у правому піддереві
        }
    }
}
