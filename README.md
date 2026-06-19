# Algorithms and Data Structures Labs

Навчальний репозиторій з лабораторними роботами з дисципліни АСД. Основна мова реалізації — C# (`.NET`), окремо для `LAB6` додано веб-візуалізатор для демонстрації дерев.

## Структура

- `LAB1` — задачі на масиви та порівняння підходів пошуку.
- `LAB3` — консольний проєкт лабораторної роботи 3.
- `LAB4` — дек, черга на стеках, стек на чергах, `SetOfStacks`, додаткові задачі.
- `LAB5` — бінарні дерева: обходи, `TreeMinimum`, `TreeMaximum`, `TreePredecessor`, `TreeInsert`.
- `LAB6` — BST, AVL та Red-Black Tree: пошук, вставка, видалення, повороти, демонстраційні меню.
- `lab6-visualizer` — статичний візуалізатор сценаріїв для тем з дерев.

## Збірка

Потрібен встановлений .NET SDK.

```bash
dotnet build LAB1/labs_datastructures.sln
dotnet build LAB3/LAB3.csproj
dotnet build LAB4/LAB4.csproj
dotnet build LAB5/LAB5.csproj
dotnet build LAB6/LAB_6.csproj
```

## Візуалізатор LAB6

```bash
cd lab6-visualizer
python -m http.server 8080
```

Після запуску відкрийте `http://localhost:8080/`.

## Примітка

У репозиторії збережено фактичний стан лабораторних проєктів без зайвих службових артефактів збірки та чернеток.

## License

Проєкт поширюється за ліцензією MIT. Деталі — у файлі [LICENSE](LICENSE).
