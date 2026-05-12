namespace agapovlab6
{
    /// <summary>
    /// Завдання: процедура TreeDelete для видалення вузла з BST.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Видаляє вузол із заданим значенням з бінарного дерева пошуку.
        /// Після видалення дерево зберігає властивості BST.
        /// </summary>
        /// <param name="root">Корінь дерева</param>
        /// <param name="value">Значення вузла який потрібно видалити</param>
        /// <returns>Корінь дерева після видалення</returns>
        /// <summary>
        /// Метод TreeDelete: виконує окремий крок алгоритму або сервісну дію для поточного модуля.
        /// </summary>
        public static RecursiveTree? TreeDelete(RecursiveTree? root, int value) // Видаляємо вузол з BST за його значенням
        {
            RecursiveTree? z = Search(root, value); // Спочатку знаходимо вузол, який треба видалити

            if (z == null) // Якщо такого вузла немає, дерево не змінюється
            {
                return root;
            }

            if (z.Left == null) // Якщо лівого піддерева немає, на місце z ставимо його праве піддерево
            {
                root = Transplant(root, z, z.Right);
            }
            else if (z.Right == null) // Якщо правого піддерева немає, на місце z ставимо його ліве піддерево
            {
                root = Transplant(root, z, z.Left);
            }
            else // Якщо у вузла є і ліве, і праве піддерево
            {
                RecursiveTree? y = TreeMinimum(z.Right); // Шукаємо successor: мінімальний вузол у правому піддереві

                if (y.Parent != z) // Якщо successor знаходиться не одразу справа від z
                {
                    root = Transplant(root, y, y.Right); // Прибираємо y зі старого місця
                    y.SetRight(z.Right); // Праве піддерево z переносимо до y
                }

                root = Transplant(root, z, y); // Ставимо successor на місце видаленого вузла
                y.SetLeft(z.Left); // Ліве піддерево z теж переносимо до successor
            }

            return root; // Повертаємо корінь, бо він міг змінитись
        }
    }
}
