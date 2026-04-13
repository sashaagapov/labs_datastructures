namespace agapovlab5
{
    /// <summary>
    /// Завдання 3: Нерекурсивний симетричний обхід дерева (InOrder).
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Нерекурсивний симетричний обхід дерева (InOrder).
        /// Використовує допоміжний стек (LIFO) замість рекурсії.
        /// Порядок обходу: Ліво - Корінь - Право.
        /// </summary>
        /// <param name="node">Корінь дерева з якого починається обхід</param>
        public void IterativeInOrder(RecursiveTree node)
        {
            if (node == null)// Якщо дерево порожнє, просто повертаємося
            {
                return;
            }

            Stack<RecursiveTree> stack = new Stack<RecursiveTree>();
            RecursiveTree current = node;// Починаємо з кореня дерева

            while (current != null || stack.Count > 0)
            {
                // Крок 1: Йдемо максимально вліво і зберігаємо вузли в стек
                while (current != null)
                {
                    stack.Push(current);
                    current = current.Left;
                }

                // Крок 2: Дістаємо вузол зі стеку і виводимо його значення
                current = stack.Pop();
                Console.Write($"{current.NodeValue} ");

                // Крок 3: Переходимо до правого піддерева
                current = current.Right;
            }
        }
    }
}
