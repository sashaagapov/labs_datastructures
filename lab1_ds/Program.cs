//sasha agapov IPZ - 11 lab1_version1
using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Lab1_Search
{
    class Program
    {
        static void Main(string[] args)
        {
            // Створюємо великий масив даних для тесту (1 мільйон елементів)
            // Менше ставити немає сенсу, бо на малих даних час буде 0 тіків
            int size = 1000000;
            int[] arr = new int[size];
            
            // Заповнюємо масив відсортованими числами (парними), щоб працював бінарний пошук
            for (int i = 0; i < size; i++)
            {
                arr[i] = i * 2;
            }

            // Робимо копію у вигляді зв'язного списку для порівняння
            LinkedList<int> linkedList = new LinkedList<int>(arr);

            while (true)
            {
                Console.WriteLine("\n------------------------------------------------");
                Console.Write("Введіть число для пошуку (наприклад, 888888): ");
                string input = Console.ReadLine();
                
                if (!int.TryParse(input, out int target))
                {
                    Console.WriteLine("Це не число!");
                    continue;
                }

                Console.WriteLine("\nПочинаємо тестування...\n");

                // 1. Звичайний перебір (Array)
                MeasureTime("Лінійний пошук (Array)", () => LinearSearch(arr, target));

                // 2. Пошук з бар'єром
                // Для бар'єра треба масив на 1 елемент більший. 
                // Створюємо його тут, щоб не включати час копіювання у час пошуку (хоча в реальності це мінус методу)
                int[] arrWithBarrier = new int[size + 1];
                Array.Copy(arr, arrWithBarrier, size);
                MeasureTime("Пошук з бар'єром", () => BarrierSearch(arrWithBarrier, target));

                // 3. Бінарний пошук
                MeasureTime("Бінарний пошук", () => BinarySearch(arr, target));

                // 4. Золотий перетин
                MeasureTime("Золотий перетин", () => GoldenSectionSearch(arr, target));

                // 5. Пошук у списку (LinkedList)
                MeasureTime("Лінійний пошук (LinkedList)", () => LinkedListSearch(linkedList, target));

                Console.WriteLine("\nНатисніть Enter, щоб спробувати інше число...");
                Console.ReadLine();
            }
        }

        // Метод для заміру часу, щоб не писати сто разів Stopwatch
        static void MeasureTime(string name, Func<int> searchFunc)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            
            int index = searchFunc(); // Викликаємо пошук
            
            sw.Stop();

            // Виводимо результат красиво
            string resultText = index != -1 ? $"Знайдено (індекс {index})" : "Не знайдено";
            Console.WriteLine($"{name,-30} | Час: {sw.ElapsedTicks, 6} тіків | {resultText}");
        }

        // --- АЛГОРИТМИ ---

        // 1. Простий лінійний пошук
        static int LinearSearch(int[] a, int x)
        {
            for (int i = 0; i < a.Length; i++)
            {
                if (a[i] == x) return i;
            }
            return -1;
        }

        // 2. Пошук з бар'єром
        static int BarrierSearch(int[] a, int x)
        {
            int n = a.Length - 1; // Останній реальний індекс (бо ми додали +1 місце)
            
            // Якщо шуканий елемент вже в кінці - повертаємо його
            if (a[n - 1] == x) return n - 1;

            a[n] = x; // Ставимо бар'єр в кінець
            int i = 0;
            
            // Цикл без перевірки i < n, бо ми точно знайдемо x (хоча б бар'єр)
            while (a[i] != x)
            {
                i++;
            }

            // Якщо індекс менше n, значить знайшли реальний елемент, а не бар'єр
            if (i < n) return i;
            
            return -1;
        }

        // 3. Бінарний пошук (стандартний)
        static int BinarySearch(int[] a, int x)
        {
            int left = 0;
            int right = a.Length - 1;

            while (left <= right)
            {
                int mid = (left + right) / 2;

                if (a[mid] == x) return mid;
                
                if (a[mid] < x)
                    left = mid + 1;
                else
                    right = mid - 1;
            }
            return -1;
        }

        // 4. Пошук золотим перетином
        static int GoldenSectionSearch(int[] a, int x)
        {
            int left = 0;
            int right = a.Length - 1;
            double phi = 0.618; // Пропорція золотого перетину

            while (left <= right)
            {
                // Формула зміщення: ділимо відрізок не навпіл, а за пропорцією
                int mid = left + (int)((right - left) * phi);
                
                // Перевірка, щоб не вийти за межі (іноді буває через округлення)
                if (mid >= a.Length) mid = a.Length - 1;

                if (a[mid] == x) return mid;

                if (a[mid] < x)
                    left = mid + 1;
                else
                    right = mid - 1;
            }
            return -1;
        }

        // 5. Пошук у зв'язному списку
        static int LinkedListSearch(LinkedList<int> list, int x)
        {
            int i = 0;
            // У LinkedList не можна звернутись по індексу [i], треба йти по порядку
            foreach (var item in list)
            {
                if (item == x) return i;
                i++;
            }
            return -1;
        }
    }
}