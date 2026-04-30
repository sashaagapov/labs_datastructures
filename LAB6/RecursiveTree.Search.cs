namespace agapovlab6
{
    public partial class RecursiveTree
    {
        public static RecursiveTree? Search(RecursiveTree? node, int value)
        {
            if (node == null)
            {
                return null;
            }

            if (value == node.NodeValue)
            {
                return node;
            }

            if (value < node.NodeValue)
            {
                return Search(node.Left, value);
            }

            return Search(node.Right, value);
        }
    }
}
