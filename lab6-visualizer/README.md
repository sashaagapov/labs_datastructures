# LAB6 Tree Visualizer

Допоміжний статичний візуалізатор для лабораторної роботи 6 з деревами.

## Запуск

```bash
cd lab6-visualizer
python -m http.server 8080
```

Після запуску відкрийте:

`http://localhost:8080/`

## Що є у візуалізаторі

- BST: пошук, видалення, повороти.
- AVL: вставка, LL / RR / LR / RL сценарії.
- Red-Black Tree: вставка та `DeleteFixup` demo.
- Режими `Learn`, `Trace`, `Defense`, `Debug`.

Візуалізатор є допоміжною частиною до `LAB6` і не потрібен для збірки C# проєктів.
