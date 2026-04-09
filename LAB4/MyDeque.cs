namespace DequeProject.Structures
{
    public class MyDeque
    {
        private readonly int[] array;
        private int head;
        private int tail;
        private int size;
        private readonly int capacity;

        public MyDeque(int n)
        {
            capacity = n;
            array = new int[capacity];
            head = 0;
            tail = 0;
            size = 0;
        }

        public bool IsFull
        {
            get
            {
                return size == capacity;
            }
        }

        public bool IsEmpty
        {
            get
            {
                return size == 0;
            }
        }

        public int Size
        {
            get
            {
                return size;
            }
        }

        public int Capacity
        {
            get
            {
                return capacity;
            }
        }

        public bool InsertFront(int value)
        {
            if (IsFull)
            {
                return false;
            }

            head = (head - 1 + capacity) % capacity;
            array[head] = value;
            size++;
            return true;
        }

        public bool InsertRear(int value)
        {
            if (IsFull)
            {
                return false;
            }

            array[tail] = value;
            tail = (tail + 1) % capacity;
            size++;
            return true;
        }

        public (bool success, int value) DeleteFront()
        {
            if (IsEmpty)
            {
                return (false, 0);
            }

            int value = array[head];
            array[head] = 0; // Для наочності візуалізації
            head = (head + 1) % capacity;
            size--;
            return (true, value);
        }

        public (bool success, int value) DeleteRear()
        {
            if (IsEmpty)
            {
                return (false, 0);
            }

            tail = (tail - 1 + capacity) % capacity;
            int value = array[tail];
            array[tail] = 0;
            size--;
            return (true, value);
        }

        // Метод для отримання копії масиву 
        public int[] GetRawArray()
        {
            return (int[])array.Clone();
        }

        public int GetHead()
        {
            return head;
        }

        public int GetTail()
        {
            return tail;
        }
    }
}