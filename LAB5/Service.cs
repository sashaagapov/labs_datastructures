namespace agapovlab5
{
    public static class Service
    {
        public static void Welcome()
        {
            Console.WriteLine("=============================================================");
            Console.WriteLine("Лабораторна робота №5.З дисципліни Аналіз структури даних. ");
            Console.WriteLine("Агапов Олександр ІПЗ-11(1)");
            Console.WriteLine("=============================================================");
        }
        /// <summary>
        /// Метод для побудови дерева на основі введених користувачем даних.
        /// Він приймає кількість вузлів (n) як аргумент і виконує наступні кроки:
        /// 1. Створює масив типу RecursiveTree розміром n для зберігання вузлів дерева.
        /// 2. Заповнює масив, запитуючи користувача ввести значення для кожного вузла.
        /// 3. Зв'язує вузли між собою, встановлюючи лівого та правого нащадків відповідно до формули: 
        ///    - Лівий нащадок для вузла з індексом i знаходиться за індексом 2*i + 1.
        ///    - Правий нащадок для вузла з індексом i знаходиться за індексом 2*i + 2. 
        /// </summary>
        /// <param name="n"></param>
        /// <returns></returns>
        public static RecursiveTree BuildTree(int n)
        {
            RecursiveTree[] recursiveTrees = new RecursiveTree[n];

            // Заповнюємо масив вузлами
            for (int i = 0; i < n; i++)
            {
                Console.Write($"Введіть значення вузла [{i}]: ");
                if (int.TryParse(Console.ReadLine(), out int value))
                {
                    recursiveTrees[i] = new RecursiveTree(value);
                }
                else
                {
                    Console.WriteLine("Введіть число.");
                    i--; // Відкочуємо лічильник, щоб повторити спробу для цього індексу
                }
            }

            // Зв'язуємо вузли
            for (int i = 0; i < n; i++)
            {
                int leftChildIndex = 2 * i + 1;
                int rightChildIndex = 2 * i + 2;

                // Встановлюємо лівого нащадка батьку recursiveTrees[i]
                if (leftChildIndex < n)
                {
                    recursiveTrees[i].SetLeft(recursiveTrees[leftChildIndex]);
                }

                // Встановлюємо правого нащадка батьку recursiveTrees[i]
                if (rightChildIndex < n)
                {
                    recursiveTrees[i].SetRight(recursiveTrees[rightChildIndex]);
                }
            }

            // Повертаємо найперший елемент (корінь дерева)
            return recursiveTrees[0];
        }
    }
}