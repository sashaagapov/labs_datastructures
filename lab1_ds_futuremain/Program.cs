using System;
using System.Diagnostics;

namespace SearchAlgorithms
{
   
    class Program
    {
        static void Main(string[] args)
        {
            int n = 100000;
            int[] numbers = new int[n];
            for (int i = 0; i < n; i++)
            {
                numbers[i] = i;
            }

            Console.Write("Введіть шукане число: ");
            if (!int.TryParse(Console.ReadLine(), out int target))
            {
                Console.WriteLine("Помилка: введіть число");
                return;
            }
            Console.WriteLine($"Шукаємо число {target}...");

            // Створюємо та запускаємо таймер
            Stopwatch sw = new Stopwatch();
            sw.Start();

            // Викликаємо наш пошук
            int index = LinearSearch(numbers, target);

            // Зупиняємо таймер
            sw.Stop();

            if (index != -1)
            {
                Console.WriteLine($"The index of searching number is: {index}");
            }
            else
            {
                Console.WriteLine("The target wasn't found");
            }

            // Виводимо час
            Console.WriteLine($"Час виконання лінійного пошуку: {sw.Elapsed.TotalMilliseconds} мс");
        }
       
        static int LinearSearch(int[] a, int x)
        {
            for(int i = 0;i < a.Length;i++)
            {
                if (a[i] == x)
                {
                   return i;
                }
            }
            return -1;
        }

    }

}