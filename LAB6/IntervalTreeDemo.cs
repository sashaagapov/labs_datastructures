namespace agapovlab6;

/// <summary>
/// Консольний демо-сценарій LEFT-ROTATE для дерева інтервалів.
/// </summary>
public static class IntervalTreeDemo
{
    /// <summary>
    /// Запускає демонстрацію повороту та друк стану дерева до/після.
    /// </summary>
    public static void Run()
    {
        Console.WriteLine("Це дерево інтервалів. Кожен вузол має interval [low, high] і Max — найбільший High у його піддереві.");

        var (tree, x) = BuildSampleTree();

        Console.WriteLine();
        Console.WriteLine("Before LEFT-ROTATE:");
        tree.PrintTree();

        tree.LeftRotate(x);

        Console.WriteLine();
        Console.WriteLine("After LEFT-ROTATE:");
        tree.PrintTree();

        bool ok = ValidateSampleAfterRotate(tree);
        Console.WriteLine();
        Console.WriteLine(ok
            ? "Поворот змінив тільки вузли x і y, тому Max оновлюється за O(1)."
            : "Демо перевірка не пройдена: структура або Max некоректні.");
    }

    /// <summary>
    /// Будує приклад дерева:
    /// x=[10,20], y=[15,30], T2=[12,18].
    /// </summary>
    public static (IntervalTree tree, IntervalNode x) BuildSampleTree()
    {
        var x = new IntervalNode(10, 20);
        var y = new IntervalNode(15, 30);
        var t2 = new IntervalNode(12, 18);

        x.Right = y;
        y.Parent = x;
        y.Left = t2;
        t2.Parent = y;

        var tree = new IntervalTree { Root = x };

        tree.UpdateMax(t2);
        tree.UpdateMax(y);
        tree.UpdateMax(x);

        return (tree, x);
    }

    /// <summary>
    /// Перевіряє очікувану структуру дерева після LEFT-ROTATE у демо-прикладі.
    /// </summary>
    public static bool ValidateSampleAfterRotate(IntervalTree tree)
    {
        IntervalNode? root = tree.Root;
        if (root == null || root.Low != 15 || root.High != 30 || root.Max != 30) return false;

        IntervalNode? left = root.Left;
        if (left == null || left.Low != 10 || left.High != 20 || left.Max != 20) return false;

        IntervalNode? rightOfLeft = left.Right;
        if (rightOfLeft == null || rightOfLeft.Low != 12 || rightOfLeft.High != 18 || rightOfLeft.Max != 18) return false;

        if (root.Parent != null) return false;
        if (left.Parent != root) return false;
        if (rightOfLeft.Parent != left) return false;
        if (root.Right != null) return false;
        if (left.Left != null) return false;

        return true;
    }
}
