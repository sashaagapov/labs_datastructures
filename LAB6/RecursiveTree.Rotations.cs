namespace agapovlab6
{
    /// <summary>
    /// Завдання: лівий та правий повороти вузлів у BST.
    /// Поворот змінює локальну структуру дерева, але зберігає порядок елементів.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Виконує лівий поворот навколо вузла x.
        /// Правий нащадок x піднімається вгору, а x стає його лівим нащадком.
        /// </summary>
        /// <param name="root">Поточний корінь дерева</param>
        /// <param name="x">Вузол навколо якого виконується поворот</param>
        /// <returns>Корінь дерева після повороту</returns>
        public static RecursiveTree? LeftRotate(RecursiveTree? root, RecursiveTree x)
        {
            RecursiveTree? y = x.Right; // y буде новою вершиною цього піддерева

            if (y == null) // Якщо правого нащадка немає, лівий поворот неможливий
            {
                return root;
            }

            x.SetRight(y.Left); // Ліве піддерево y переносимо вправо від x
            y.Parent = x.Parent; // y займає місце x відносно батьківського вузла

            if (x.Parent == null) // Якщо x був коренем, то після повороту коренем стає y
            {
                root = y;
            }
            else if (x == x.Parent.Left) // Якщо x був лівим нащадком, прив'язуємо y зліва
            {
                x.Parent.SetLeft(y);
            }
            else // Інакше x був правим нащадком, прив'язуємо y справа
            {
                x.Parent.SetRight(y);
            }

            y.SetLeft(x); // Завершуємо поворот: x стає лівим нащадком y

            return root; // Корінь міг змінитися, тому повертаємо актуальне значення
        }

        /// <summary>
        /// Виконує правий поворот навколо вузла y.
        /// Лівий нащадок y піднімається вгору, а y стає його правим нащадком.
        /// </summary>
        /// <param name="root">Поточний корінь дерева</param>
        /// <param name="y">Вузол навколо якого виконується поворот</param>
        /// <returns>Корінь дерева після повороту</returns>
        public static RecursiveTree? RightRotate(RecursiveTree? root, RecursiveTree y)
        {
            RecursiveTree? x = y.Left; // x буде новою вершиною цього піддерева

            if (x == null) // Якщо лівого нащадка немає, правий поворот неможливий
            {
                return root;
            }

            y.SetLeft(x.Right); // Праве піддерево x переносимо вліво від y
            x.Parent = y.Parent; // x займає місце y відносно батьківського вузла

            if (y.Parent == null) // Якщо y був коренем, то після повороту коренем стає x
            {
                root = x;
            }
            else if (y == y.Parent.Left) // Якщо y був лівим нащадком, прив'язуємо x зліва
            {
                y.Parent.SetLeft(x);
            }
            else // Інакше y був правим нащадком, прив'язуємо x справа
            {
                y.Parent.SetRight(x);
            }

            x.SetRight(y); // Завершуємо поворот: y стає правим нащадком x

            return root; // Корінь міг змінитися, тому повертаємо актуальне значення
        }
    }
}
