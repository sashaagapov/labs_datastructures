using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace SearchAlgorithmsDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            // 1. Підготовка даних
            int size = 100000; 
            int[] array = Enumerable.Range(0, size).ToArray(); // Масив [0, 1, 2, ..., 99999]
            LinkedList<int> linkedList = new LinkedList<int>(array);

            Console.WriteLine($"--- Налаштування: Масив від 0 до {size - 1} ---");
            Console.Write("Введіть ціле число, яке хочете знайти: ");
            
            if (!int.TryParse(Console.ReadLine(), out int target))
            {
                Console.WriteLine("Помилка: потрібно ввести ціле число.");
                return;
            }

            Console.WriteLine($"\nПочинаємо пошук для числа: {target}\n");
            Console.WriteLine(new string('-', 75));
            Console.WriteLine($"{"Назва алгоритму",-35} | {"Індекс",-8} | {"Час (мс)",-10}");
            Console.WriteLine(new string('-', 75));

            // 2. Тестування алгоритмів
            
            // Лінійний пошук
            Measure(target, "Пошук перебором (Масив)", () => LinearSearch(array, target));

            // Пошук з бар'єром
            int[] sentinelArray = new int[size + 1];
            Array.Copy(array, sentinelArray, size);
            Measure(target, "Пошук з бар'єром (Масив)", () => SentinelSearch(sentinelArray, target));

            // Бінарний пошук
            Measure(target, "Бінарний пошук (Масив)", () => BinarySearch(array, target));

            // Золотий переріз
            Measure(target, "Бінарний (Золотий переріз)", () => GoldenSectionSearch(array, target));

            // Пошук у списку
            Measure(target, "Пошук перебором (Linked List)", () => LinkedListSearch(linkedList, target));

            Console.WriteLine(new string('-', 75));
            Console.WriteLine("\nПорада: Спробуйте знайти число 0, число 50000 та 99999, щоб побачити різницю у часі.");
        }

        #region Реалізація алгоритмів

        static int LinearSearch(int[] a, int x)
        {
            for (int i = 0; i < a.Length; i++)
            {
                if (a[i] == x) return i;
            }
            return -1;
        }

        static int SentinelSearch(int[] a, int x)
        {
            int n = a.Length - 1;
            if (n < 0) return -1;
            
            int last = a[n];
            a[n] = x; // Бар'єр

            int i = 0;
            while (a[i] != x) i++;

            a[n] = last; // Відновлення

            if (i < n || last == x) return i;
            return -1;
        }

        static int BinarySearch(int[] a, int x)
        {
            int L = 0, R = a.Length - 1;
            while (L <= R)
            {
                int m = L + (R - L) / 2;
                if (a[m] == x) return m;
                if (a[m] < x) L = m + 1;
                else R = m - 1;
            }
            return -1;
        }

        static int GoldenSectionSearch(int[] a, int x)
        {
            int L = 0, R = a.Length - 1;
            double phi = (1 + Math.Sqrt(5)) / 2;
            double resphi = 2 - phi; // ~0.382

            while (L <= R)
            {
                int m = L + (int)Math.Round((R - L) * resphi);
                if (m < L) m = L;
                if (m > R) m = R;

                if (a[m] == x) return m;
                if (a[m] < x) L = m + 1;
                else R = m - 1;
            }
            return -1;
        }

        static int LinkedListSearch(LinkedList<int> list, int x)
        {
            int index = 0;
            foreach (var item in list)
            {
                if (item == x) return index;
                index++;
            }
            return -1;
        }

        #endregion

        static void Measure(int target, string label, Func<int> action)
        {
            Stopwatch sw = Stopwatch.StartNew();
            int result = action();
            sw.Stop();
            
            string foundStr = result == -1 ? "Немає" : result.ToString();
            Console.WriteLine($"{label,-35} | {foundStr,-8} | {sw.Elapsed.TotalMilliseconds:F4}");
        }
    }
}