//sasha agapov IPZ - 11 lab1_version1
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace Lab1_SearchAlgorithms
{
    class Program
    {
        static void Main(string[] args)
        {
            // Генеруємо масив на 100 000 елементів
            int size = 100000;
            int[] array = new int[size];
            Random rnd = new Random();

            for (int i = 0; i < size; i++)
            {
                array[i] = i * 2; // Робимо впорядкованим для бінарного пошуку
            }

            // Та сама структура, але у вигляді списку
            LinkedList<int> linkedList = new LinkedList<int>(array);

            Console.WriteLine("Введіть число для пошуку:");
            int target = int.Parse(Console.ReadLine());

            Console.WriteLine("\n--- Результати тестування ---");

            // 1. Пошук перебором (Масив)
            RunTest("Лінійний пошук (Масив)", () => LinearSearch(array, target));

            // 2. Пошук з бар'єром (Масив)
            // Потрібна копія з +1 місцем для бар'єра
            int[] arrayWithBarrier = new int[size + 1];
            Array.Copy(array, arrayWithBarrier, size);
            RunTest("Пошук з бар'єром (Масив)", () => BarrierSearch(arrayWithBarrier, target));

            // 3. Бінарний пошук
            RunTest("Бінарний пошук (Масив)", () => BinarySearch(array, target));

            // 4. Золотий перетин
            RunTest("Пошук золотого перетину (Масив)", () => GoldenSectionSearch(array, target));

            // 5. Пошук у зв'язному списку (для порівняння)
            RunTest("Лінійний пошук (Linked List)", () => ListSearch(linkedList, target));

            Console.WriteLine("\nРоботу завершено. Натисніть будь-яку клавішу...");
            Console.ReadKey();
        }

        // Метод для заміру часу
        static void RunTest(string name, Func<int> searchMethod)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            int result = searchMethod();
            sw.Stop();

            string status = result != -1 ? $"Знайдено на індексі {result}" : "Не знайдено";
            Console.WriteLine($"{name,-30} | Час: {sw.ElapsedTicks} тіків | {status}");
        }

        // Простий перебір
        static int LinearSearch(int[] arr, int x)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i] == x) return i;
            }
            return -1;
        }

        // Пошук з бар'єром
        static int BarrierSearch(int[] arr, int x)
        {
            int n = arr.Length - 1;
            if (arr[n - 1] == x) return n - 1;

            arr[n] = x; // Ставимо бар'єр
            int i = 0;
            while (arr[i] != x)
            {
                i++;
            }

            if (i < n) return i;
            return -1;
        }

        // Класичний бінарний пошук
        static int BinarySearch(int[] arr, int x)
        {
            int left = 0;
            int right = arr.Length - 1;

            while (left <= right)
            {
                int mid = left + (right - left) / 2;
                if (arr[mid] == x) return mid;
                if (arr[mid] < x) left = mid + 1;
                else right = mid - 1;
            }
            return -1;
        }

        // Бінарний пошук (Золотий перетин)
        static int GoldenSectionSearch(int[] arr, int x)
        {
            int left = 0;
            int right = arr.Length - 1;
            double phi = 0.618; // Коефіцієнт золотого перетину

            while (left <= right)
            {
                int mid = left + (int)((right - left) * phi);
                
                // Перевірка меж, щоб не вилетіти
                if (mid < left) mid = left;
                if (mid > right) mid = right;

                if (arr[mid] == x) return mid;
                if (arr[mid] < x) left = mid + 1;
                else right = mid - 1;
            }
            return -1;
        }

        // Пошук у лінійному списку
        static int ListSearch(LinkedList<int> list, int x)
        {
            int index = 0;
            foreach (var item in list)
            {
                if (item == x) return index;
                index++;
            }
            return -1;
        }
    }
}