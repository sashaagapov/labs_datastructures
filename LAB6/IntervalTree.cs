namespace agapovlab6;

/// <summary>
/// Спрощене дерево інтервалів для демонстрації LEFT-ROTATE та оновлення Max.
/// </summary>
public class IntervalTree
{
    public IntervalNode? Root { get; set; }

    /// <summary>
    /// Повертає Max вузла або мінімальне значення, якщо вузол відсутній.
    /// </summary>
    public int GetMax(IntervalNode? node)
    {
        return node?.Max ?? int.MinValue;
    }

    /// <summary>
    /// Перераховує Max для поточного вузла на основі його дітей.
    /// </summary>
    public void UpdateMax(IntervalNode node)
    {
        node.Max = Math.Max(node.High, Math.Max(GetMax(node.Left), GetMax(node.Right)));
    }

    /// <summary>
    /// Виконує LEFT-ROTATE навколо вузла x.
    /// </summary>
    public void LeftRotate(IntervalNode x)
    {
        IntervalNode? y = x.Right;
        if (y == null)
        {
            return;
        }

        int oldXMax = x.Max;
        IntervalNode? t2 = y.Left;

        x.Right = t2;
        if (t2 != null)
        {
            t2.Parent = x;
        }

        y.Parent = x.Parent;
        if (x.Parent == null)
        {
            Root = y;
        }
        else if (x == x.Parent.Left)
        {
            x.Parent.Left = y;
        }
        else
        {
            x.Parent.Right = y;
        }

        y.Left = x;
        x.Parent = y;

        // Після повороту y стає коренем того самого піддерева,
        // тому він успадковує старий Max вузла x.
        y.Max = oldXMax;

        // У x змінились діти, тому його Max потрібно перерахувати локально.
        x.Max = Math.Max(x.High, Math.Max(GetMax(x.Left), GetMax(x.Right)));
    }

    /// <summary>
    /// Друкує дерево інтервалів у консоль.
    /// </summary>
    public void PrintTree()
    {
        if (Root == null)
        {
            Console.WriteLine("(empty)");
            return;
        }

        PrintNode(Root, "", "");
    }

    private static void PrintNode(IntervalNode node, string indent, string edgeLabel)
    {
        string prefix = string.IsNullOrEmpty(edgeLabel) ? "" : $"{edgeLabel}: ";
        Console.WriteLine($"{indent}{prefix}[{node.Low},{node.High}], max={node.Max}");

        if (node.Left != null) PrintNode(node.Left, indent + "  ", "L");
        if (node.Right != null) PrintNode(node.Right, indent + "  ", "R");
    }
}
