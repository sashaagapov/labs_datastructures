using System;
using System.Collections.Generic;
namespace DequeProject.Structures;

class MyQueueOnStacks
{
    private Stack<int> stackIn;
    private Stack<int> stackOut;

    public MyQueueOnStacks()
    {
        stackIn = new Stack<int>();
        stackOut = new Stack<int>();
    }

    public void Enqueue(int value)// Додавання елемента до черги
    {
        stackIn.Push(value);
    }
    public int Dequeue()// Видалення елемента з черги
    {
        if (stackOut.Count == 0)// Якщо вихідний стек порожній, переносимо всі елементи з вхідного стеку
        {
            while (stackIn.Count > 0)// Переносимо всі елементи з stackIn до stackOut, щоб змінити порядок на FIFO
            {
                stackOut.Push(stackIn.Pop());// Переносимо елемент з stackIn до stackOut
            }
        }

        if (stackOut.Count == 0)// Якщо після перенесення обох стеків порожні, то черга порожня
        {
            Console.WriteLine("[-] Помилка: Черга порожня (Underflow)!");
            return -1;
        }
        return stackOut.Pop();// Повертаємо верхній елемент з stackOut, який є першим доданим елементом (FIFO)
    }
    public int GetSize()// Повертає кількість елементів у черзі
    {
        return stackIn.Count + stackOut.Count;
    }
    public int Peek()// Повертає перший елемент черги без видалення
    {
        if (stackOut.Count == 0)
        {
            while (stackIn.Count > 0)
            {
                stackOut.Push(stackIn.Pop());
            }
        }
        if (stackOut.Count == 0)
        {
            Console.WriteLine("[-] Помилка: Черга порожня (Underflow)!");
            return -1;
        }
        return stackOut.Peek();
    }
    public int[] GetStackInState()
    {
        return stackIn.ToArray();
    }

    public int[] GetStackOutState()
    {
        return stackOut.ToArray();
    }
}