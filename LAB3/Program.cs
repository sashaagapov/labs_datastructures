using System;
using System.Diagnostics;

namespace StringSearchLab
{
    class Program
    {
        static void Main(string[] args)
        {
            Welcome();
            while (true)
            {
                Service();
            }
        }

        static void Welcome()
        {
            Console.Clear();
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("================================================================");
            Console.WriteLine("         Лабораторна робота №3: Пошук підрядка в рядку          ");
            Console.WriteLine("================================================================");
            Console.ResetColor();
            Console.WriteLine("Виконав: Студент групи ІПЗ-11(1) Агапов Олександр Олексійович");
            Console.WriteLine("Завдання: Реалізувати алгоритми пошуку підрядка в рядку: простий");
            Console.WriteLine("пошук та алгоритм КМП. Порівняти їх ефективність.");
            Console.WriteLine("================================================================\n");
        }

        static void Service()
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("-> ВИБІР ДАНИХ ДЛЯ ПОШУКУ <-");
            Console.ResetColor();
            Console.WriteLine("1. Базовий варіант (text = abcabeabcabcabd, pattern = abcabd)");
            Console.WriteLine("2. Ввести дані з клавіатури");
            Console.WriteLine("3. Генерація text і pattern");
            Console.WriteLine("4. Вийти з програми");
            Console.Write("Ваш вибір: ");

            string choice = Console.ReadLine() ?? "";

            string text = "";
            string pattern = "";

            switch (choice)
            {
                case "1":
                    text = "abcabeabcabcabd";
                    pattern = "abcabd";
                    break;
                case "2":
                    Console.Write("Введіть текст: ");
                    text = Console.ReadLine() ?? "";
                    Console.Write("Введіть образ: ");
                    pattern = Console.ReadLine() ?? "";
                    break;
                case "3":
                    Console.WriteLine("Генеруємо гігантський 'злісний' текст для краш-тесту...");
                    text = new string('a', 50000) + "b";
                    pattern = new string('a', 1000) + "b";
                    Console.WriteLine("Текст згенеровано! Довжина тексту: " + text.Length);
                    Console.WriteLine("Довжина образу: " + pattern.Length);
                    break;
                case "4":
                    Console.WriteLine("Завершення роботи...");
                    Environment.Exit(0);
                    break;
                default:
                    Console.WriteLine("\n[Помилка] Невірний вибір. Натисніть Enter, щоб спробувати ще раз.");
                    Console.ReadLine();
                    Console.Clear();
                    return; // Повертаємось на початок циклу while(true)
            }

            // Якщо дані успішно вибрані, переходимо до меню алгоритмів
            Algorithms(text, pattern);
        }

        static void Algorithms(string text, string pattern)
        {
            while (true)
            {
                // Виводимо текст лише якщо він короткий (до 60 символів)
                if (text.Length <= 60)
                    Console.WriteLine("\nПоточний текст: " + text);
                else
                    Console.WriteLine($"\nПоточний текст дуже довгий (довжина: {text.Length} символів)");

                // Те саме для образу
                if (pattern.Length <= 60)
                    Console.WriteLine("Поточний образ: " + pattern);
                else
                    Console.WriteLine($"Поточний образ дуже довгий (довжина: {pattern.Length} символів)");

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("\n-> ВИБІР АЛГОРИТМУ <-");
                Console.ResetColor();
                Console.WriteLine("1. Простий пошук");
                Console.WriteLine("2. Алгоритм Кнута-Морріса-Пратта (КМП)");
                Console.WriteLine("3. Виконати обидва алгоритми (порівняння ефективності)");
                Console.WriteLine("4. Повернутися до вибору тексту");
                Console.Write("Ваш вибір: ");

                string choice = Console.ReadLine() ?? "";
                Console.WriteLine("\n--- РЕЗУЛЬТАТИ ---");

                switch (choice)
                {
                    case "1":
                        int res1 = SimpleSearch(text, pattern);
                        Console.WriteLine($"Результат: {(res1 != -1 ? $"Знайдено на індексі {res1}" : "Не знайдено")}");
                        break;

                    case "2":
                        int res2 = KmpAlgorithm(text, pattern);
                        Console.WriteLine($"Результат: {(res2 != -1 ? $"Знайдено на індексі {res2}" : "Не знайдено")}");
                        break;

                    case "3":
                        int simpleRes = SimpleSearch(text, pattern);
                        int kmpRes = KmpAlgorithm(text, pattern);

                        Console.WriteLine("--------------------------------------------------");
                        Console.WriteLine($"Простий пошук: {(simpleRes != -1 ? $"Знайдено на індексі {simpleRes}" : "Не знайдено")}");
                        Console.WriteLine($"Алгоритм КМП:  {(kmpRes != -1 ? $"Знайдено на індексі {kmpRes}" : "Не знайдено")}");
                        break;

                    case "4":
                        Console.Clear();
                        return; // Повертає нас назад у Service()

                    default:
                        Console.WriteLine("[Помилка] Невірний вибір.");
                        break;
                }

                Console.WriteLine("------------------\nНатисніть Enter для продовження...");
                Console.ReadLine();
                Console.Clear();
            }
        }


