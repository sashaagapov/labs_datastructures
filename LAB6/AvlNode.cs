namespace agapovlab6;

public class AvlNode
{
    public int Value { get; set; }

    public AvlNode? Left { get; set; }

    public AvlNode? Right { get; set; }

    public int Height { get; set; }

    public AvlNode(int value)
    {
        Value = value;
        Height = 1;
    }
}
