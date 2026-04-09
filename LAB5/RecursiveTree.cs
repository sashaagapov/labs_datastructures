namespace agapovlab5
{
    public class RecursiveTree
    {
        private int nodeValue = 0;
        private RecursiveTree left;
        private RecursiveTree right;

        public RecursiveTree(int nodeValue)
        {
            this.nodeValue = nodeValue;
            left = null;
            right = null;
        }
        public int NodeValue
        {
            get { return nodeValue; }
            set { nodeValue = value; }
        }
        public RecursiveTree Left
        {
            get { return left; }
        }
        public RecursiveTree Right
        {
            get { return right; }
        }

        public void SetLeft(RecursiveTree node)
        {
            left = node;
        }
        public void SetRight(RecursiveTree node)
        {
            right = node;
        }

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
