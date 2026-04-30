namespace agapovlab6
{
    /// <summary>
    /// Завдання: процедура Transplant для заміни одного піддерева іншим.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Замінює піддерево з коренем u на піддерево з коренем v.
        /// Використовується під час видалення вузлів з BST.
        /// </summary>
        /// <param name="root">Корінь дерева</param>
        /// <param name="u">Вузол який потрібно замінити</param>
        /// <param name="v">Вузол який стає на місце u</param>
        /// <returns>Корінь дерева після заміни</returns>
        public static RecursiveTree? Transplant(RecursiveTree? root, RecursiveTree u, RecursiveTree? v) // Замінюємо піддерево u на піддерево v
        {
            if (u.Parent == null) // Якщо u не має батька, значить це корінь дерева
            {
                root = v; // Новим коренем стає v
            }
            else if (u == u.Parent.Left) // Якщо u був лівим нащадком свого батька
            {
                u.Parent.SetLeft(v); // То на його місце ставимо v зліва
            }
            else // Інакше u був правим нащадком
            {
                u.Parent.SetRight(v); // Тому ставимо v справа від батька
            }

            if (v != null) // Якщо піддерево v існує, йому треба правильно виставити батька
            {
                v.Parent = u.Parent; // Батько у v тепер такий самий, як був у u
            }

            return root; // Повертаємо корінь, бо він міг змінитися
        }
    }
}
