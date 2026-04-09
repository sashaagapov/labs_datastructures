using System;
using System.Collections.Generic;

namespace DequeProject.Structures
{
    public static class ExtraTasks
    {
        // Завдання 1: Перевірка дужок
        public static bool CheckParentheses(string input)
        {
            int balance = 0;

            foreach (char c in input)
            {
                if (c == '(')
                {
                    balance++;
                }
                else if (c == ')')
                {
                    balance--;
                }

                // Якщо закритих дужок стало більше, ніж відкритих — вираз врятувати неможливо
                if (balance < 0)
                {
                    return false;
                }
            }

            return balance == 0; // Всі дужки повинні бути парними, тому баланс має бути нульовим
        }

        // Завдання 2: Злиття двох відсортованих черг
        public static Queue<int> MergeQueues(Queue<int> q1, Queue<int> q2)
        {
            Queue<int> result = new Queue<int>();

            // Поки в обох чергах є хоча б по одному елементу
            while (q1.Count > 0 && q2.Count > 0)
            {
                // Дивимося (не забираючи), хто стоїть першим у кожній черзі
                if (q1.Peek() <= q2.Peek())
                {
                    // Якщо в першій черзі число менше (або рівне), забираємо його і ставимо в нову чергу
                    result.Enqueue(q1.Dequeue());
                }
                else
                {
                    // Інакше забираємо з другої
                    result.Enqueue(q2.Dequeue());
                }
            }

            // Коли одна з черг повністю спорожніла, в іншій могли залишитися елементи.
            // Просто пересипаємо залишки з першої черги (якщо там щось є)
            while (q1.Count > 0)
            {
                result.Enqueue(q1.Dequeue());
            }

            // Або пересипаємо залишки з другої черги (якщо там щось є)
            while (q2.Count > 0)
            {
                result.Enqueue(q2.Dequeue());
            }

            return result;
        }

        // Завдання 3: Видимі будівлі
        public static List<int> GetVisibleBuildings(int[] buildings)
        {
            List<int> visible = new List<int>();

            if (buildings.Length == 0)
            {
                return visible;
            }

            int maxHeight = 0; // Рекорд висоти

            for (int i = 0; i < buildings.Length; i++)
            {
                // Якщо поточна будівля строго вища за всі попередні
                if (buildings[i] > maxHeight)
                {
                    visible.Add(buildings[i]);
                    maxHeight = buildings[i]; // Оновлюємо рекорд
                }
            }

            return visible;
        }
    }
}