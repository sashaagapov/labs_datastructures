
namespace agapovlab6
{
    /// <summary>
    /// Головний клас програми.
    /// </summary>
    class Program
    {
        /// <summary>
        /// Точка входу в програму.
        /// </summary>
        /// <param name="args">Аргументи командного рядка</param>
        static void Main(string[] args)
        {
            Console.Clear();
            Service.Welcome();
            Menu.Run();
        }
    }
}
