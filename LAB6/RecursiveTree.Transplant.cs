namespace agapovlab6
{
    /// <summary>
    /// Вузол бінарного дерева, який використовується також для BST-операцій.
    /// </summary>
    public partial class RecursiveTree
    {
        /// <summary>
        /// Замінює піддерево з коренем <paramref name="u"/> піддеревом <paramref name="v"/>.
        /// Використовується в алгоритмі видалення з BST.
        /// </summary>
        public static RecursiveTree? Transplant(RecursiveTree? root, RecursiveTree u, RecursiveTree? v)
        {
            // Якщо замінюємо корінь, новим коренем стає v.
            if (u.Parent == null)
            {
                root = v;
            }
            else if (u == u.Parent.Left)
            {
                u.Parent.SetLeft(v);
            }
            else
            {
                u.Parent.SetRight(v);
            }

            // Встановлюємо коректний батьківський зв'язок для нового піддерева.
            if (v != null)
            {
                v.Parent = u.Parent;
            }

            return root;
        }
    }
}
