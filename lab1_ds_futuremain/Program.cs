using System;
using System.Diagnostics;

namespace SearchAlgorithms
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("--------------------------------------------------------------------------------");
            Console.WriteLine("Дисципліна « Структури даних, аналіз і алгоритми комп'ютерної обробки інформації »");
            Console.WriteLine("Лабораторна робота номер 1,Агапов Олександр Олексійович,ІПЗ-11(1)");
            // 1. ГЕНЕРАЦІЯ (робимо це один раз перед циклом)
            int n = 100000;
            int[] numbers = new int[n + 1]; // +1 для бар'єра
            
            for (int i = 0; i < n; i++) 
            {
                numbers[i] = i;
            }

            Console.WriteLine($"Масив з {n} елементів згенеровано.");
            Console.WriteLine("--------------------------------------------------");

            // 2. НЕСКІНЧЕННИЙ ЦИКЛ ДЛЯ ПОШУКУ
            while (true)
            {
                Console.Write("\nВведіть число (або напишіть 'exit' для виходу): ");
                string input = Console.ReadLine();

                // Перевірка на вихід
                // ToLower() дозволяє писати і "Exit", і "EXIT", і "exit"
                if (input.ToLower() == "exit" || input.ToLower() == "ексіт")
                {
                    Console.WriteLine("Програма завершена.");
                    break; // Зупиняє цикл
                }

                // Спробуємо перетворити введене в число
                if (!int.TryParse(input, out int target))
                {
                    Console.WriteLine("Помилка: це не число. Спробуйте ще раз.");
                    continue; // Повертає на початок циклу
                }

                // Якщо це число — запускаємо всі тести
                RunTests(numbers, target, n);
            }
        }

        // Я виніс запуск тестів в окремий метод, щоб Main був чистішим
        static void RunTests(int[] numbers, int target, int n)
        {
            Console.WriteLine($"   >>> Шукаємо число: {target}");
            Stopwatch sw = new Stopwatch();

            // 1. Лінійний
            sw.Restart();
            int idxLin = LinearSearch(numbers, target, n);
            sw.Stop();
            PrintResult("Лінійний", idxLin, sw.Elapsed.TotalMilliseconds);

            // 2. З бар'єром
            sw.Restart();
            int idxBar = BarrierSearch(numbers, target, n);
            sw.Stop();
            PrintResult("З бар'єром", idxBar, sw.Elapsed.TotalMilliseconds);

            // 3. Бінарний
            sw.Restart();
            int idxBin = BinarySearch(numbers, target, n);
            sw.Stop();
            PrintResult("Бінарний", idxBin, sw.Elapsed.TotalMilliseconds);

            // 4. Золотий перетин
            sw.Restart();
            int idxGold = GoldenSectionSearch(numbers, target, n);
            sw.Stop();
            PrintResult("Золотий перетин", idxGold, sw.Elapsed.TotalMilliseconds);
        }

        static void PrintResult(string name, int index, double time)
        {
            string foundText = (index != -1) ? "Знайдено" : "Немає";
            // Форматування для гарної таблички
            Console.WriteLine($"{name,-18} | {foundText,-10} | Час: {time:F4} мс");
        }

        // --- АЛГОРИТМИ ---

        static int LinearSearch(int[] a, int x, int n)
        {
            for (int i = 0; i < n; i++)
                if (a[i] == x) return i;
            return -1;
        }

        static int BarrierSearch(int[] a, int x, int n)
        {
            if (n >= a.Length) return -1;
            a[n] = x; 
            int i = 0;
            while (a[i] != x) i++;
            if (i == n) return -1;
            return i;
        }

        static int BinarySearch(int[] a, int x, int n)
        {
            int left = 0, right = n - 1;
            while (left <= right)
            {
                int mid = (left + right) / 2;
                if (a[mid] == x) return mid;
                if (x > a[mid]) left = mid + 1;
                else right = mid - 1;
            }
            return -1;
        }

        static int GoldenSectionSearch(int[] a, int x, int n)
        {
            int left = 0, right = n - 1;
            double phi = 0.381966;
            while (left <= right)
            {
                int mid = left + (int)((right - left) * phi);
                if (a[mid] == x) return mid;
                if (x > a[mid]) left = mid + 1;
                else right = mid - 1;
            }
            return -1;
        }
    }
}