        static int SimpleSearch(string text, string pattern)
        {
            int n = text.Length;
            int m = pattern.Length;
            int comparisons = 0;

            for (int i = 0; i <= n - m; i++)
            {
                int j = 0;
                while (j < m)
                {
                    comparisons++; // Рахуємо КОЖНУ спробу порівняти літери
                    if (text[i + j] != pattern[j]) break;
                    j++;
                }
                if (j == m)
                {
                    Console.WriteLine("Кількість порівнянь (SimpleSearch): " + comparisons);
                    return i;
                }
            }
            Console.WriteLine("Кількість порівнянь (SimpleSearch): " + comparisons);
            return -1;
        }
        static int KmpAlgorithm(string text, string pattern)
        {
            int n = text.Length;
            int m = pattern.Length;
            int[] pi = GetPrefixFunction(pattern);

            // Виводимо масив тільки якщо він не величезний
            if (pi.Length <= 50)
            {
                Console.WriteLine("Масив префікс-функції: [" + string.Join(", ", pi) + "]");
            }
            else
            {
                Console.WriteLine($"Масив префікс-функції занадто великий для виводу (розмір: {pi.Length})");
            }
            //Ініціалізація вказівників 
            int k = 0;//Вказівник для тексту
            int l = 0;//Вказівник для образу
            int comprasions = 0;
            while (k != n)
            {
                if (pattern[l] == text[k])//Збіг символів
                {
                    k++;
                    l++;
                    if (l == m)//Знайдено збіг образу
                    {
                        Console.WriteLine("Кількість порівнянь для KmpAlgorithm: " + comprasions);
                        return k - l;
                    }
                    comprasions++;
                }
                else if (pattern[l] != text[k] && l == 0)//Немає збігу і відкочуватись нікуди
                {
                    k++;//Рух вказівника тексту вперед
                    comprasions++;
                }
                else//Немає збігу, але є попередні збіги
                {
                    l = pi[l - 1];//Відкочування вказівника образу на позицію, визначену префікс-функцією
                    comprasions++;
                }
            }
            Console.WriteLine("Кількість порівнянь для KmpAlghorihm: " + comprasions);
            return -1;//Збіг не знайдено
        }
        static int[] GetPrefixFunction(string pattern)
        {
            int n = pattern.Length;
            int[] pi = new int[n];

            // 1. Початкова ініціалізація
            pi[0] = 0;
            int i = 1;
            int j = 0;

            // Основний цикл проходу по всьому образу
            while (i < n)
            {
                // 2. Якщо символи збігаються
                if (pattern[i] == pattern[j])
                {
                    pi[i] = j + 1;
                    i++;
                    j++;
                }
                // 3. Якщо не збігаються і відкочуватись нікуди (j == 0)
                else if (j == 0)
                {
                    pi[i] = 0;
                    i++;
                }
                // 4. Якщо не збігаються, але є попередні збіги
                else
                {
                    j = pi[j - 1]; // Відкочування вказівника образу на позицію, визначену префікс-функцією
                }
            }

            return pi;
        }
    }
}
