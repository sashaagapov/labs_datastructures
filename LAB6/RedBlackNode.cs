namespace agapovlab6;

/// <summary>
/// Клас RedBlackNode: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public class RedBlackNode
{
    /// <summary>
    /// Властивість Value: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public int Value { get; set; }

    /// <summary>
    /// Властивість Color: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public NodeColor Color { get; set; }

    /// <summary>
    /// Властивість Left: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public RedBlackNode? Left { get; set; }

    /// <summary>
    /// Властивість Right: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public RedBlackNode? Right { get; set; }

    /// <summary>
    /// Властивість Parent: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public RedBlackNode? Parent { get; set; }

    public RedBlackNode(int value)
    {
        Value = value;
        Color = NodeColor.Red;
    }
}
