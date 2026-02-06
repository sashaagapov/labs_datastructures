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
            // Налаштування даних
            int size = 100000; // Розмір масиву
            int target = 99999; // Шуканий елемент (в кінці для найгіршого випадку)
            int[] array = Enumerable.Range(0, size).ToArray();
            LinkedList<int> linkedList = new LinkedList<int>(array);

            Console.WriteLine($"--- Тестування пошуку (Розмір: {size}, Ціль: {target}) --- \n");

            // 1. Пошук перебором (Масив)
            MeasurePerformance("Пошук перебором (Масив)", () => LinearSearch(array, target));

            // 2. Пошук з бар'єром (Масив)
            // Для бар'єру створимо масив розміром N+1
            int[] sentinelArray = new int[size + 1];
            Array.Copy(array, sentinelArray, size);
            MeasurePerformance("Пошук з бар'єром (Масив)", () => SentinelSearch(sentinelArray, target));

            // 3. Бінарний пошук (Масив)
            MeasurePerformance("Бінарний пошук (Масив)", () => BinarySearch(array, target));

            // 4. Бінарний пошук (Золотий переріз, Масив)
            MeasurePerformance("Бінарний пошук (Золотий переріз)", () => GoldenSectionSearch(array, target));

            // 5. Пошук перебором (Зв'язаний список)
            MeasurePerformance("Пошук перебором (Linked List)", () => LinkedListSearch(linkedList, target));

            Console.WriteLine("\n--- Аналіз завершено ---");
        }

        #region Algorithms

        // 1. Послідовний пошук перебором
        static int LinearSearch(int[] a, int x)
        {
            for (int i = 0; i < a.Length; i++)
            {
                if (a[i] == x) return i;
            }
            return -1;
        }

        // 2. Пошук з бар'єром
        static int SentinelSearch(int[] a, int x)
        {
            int n = a.Length - 1;
            int last = a[n];
            a[n] = x; // Ставимо бар'єр

            int i = 0;
            while (a[i] != x) i++;

            a[n] = last; // Відновлюємо масив

            if (i < n || last == x) return i;
            return -1;
        }

        // 3. Класичний бінарний пошук
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

        // 4. Пошук за правилом золотого перерізу
        static int GoldenSectionSearch(int[] a, int x)
        {
            int L = 0, R = a.Length - 1;
            const double PhiInv = 0.61803398875; // 1/phi

            while (L <= R)
            {
                // Визначаємо m за пропорцією золотого перерізу
                int m = L + (int)Math.Round((R - L) * (1 - PhiInv));
                
                if (a[m] == x) return m;
                if (a[m] < x) L = m + 1;
                else R = m - 1;
            }
            return -1;
        }

        // 5. Пошук у лінійному зв'язаному списку
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

        #region Utils
        static void MeasurePerformance(string label, Func<int> action)
        {
            Stopwatch sw = Stopwatch.StartNew();
            int result = action();
            sw.Stop();
            Console.WriteLine($"{label,-35} | Результат: {result,6} | Час: {sw.Elapsed.TotalMilliseconds:F4} мс");
        }
        #endregion
    }
}