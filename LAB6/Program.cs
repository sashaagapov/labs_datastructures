
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
            Console.InputEncoding = System.Text.Encoding.UTF8;
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            if (args.Length > 0 && args[0] == "--self-check")
            {
                ValidationRunner.Run();
                return;
            }

            try
            {
                Console.Clear();
            }
            catch (IOException)
            {
                // Non-interactive environments may not support Clear().
            }
            Service.Welcome();
            Menu.Run();
        }
    }
}
