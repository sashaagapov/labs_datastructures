using System;
using System.Collections.Generic;

namespace DequeProject.Structures
{
    public class SetOfStacks
    {
        private List<Stack<int>> stacks;///
        private int capacity;

        public SetOfStacks(int capacity)
        {
            this.capacity = capacity;
            this.stacks = new List<Stack<int>>();
        }

        public void Push(int value)
        {
            // 1. Перевіряємо, чи немає стеків взагалі, АБО чи останній стек уже заповнений до ліміту
            if (stacks.Count == 0 || stacks[stacks.Count - 1].Count == capacity)
            {
                // Якщо так, то створюємо новий порожній стек і додаємо його на "стіл" (у список)
                stacks.Add(new Stack<int>());
            }

            // 2. Беремо найостанніший стек зі списку і кладемо туди нашу тарілку (значення)
            stacks[stacks.Count - 1].Push(value);
        }

        public int Pop()
        {
            // 1. Перевірка на порожнечу (Underflow)
            if (stacks.Count == 0)
            {
                Console.WriteLine("Помилка: На столі немає жодної тарілки!");
                return -1; // Повертаємо -1 як сигнал про помилку
            }

            // 2. Знаходимо найостаннішу стопку на столі
            int lastIndex = stacks.Count - 1;
            Stack<int> lastStack = stacks[lastIndex];

            // 3. Забираємо з неї верхню тарілку і запам'ятовуємо її
            int value = lastStack.Pop();

            // 4. Прибираємо за собою: якщо стопка стала порожньою, викидаємо її
            if (lastStack.Count == 0)
            {
                stacks.RemoveAt(lastIndex);
            }

            // 5. Віддаємо тарілку тому, хто її просив
            return value;
        }
        public List<int[]> GetStacksState()
        {
            List<int[]> state = new List<int[]>();
            // Проходимось по всіх стопках і робимо їхні копії у вигляді масивів
            foreach (var stack in stacks)
            {
                state.Add(stack.ToArray());
            }
            return state;
        }
    }

}