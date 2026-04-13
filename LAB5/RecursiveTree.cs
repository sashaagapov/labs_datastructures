namespace agapovlab5
{
    /// <summary>
    /// Базовий клас бінарного дерева.
    /// Містить поля, конструктор, властивості та методи встановлення нащадків.
    /// </summary>
    public partial class RecursiveTree
    {
        private int nodeValue = 0;
        private RecursiveTree left;
        private RecursiveTree right;

        /// <summary>
        /// Конструктор для створення вузла дерева з заданим значенням.
        /// Лівий та правий нащадки ініціалізуються як null.
        /// </summary>
        /// <param name="nodeValue">Значення вузла</param>
        public RecursiveTree(int nodeValue)
        {
            this.nodeValue = nodeValue;
            left = null;
            right = null;
        }

        /// <summary>
        /// Властивість для отримання та встановлення значення вузла.
        /// </summary>
        public int NodeValue
        {
            get { return nodeValue; }
            set { nodeValue = value; }
        }

        /// <summary>
        /// Властивість для отримання лівого нащадка вузла.
        /// </summary>
        public RecursiveTree Left
        {
            get { return left; }
        }

        /// <summary>
        /// Властивість для отримання правого нащадка вузла.
        /// </summary>
        public RecursiveTree Right
        {
            get { return right; }
        }

        /// <summary>
        /// Метод для встановлення лівого нащадка вузла.
        /// </summary>
        /// <param name="node">Вузол який стане лівим нащадком</param>
        public void SetLeft(RecursiveTree node)
        {
            left = node;
        }

        /// <summary>
        /// Метод для встановлення правого нащадка вузла.
        /// </summary>
        /// <param name="node">Вузол який стане правим нащадком</param>
        public void SetRight(RecursiveTree node)
        {
            right = node;
        }
    }
}
