using System;
using DequeProject.Structures;

namespace DequeProject
{
    class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                Console.Clear();
                Console.WriteLine("=== ЛАБОРАТОРНА РОБОТА: СТРУКТУРИ ДАНИХ ===");
                Console.WriteLine("1. Тестувати Дек (Deque) на масиві");
                Console.WriteLine("2. Черга на двох стеках");
                Console.WriteLine("3. Стек на двох чергах");
                Console.WriteLine("4. Додаткові завдання");
                Console.WriteLine("5. Стек тарілок (Set of Stacks)");
                Console.WriteLine("0. Вихід");
                Console.Write("\nОберіть завдання: ");

                string? choice = Console.ReadLine();

                if (choice == "1")
                {
                    RunDeque();
                }
                else if (choice == "2")
                {
                    RunQueueOnStacks();
                }
                else if (choice == "3")
                {
                    RunStackOnQueues();
                }
                else if (choice == "4")
                {
                    RunExtraTasks();
                }
                else if (choice == "5")
                {
                    RunSetOfStacks();
                }
                else if (choice == "0")
                {
                    return; // Вихід з програми
                }
                else
                {
                    Console.WriteLine("Невірна команда...");
                    Console.ReadKey();
                }
            }
        }

        static void RunDeque()
        {
            Console.Clear();
            Console.Write("Введіть розмір масиву для Дека: ");

            string? input = Console.ReadLine();
            int n;
            bool isNumber = int.TryParse(input, out n);

            if (isNumber == false || n <= 0)
            {
                Console.WriteLine("Помилка: потрібно ввести додатне число.");
                Console.ReadKey();
                return;
            }

            MyDeque deque = new MyDeque(n);

            while (true)
            {
                Console.Clear();
                PrintDequeState(deque);
                Console.WriteLine("--- КЕРУВАННЯ ДЕКОМ ---");
                Console.WriteLine("1. Insert Front (Додати на початок)");
                Console.WriteLine("2. Insert Rear (Додати в кінець)");
                Console.WriteLine("3. Delete Front (Видалити з початку)");
                Console.WriteLine("4. Delete Rear (Видалити з кінця)");
                Console.WriteLine("0. Повернутися в головне меню");
                Console.Write("\nДія: ");

                string? action = Console.ReadLine();

                if (action == "0")
                {
                    break;
                }

                if (action == "1" || action == "2")
                {
                    Console.Write("Введіть значення: ");
                    string? valInput = Console.ReadLine();
                    int val;

                    if (int.TryParse(valInput, out val))
                    {
                        bool isSuccess = false;

                        if (action == "1")
                        {
                            isSuccess = deque.InsertFront(val);
                        }
                        else if (action == "2")
                        {
                            isSuccess = deque.InsertRear(val);
                        }

                        if (isSuccess == false)
                        {
                            Console.WriteLine("Помилка: Переповнення (Дек повний)!");
                            Console.ReadKey();
                        }
                    }
                }
                else if (action == "3")
                {
                    var result = deque.DeleteFront();
                    if (result.success == true)
                    {
                        Console.WriteLine("Видалено: " + result.value);
                    }
                    else
                    {
                        Console.WriteLine("Помилка: Дек порожній!");
                    }
                    Console.ReadKey();
                }
                else if (action == "4")
                {
                    var result = deque.DeleteRear();
                    if (result.success == true)
                    {
                        Console.WriteLine("Видалено: " + result.value);
                    }
                    else
                    {
                        Console.WriteLine("Помилка: Дек порожній!");
                    }
                    Console.ReadKey();
                }
            }
        }

        static void PrintDequeState(MyDeque deque)
        {
            int[] arr = deque.GetRawArray();
            Console.WriteLine("\n=== ВНУТРІШНІЙ СТАН ===");

            Console.Write("Індекси:\t");
            for (int i = 0; i < arr.Length; i++)
            {
                Console.Write("[" + i + "]\t");
            }

            Console.Write("\nМасив:\t\t");
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i] == 0)
                {
                    Console.Write("_\t");
                }
                else
                {
                    Console.Write(arr[i] + "\t");
                }
            }

            Console.WriteLine("\n");
            Console.WriteLine("head (голова): " + deque.GetHead());
            Console.WriteLine("tail (хвіст):  " + deque.GetTail());
            Console.WriteLine("size (розмір): " + deque.Size + " з " + deque.Capacity);
            Console.WriteLine("=======================\n");
        }

        static void RunQueueOnStacks()
        {
            MyQueueOnStacks queue = new MyQueueOnStacks();

            while (true)
            {
                Console.Clear();
                PrintQueueState(queue);
                Console.WriteLine("--- КЕРУВАННЯ ЧЕРГОЮ ---");
                Console.WriteLine("1. Enqueue (Додати)");
                Console.WriteLine("2. Dequeue (Видалити)");
                Console.WriteLine("3. Peek (Підглянути)");
                Console.WriteLine("0. Назад");
                Console.Write("\nДія: ");

                string? action = Console.ReadLine();

                if (action == "0")
                {
                    break;
                }
                else if (action == "1")
                {
                    Console.Write("Значення: ");
                    string? valInput = Console.ReadLine();
                    int val;
                    if (int.TryParse(valInput, out val))
                    {
                        queue.Enqueue(val);
                    }
                }
                else if (action == "2")
                {
                    int dequeued = queue.Dequeue();
                    if (dequeued != -1)
                    {
                        Console.WriteLine("[+] Видалено: " + dequeued);
                        Console.ReadKey();
                    }
                }
                else if (action == "3")
                {
                    int peeked = queue.Peek();
                    if (peeked != -1)
                    {
                        Console.WriteLine("[*] Перший: " + peeked);
                        Console.ReadKey();
                    }
                }
            }
        }

        static void PrintQueueState(MyQueueOnStacks q)
        {
            int[] sIn = q.GetStackInState();
            int[] sOut = q.GetStackOutState();

            Console.WriteLine("\n=== ВНУТРІШНІЙ СТАН (ЧЕРГА НА СТЕКАХ) ===");

            Console.Write("stackIn  (свіжі):   [ ");
            foreach (int item in sIn)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine("] <- верхівка");

            Console.Write("stackOut (старі):   [ ");
            foreach (int item in sOut)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine("] <- верхівка");

            Console.WriteLine("Загальний розмір: " + q.GetSize());
            Console.WriteLine("=========================================\n");
        }

        static void RunStackOnQueues()
        {
            MyStackOnQueues stack = new MyStackOnQueues();

            while (true)
            {
                Console.Clear();
                PrintStackState(stack);
                Console.WriteLine("--- КЕРУВАННЯ СТЕКОМ ---");
                Console.WriteLine("1. Push (Додати)");
                Console.WriteLine("2. Pop (Видалити)");
                Console.WriteLine("3. Peek (Підглянути)");
                Console.WriteLine("0. Назад");
                Console.Write("\nДія: ");

                string? action = Console.ReadLine();

                if (action == "0")
                {
                    break;
                }
                else if (action == "1")
                {
                    Console.Write("Значення: ");
                    string? valInput = Console.ReadLine();
                    int val;
                    if (int.TryParse(valInput, out val))
                    {
                        stack.Push(val);
                    }
                }
                else if (action == "2")
                {
                    int popped = stack.Pop();
                    if (popped != -1)
                    {
                        Console.WriteLine("[+] Видалено: " + popped);
                        Console.ReadKey();
                    }
                }
                else if (action == "3")
                {
                    int peeked = stack.Peek();
                    if (peeked != -1)
                    {
                        Console.WriteLine("[*] Верхівка: " + peeked);
                        Console.ReadKey();
                    }
                }
            }
        }

        static void PrintStackState(MyStackOnQueues s)
        {
            int[] q1 = s.GetQueue1State();

            Console.WriteLine("\n=== ВНУТРІШНІЙ СТАН (СТЕК НА ЧЕРГАХ) ===");

            Console.Write("queue1 (головна): верхівка стека -> [ ");
            foreach (int item in q1)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine("]");

            Console.WriteLine("Загальний розмір: " + s.GetSize());
            Console.WriteLine("========================================\n");
        }
        static void RunExtraTasks()
        {
            while (true)
            {
                Console.Clear();
                Console.WriteLine("=== ДОДАТКОВІ ЗАВДАННЯ ===");
                Console.WriteLine("1. Перевірка дужок");
                Console.WriteLine("2. Злиття двох черг");
                Console.WriteLine("3. Видимі будівлі");
                Console.WriteLine("0. Назад");
                Console.Write("\nОберіть завдання: ");

                string? choice = Console.ReadLine();

                if (choice == "0")
                {
                    break;
                }
                else if (choice == "1")
                {
                    Console.Clear();
                    Console.Write("Введіть рядок з дужками (наприклад, ()(()) ): ");
                    string? input = Console.ReadLine();
                    bool isValid = ExtraTasks.CheckParentheses(input ?? "");

                    if (isValid)
                        Console.WriteLine("\n[+] Результат: Вираз ПРАВИЛЬНИЙ (можна додати цифри).");
                    else
                        Console.WriteLine("\n[-] Результат: Вираз ПОЛАМАНИЙ (баланс порушено).");

                    Console.ReadKey();
                }
                else if (choice == "2")
                {
                    Console.Clear();
                    Console.WriteLine("Демонстрація злиття черг...");

                    // Створюємо дві тестові черги
                    Queue<int> q1 = new Queue<int>(new[] { 1, 3, 5, 7, 10 });
                    Queue<int> q2 = new Queue<int>(new[] { 2, 4, 6, 8 });

                    Console.WriteLine("Черга 1: 1, 3, 5, 7, 10");
                    Console.WriteLine("Черга 2: 2, 4, 6, 8");

                    Queue<int> merged = ExtraTasks.MergeQueues(q1, q2);

                    Console.Write("\nРезультат злиття: ");
                    foreach (var item in merged)
                    {
                        Console.Write(item + " ");
                    }
                    Console.WriteLine();
                    Console.ReadKey();
                }
                else if (choice == "3")
                {
                    Console.Clear();
                    Console.WriteLine("Введіть висоти будівель через пробіл (наприклад: 8 2 3 11 11 10): ");
                    string? input = Console.ReadLine();

                    if (!string.IsNullOrWhiteSpace(input))
                    {
                        string[] parts = input.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                        List<int> buildings = new List<int>();

                        foreach (var part in parts)
                        {
                            if (int.TryParse(part, out int h))
                            {
                                buildings.Add(h);
                            }
                        }

                        List<int> visible = ExtraTasks.GetVisibleBuildings(buildings.ToArray());
                        Console.Write("\nВидимі будівлі: ");
                        foreach (var v in visible)
                        {
                            Console.Write(v + " ");
                        }
                        Console.WriteLine();
                    }
                    Console.ReadKey();
                }
            }
        }

        static void RunSetOfStacks()
        {
            Console.Clear();
            Console.Write("Введіть ліміт (capacity) для однієї стопки: ");

            if (!int.TryParse(Console.ReadLine(), out int capacity) || capacity <= 0)
            {
                Console.WriteLine("Помилка: потрібно ввести додатне число.");
                Console.ReadKey();
                return;
            }

            SetOfStacks setOfStacks = new SetOfStacks(capacity);

            while (true)
            {
                Console.Clear();
                Console.WriteLine($"=== СТЕК ТАРІЛОК (Ліміт стопки: {capacity}) ===");

                // --- НОВИЙ БЛОК ВІЗУАЛІЗАЦІЇ ---
                Console.WriteLine("\n=== СТАН СТОЛУ ===");
                var currentState = setOfStacks.GetStacksState();
                if (currentState.Count == 0)
                {
                    Console.WriteLine("Стіл абсолютно порожній.");
                }
                else
                {
                    for (int i = 0; i < currentState.Count; i++)
                    {
                        // ToArray() повертає верхівку стека першим елементом, тому покажемо це наочно
                        Console.WriteLine($"Стопка {i + 1}: верхівка -> [ {string.Join(", ", currentState[i])} ]");
                    }
                }
                Console.WriteLine("==================\n");
                // -------------------------------

                Console.WriteLine("1. Push (Покласти тарілку)");
                Console.WriteLine("2. Pop (Забрати тарілку)");
                Console.WriteLine("0. Назад");
                Console.Write("\nДія: ");

                string? action = Console.ReadLine();

                if (action == "0")
                {
                    break;
                }
                else if (action == "1")
                {
                    Console.Write("Введіть номер або вагу тарілки: ");
                    if (int.TryParse(Console.ReadLine(), out int val))
                    {
                        setOfStacks.Push(val);
                        // Прибрав Console.ReadKey(), щоб меню оновлювалося миттєво і було видно результат
                    }
                }
                else if (action == "2")
                {
                    int popped = setOfStacks.Pop();
                    if (popped != -1)
                    {
                        Console.WriteLine($"[-] Забрано тарілку: {popped}");
                        Console.ReadKey(); // Залишаємо паузу тільки щоб побачити, що саме забрали
                    }
                    else
                    {
                        Console.ReadKey();
                    }
                }
            }
        }

    }
}