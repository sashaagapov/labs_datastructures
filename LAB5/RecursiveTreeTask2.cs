namespace agapovlab5
{
    public partial class RecursiveTree
    {
        /// <summary>
        /// Завдання 3: Нерекурсивний симетричний обхід (InOrder).
        /// Використовує допоміжний стек (LIFO).
        /// </summary>
        public void IterativeInOrder(RecursiveTree node)
        {
            // Базовий випадок
            if (node == null)
            {
                return;
            }

            // Ініціалізація
            Stack<RecursiveTree> recursiveTrees = new Stack<RecursiveTree>();
            RecursiveTree current = node;

            // Головний цикл працює, поки є вузли для обробки або збережені в стеку
            while (current != null || recursiveTrees.Count > 0)
            {
                // Крок 1: Йдемо максимально вліво (Ліво)
                while (current != null)
                {
                    recursiveTrees.Push(current);
                    current = current.Left;
                }

                // Крок 2: Дістаємо вузол зі стеку і виводимо його значення (Корінь)
                current = recursiveTrees.Pop();
                Console.Write($"{current.NodeValue} ");

                // Крок 3: Переходимо до правого піддерева (Право)
                current = current.Right;
            }
        }
    }
}