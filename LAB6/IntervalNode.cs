namespace agapovlab6;

/// <summary>
/// Вузол дерева інтервалів.
/// </summary>
public class IntervalNode
{
    /// <summary>
    /// Ліва межа інтервалу.
    /// </summary>
    public int Low { get; set; }

    /// <summary>
    /// Права межа інтервалу.
    /// </summary>
    public int High { get; set; }

    /// <summary>
    /// Максимальне значення High у всьому піддереві поточного вузла.
    /// </summary>
    public int Max { get; set; }

    public IntervalNode? Left { get; set; }
    public IntervalNode? Right { get; set; }
    public IntervalNode? Parent { get; set; }

    /// <summary>
    /// Створює вузол [low, high] та ініціалізує Max = high.
    /// </summary>
    public IntervalNode(int low, int high)
    {
        Low = low;
        High = high;
        Max = high;
    }
}
