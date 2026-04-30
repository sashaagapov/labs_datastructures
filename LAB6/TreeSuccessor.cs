namespace agapovlab6
{
    public partial class RecursiveTree
    {
        public static RecursiveTree? TreeSuccessor(RecursiveTree? node, int value, RecursiveTree? candidate = null)
        {
            if (node == null)
            {
                return candidate;
            }

            if (value < node.NodeValue)
            {
                return TreeSuccessor(node.Left, value, node);
            }

            if (value > node.NodeValue)
            {
                return TreeSuccessor(node.Right, value, candidate);
            }

            if (node.Right != null)
            {
                return TreeMinimum(node.Right);
            }

            return candidate;
        }
    }
}
