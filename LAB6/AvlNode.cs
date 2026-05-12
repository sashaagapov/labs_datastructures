namespace agapovlab6;

/// <summary>
/// Клас AvlNode: містить частину логіки лабораторної роботи з деревами.
/// </summary>
public class AvlNode
{
    /// <summary>
    /// Властивість Value: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public int Value { get; set; }

    /// <summary>
    /// Властивість Left: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public AvlNode? Left { get; set; }

    /// <summary>
    /// Властивість Right: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public AvlNode? Right { get; set; }

    /// <summary>
    /// Властивість Height: зберігає стан або посилання, потрібне для роботи структури.
    /// </summary>
    public int Height { get; set; }

    public AvlNode(int value)
    {
        Value = value;
        Height = 1;
    }
}
