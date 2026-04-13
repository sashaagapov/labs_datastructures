namespace agapovlab5
{
    /// <summary>
    /// В цьому файлі реалізується логіка для завдання №2
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
        /// Властивості для отримання лівого та правого нащадків вузла.
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
        /// Методи для встановлення лівого та правого 
        /// нащадків вузла. Вони приймають об'єкт типу RecursiveTree 
        /// і присвоюють його відповідному полю (left або right).
        /// </summary>
        /// <param name="node"></param>
        public void SetLeft(RecursiveTree node)
        {
            left = node;
        }
        /// <summary>
        /// Метод для встановлення правого нащадка вузла. 
        /// Він приймає об'єкт типу RecursiveTree і присвоює його полю right.
        /// </summary>
        /// <param name="node"></param>
        public void SetRight(RecursiveTree node)
        {
            right = node;
        }
        /// <summary>
        /// Метод для виконання прямого обходу дерева (PreOrder).
        /// Він приймає вузол як аргумент і виконує наступні кроки:
        /// 1. Виводить значення поточного вузла.
        /// 2. Рекурсивно викликає себе для лівого нащадка.
        /// 3. Рекурсивно викликає себе для правого нащадка.
        /// Якщо поточний вузол є null, метод просто повертається,
        ///  що зупиняє рекурсію для цього шляху.
        /// </summary>
        /// <param name="node"></param>
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
        /// Метод для виконання зворотного обходу дерева (PostOrder).
        /// Він приймає вузол як аргумент і виконує наступні кроки:
        /// 1. Рекурсивно викликає себе для лівого нащадка.
        /// 2. Рекурсивно викликає себе для правого нащадка.
        /// 3. Виводить значення поточного вузла.
        /// Якщо поточний вузол є null, метод просто повертається,
        /// що зупиняє рекурсію для цього шляху.
        /// </summary>
        /// <param name="node"></param>
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
