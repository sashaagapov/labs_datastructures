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
            Console.WriteLine("Лабораторна робота номер 1, Агапов Олександр Олексійович, ІПЗ-11(1)");
            Console.WriteLine("--------------------------------------------------------------------------------");

            // 1. ВИБІР РОЗМІРУ МАСИВУ
            int n = 0;
            bool isNumber = true;
            while (isNumber)
            {
                Console.Write("Введіть розмір масиву (наприклад, 100 або 100000): ");
                if (int.TryParse(Console.ReadLine(), out n) && n > 0)
                {
                    isNumber = false;
                }
                Console.WriteLine("Помилка: введіть ціле число більше 0.");
            }

            // Створюємо масив (+1 місце для бар'єра)
            int[] numbers = new int[n + 1];

            // 2. ВИБІР СПОСОБУ ЗАПОВНЕННЯ
            Console.WriteLine("\nОберіть спосіб заповнення масиву:");
            Console.WriteLine("1. Рандомно (числа від 0 до 100000)");
            Console.WriteLine("2. По порядку (0, 1, 2... n)");
            Console.WriteLine("3. Вручну з клавіатури");
            Console.Write("Ваш вибір (1-3): ");

            string choice = Console.ReadLine();
            bool isSortedInitially = false; // Прапорець, чи відсортований масив від початку

            switch (choice)
            {
                case "1":
                    FillRandom(numbers, n);
                    break;
                case "2":
                    FillOrdered(numbers, n);
                    isSortedInitially = true;
                    break;
                case "3":
                    FillManual(numbers, n);
                    break;
                default:
                    Console.WriteLine("Невірний вибір. Заповнюємо рандомно за замовчуванням.");
                    FillRandom(numbers, n);
                    break;
            }

            // 3. ВИВІД МАСИВУ (За бажанням)
            if (n <= 1000) // Щоб не виводити 100 тисяч рядків
            {
                Console.Write("\nВивести згенерований масив на екран? (y/n): ");
                if (Console.ReadLine().ToLower() == "y")
                {
                    PrintArray(numbers, n);
                }
            }
            else
            {
                Console.WriteLine("\nМасив надто великий для виводу.");
            }

            Console.WriteLine("\n--------------------------------------------------");
            Console.WriteLine("Масив готовий. Починаємо тестування.");

            // 4. НЕСКІНЧЕННИЙ ЦИКЛ ДЛЯ ПОШУКУ
            while (true)
            {
                Console.Write("\nВведіть число для пошуку (або 'exit' для виходу): ");
                string input = Console.ReadLine() ?? "";

                if (input.ToLower() == "exit")
                {
                    Console.WriteLine("Програма завершена.");
                    break;
                }

                if (!int.TryParse(input, out int target))
                {
                    Console.WriteLine("Помилка: це не число.");
                    continue;
                }

                // Запускаємо тести, передаючи інформацію, чи відсортований масив
                RunTests(numbers, target, n, isSortedInitially);
            }
        }

        // --- МЕТОДИ ЗАПОВНЕННЯ ---
        static void FillRandom(int[] a, int n)
        {
            Random rand = new Random();
            for (int i = 0; i < n; i++)
            {
                a[i] = rand.Next(0, 100001); // Рандом 0-100000
            }
            Console.WriteLine("Масив заповнено випадковими числами.");
        }

        static void FillOrdered(int[] a, int n)
        {
            for (int i = 0; i < n; i++)
            {
                a[i] = i;
            }
            Console.WriteLine("Масив заповнено по порядку.");
        }

        static void FillManual(int[] a, int n)
        {
            Console.WriteLine($"Введіть {n} чисел (через Enter):");
            for (int i = 0; i < n; i++)
            {
                Console.Write($"[{i}]: ");
                while (!int.TryParse(Console.ReadLine(), out a[i]))
                {
                    Console.Write("Помилка. Введіть число ще раз: ");
                }
            }
            Console.WriteLine("Масив заповнено вручну.");
        }

        static void PrintArray(int[] a, int n)
        {
            Console.WriteLine("Елементи масиву:");
            for (int i = 0; i < n; i++)
            {
                Console.Write(a[i] + " ");
            }
            Console.WriteLine();
        }

        // --- ЛОГІКА ТЕСТУВАННЯ ---
        static void RunTests(int[] numbers, int target, int n, bool isSortedInitially)
        {
            Console.WriteLine($"\n   >>> Шукаємо число: {target}");
            Stopwatch sw = new Stopwatch();

            // 1. ЛІНІЙНІ ПОШУКИ (Завжди шукають в оригіналі)
            sw.Start();
            int idxLin = LinearSearch(numbers, target, n);
            sw.Stop();
            PrintResult("Лінійний", idxLin, sw.Elapsed.TotalMilliseconds, "Оригінал");

            sw.Restart();
            int idxBar = BarrierSearch(numbers, target, n);
            sw.Stop();
            PrintResult("З бар'єром", idxBar, sw.Elapsed.TotalMilliseconds, "Оригінал");

            // 2. БІНАРНІ ПОШУКИ
            // Тут визначаємо, який масив дати бінарному пошуку
            int[] arrayForBinary;
            string noteBinary;

            if (isSortedInitially)
            {
                // Якщо масив вже відсортований (опція 2), не витрачаємо пам'ять на копію
                // і час на зайві операції. Шукаємо прямо тут.
                arrayForBinary = numbers;
                noteBinary = "Оригінал";
            }
            else
            {
                // Якщо масив був рандомний (опція 1 або 3), то для бінарного пошуку
                // мусимо створити окрему відсортовану копію
                arrayForBinary = new int[n + 1];
                Array.Copy(numbers, arrayForBinary, n + 1);
                QuickSort(arrayForBinary, 0, n - 1);
                noteBinary = "Sorted Copy";
            }

            // Запускаємо пошук на обраному масиві (або оригінал, або копія)
            sw.Restart();
            int idxBin = BinarySearch(arrayForBinary, target, n);
            sw.Stop();
            PrintResult("Бінарний", idxBin, sw.Elapsed.TotalMilliseconds, noteBinary);

            sw.Restart();
            int idxGold = GoldenSectionSearch(arrayForBinary, target, n);
            sw.Stop();
            PrintResult("Золотий перетин", idxGold, sw.Elapsed.TotalMilliseconds, noteBinary);

            // Виводимо попередження тільки якщо ми реально підмінили масив
            if (!isSortedInitially)
            {
                Console.WriteLine("\n* Примітка: Для бінарних методів створено відсортовану копію масиву.");
                Console.WriteLine("* Тому індекси можуть відрізнятися від лінійного пошуку.");
            }
        }
        static void PrintResult(string name, int index, double time, string note)
        {
            string foundText = (index != -1) ? $"Index: {index}" : "Not Found";
            Console.WriteLine($"{name,-18} | {foundText,-12} | Час: {time:F4} мс | ({note})");
        }

        // --- QUICK SORT (Швидке сортування) ---
        static void QuickSort(int[] arr, int low, int high)
        {
            if (low < high)
            {
                int pi = Partition(arr, low, high);

                QuickSort(arr, low, pi - 1);
                QuickSort(arr, pi + 1, high);
            }
        }

        static int Partition(int[] arr, int low, int high)
        {
            int pivot = arr[high];
            int i = (low - 1);

            for (int j = low; j < high; j++)
            {
                if (arr[j] < pivot)
                {
                    i++;
                    // Міняємо місцями
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
            // Міняємо pivot на своє місце
            int temp1 = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp1;

            return i + 1;
        }

        // --- АЛГОРИТМИ ПОШУКУ (Твої методи в правильному форматі) ---

        static int LinearSearch(int[] a, int x, int n)
        {
            for (int i = 0; i < n; i++)
            {
                if (a[i] == x)
                {
                    return i;
                }
            }
            return -1;
        }

        static int BarrierSearch(int[] a, int x, int n)
        {
            if (n >= a.Length)
            {
                return -1;
            }
            a[n] = x;
            int i = 0;
            while (a[i] != x)
            {
                i++;
            }
            if (i == n)
            {
                return -1;
            }
            return i;
        }

        static int BinarySearch(int[] a, int x, int n)
        {
            int left = 0;
            int right = n - 1;
            while (left <= right)
            {
                int mid = (left + right) / 2;
                if (a[mid] == x)
                {
                    return mid;
                }
                if (x > a[mid])
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid - 1;
                }
            }
            return -1;
        }

        static int GoldenSectionSearch(int[] a, int x, int n)
        {
            int left = 0;
            int right = n - 1;
            double phi = 0.381966;
            while (left <= right)
            {
                int mid = left + (int)((right - left) * phi);
                if (a[mid] == x)
                {
                    return mid;
                }
                if (x > a[mid])
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid - 1;
                }
            }
            return -1;
        }
    }
}