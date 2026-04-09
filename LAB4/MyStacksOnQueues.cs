using System;
using System.Collections.Generic;
namespace DequeProject.Structures;

class MyStackOnQueues
{
    private Queue<int> queue1;
    private Queue<int> queue2;

    public MyStackOnQueues()
    {
        queue1 = new Queue<int>();
        queue2 = new Queue<int>();
    }
    public void Push(int value)
    {
        queue2.Enqueue(value);
        while (queue1.Count > 0)
        {
            queue2.Enqueue(queue1.Dequeue());
        }
        Queue<int> temp = queue1;
        queue1 = queue2;
        queue2 = temp;
    }
    public int Pop()
    {
        if (queue1.Count > 0)
        {
            return queue1.Dequeue();
        }
        else
        {
            Console.WriteLine("Underflow");
            return -1;
        }
    }
    public int Peek()
    {
        if (queue1.Count > 0)
        {
            return queue1.Peek();
        }
        else
        {
            Console.WriteLine("Underflow");
            return -1;
        }
    }
    public int GetSize()
    {
        return queue1.Count;
    }
    public int[] GetQueue1State()
    {
        return queue1.ToArray();
    }
}