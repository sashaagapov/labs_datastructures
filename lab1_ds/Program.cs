//sasha agapov IPZ - 11 lab1_version3
using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Lab1_Search
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8; // Щоб коректно відображалась кирилиця

            // --- 1. ПІДГОТОВКА ДАНИХ ---
            Console.WriteLine("=== Лабораторна робота №1: Алгоритми пошуку ===");
            Console.Write("Введіть кількість елементів масиву (наприклад, 100000): ");
            
            string? inputSize = Console.ReadLine();
            int n;
            // Якщо натиснути Enter без числа, буде 100 000
            if (string.IsNullOrEmpty(inputSize))
                n = 100000;
            else
                if (!int.TryParse(inputSize, out n)) n = 100000;

            // Створюємо масив
            int[] arr = new int[n];

            // ЗАПОВНЕННЯ: Просто числа по порядку 0, 1, 2, 3...
            // Це гарантує, що якщо ви введете число '500', воно там ТОЧНО буде.
            for (int i = 0; i < n; i++)
            {
                arr[i] = i; 
            }

            // Список для порівняння
            LinkedList<int> linkedList = new LinkedList<int>(arr);

            Console.WriteLine("\n[OK] Масив згенеровано.");
            Console.WriteLine($"В масиві є числа від 0 до {n - 1}");
            Console.WriteLine("---------------------------------------------");

            // --- 2. ГОЛОВНЕ МЕНЮ ---
            while (true)
            {
                Console.Write("\nВведіть число для пошуку (або 'exit' для виходу): ");
                string? targetInput = Console.ReadLine();

                if (targetInput == "exit" || string.IsNullOrEmpty(targetInput)) break;

                if (!int.TryParse(targetInput, out int x))
                {
                    Console.WriteLine("Помилка! Введіть ціле число.");
                    continue;
                }

                // Перевірка на дурня, щоб ви розуміли, чому може не знайти
                if (x < 0 || x >= n)
                {
                    Console.WriteLine($"УВАГА: Ви шукаєте число {x}, але масив містить тільки числа від 0 до {n-1}.");
                    Console.WriteLine("Алгоритми видадуть 'Не знайдено', і це правильно.");
                }

                Console.WriteLine("\nОберіть метод:");
                Console.WriteLine("1. Лінійний пошук");
                Console.WriteLine("2. Пошук з бар'єром");
                Console.WriteLine("3. Бінарний пошук");
                Console.WriteLine("4. Золотий перетин");
                Console.WriteLine("5. Пошук у LinkedList");
                Console.WriteLine("6. >> ПОРІВНЯТИ ВСІ (Тест ефективності) <<");
                
                Console.Write("Ваш вибір: ");
                string? choice = Console.ReadLine();

                Console.WriteLine("\n--- Результати ---");

                // Запуск обраного варіанту
                if (choice == "1") RunTest("Лінійний пошук", () => LinearSearch(arr, x));
                else if (choice == "2")
                {
                    // Для бар'єра створюємо копію масиву + 1 елемент
                    int[] bArr = new int[n + 1];
                    Array.Copy(arr, bArr, n);
                    RunTest("Пошук з бар'єром", () => BarrierSearch(bArr, x));
                }
                else if (choice == "3") RunTest("Бінарний пошук", () => BinarySearch(arr, x));
                else if (choice == "4") RunTest("Золотий перетин", () => GoldenSectionSearch(arr, x));
                else if (choice == "5") RunTest("LinkedList пошук", () => LinkedListSearch(linkedList, x));
                else if (choice == "6")
                {
                    // ЗАПУСК ВСІХ ДЛЯ ЗВІТУ
                    RunTest("Лінійний (Array)", () => LinearSearch(arr, x));

                    int[] bArr = new int[n + 1];
                    Array.Copy(arr, bArr, n);
                    RunTest("Бар'єрний      ", () => BarrierSearch(bArr, x));

                    RunTest("Бінарний       ", () => BinarySearch(arr, x));
                    RunTest("Золотий перетин", () => GoldenSectionSearch(arr, x));
                    RunTest("LinkedList     ", () => LinkedListSearch(linkedList, x));
                }
                else
                {
                    Console.WriteLine("Невірний вибір.");
                }
                Console.WriteLine("------------------");
            }
        }

        // Метод для запуску і заміру часу
        static void RunTest(string algorithmName, Func<int> algorithm)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            int index = algorithm();
            sw.Stop();

            string status = (index != -1) ? $"Знайдено [індекс {index}]" : "Не знайдено";
            // Виводимо тіки (найточніше)
            Console.WriteLine($"{algorithmName,-20} | Час: {sw.ElapsedTicks, 5} тіків | {status}");
        }

        // --- АЛГОРИТМИ ---

        static int LinearSearch(int[] a, int x)
        {
            for (int i = 0; i < a.Length; i++)
            {
                if (a[i] == x) return i;
            }
            return -1;
        }

        static int BarrierSearch(int[] a, int x)
        {
            int n = a.Length - 1;
            if (a[n - 1] == x) return n - 1; // Якщо шукане - останнє число
            
            a[n] = x; // Ставимо бар'єр
            int i = 0;
            while (a[i] != x) i++;
            
            if (i < n) return i;
            return -1;
        }

        static int BinarySearch(int[] a, int x)
        {
            int L = 0, R = a.Length - 1;
            while (L <= R)
            {
                int m = (L + R) / 2;
                if (a[m] == x) return m;
                if (a[m] < x) L = m + 1;
                else R = m - 1;
            }
            return -1;
        }

        static int GoldenSectionSearch(int[] a, int x)
        {
            int L = 0, R = a.Length - 1;
            double phi = 0.618;
            while (L <= R)
            {
                int m = L + (int)((R - L) * phi);
                if (m >= a.Length) m = a.Length - 1;

                if (a[m] == x) return m;
                if (a[m] < x) L = m + 1;
                else R = m - 1;
            }
            return -1;
        }

        static int LinkedListSearch(LinkedList<int> list, int x)
        {
            int i = 0;
            foreach (int item in list)
            {
                if (item == x) return i;
                i++;
            }
            return -1;
        }
    }
}