class Program
{
    static void Main(string[] args)
    {
        int[] data = {4, -1, 7, 3, -2};

        Matrix matrixTask1 = new Matrix(2,3);
        NumberArray array = new NumberArray(data);
        int result = array.MaxAdjacentSum();
        Console.WriteLine(result);
    }
}
    class Matrix
{

    private int rows;
    private int columns;
    public Matrix(int rows,int columns)
    {
        if (rows <= 0 || columns <= 0)
        {
            throw new ArgumentException("Розмір матриці не може бути менше чи дорівнювати 0");
        }
        this.rows = rows;
        this.columns = columns;

    }

}
public class NumberArray
{
    private int[] numbers;


public NumberArray(int[] numbers)
    {
        if (numbers == null)
        {
            throw new ArgumentNullException(nameof(numbers));
        }

        this.numbers = numbers;
    }
        public int MaxAdjacentSum()
    {
        if(numbers.Length < 2)
        {
            throw new ArgumentException("Для розрахунку найбільшої пари треба щоб було більше ніж 2 числа");
        }
        int maxDuo = 0;
        int current = 0;
        for(int i = 0; i < numbers.Length - 1; i++)
        {
            current = numbers[i] + numbers[i + 1];
            if(current > maxDuo)
            {
                maxDuo = current;
            }
        }
        return maxDuo;
    }






}
