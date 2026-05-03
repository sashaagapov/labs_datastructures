# Lab6 Tree Visualizer — Поточний стан

## 1) Як запустити
- Перейти в папку проєкту:
  - `cd C:\Users\sasha\OneDrive\Desktop\University\АСД\labs_datastructures\lab6-visualizer`
- Підняти локальний сервер (будь-який статичний):
  - `python -m http.server 8080`
- Відкрити в браузері:
  - `http://localhost:8080/`

Опційно для smoke-тестів:
- `node test_explanations.js`
- `node test_defense.js`

## 2) Які теми зараз працюють
- BST Search
- BST Delete (leaf / one child / two children)
- LeftRotate
- RightRotate
- AVL Insert
- AVL cases: LL / RR / LR / RL

## 3) Які режими є
- Верхні mode-кнопки: `Learn`, `Trace`, `Defense`, `Debug`
- Рівні пояснення: `Коротко` / `Детально` / `Глибоко`
- Defense Mode: кнопка `🛡 Захист` + панель тез

## 4) Що перевірено
- Сторінка відкривається, модулі вантажаться (HTTP 200 для `/`, `main.js`, `data/*`, `core/*`)
- Працює відкриття visualizer зі списку тем
- Працюють контроли: `Step`, `Previous`, `Play`, `Reset`
- Працюють ключові сценарії:
  - BST Search
  - BST Delete two children
  - LeftRotate with B-subtree
  - AVL LR
- Працює перемикач `Short / Medium / Deep`
- Працює `Defense Mode` і мапінг підказок до сценаріїв
- Консоль без критичних JS помилок (допустимий `favicon 404`)

## 5) Що залишилось на майбутнє
- Додати тему Red-Black Trees
- Додати тему Splay Trees
- Розширити quiz checkpoints (більш детальні контрольні точки/етапи)
