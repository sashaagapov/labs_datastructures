# ADVANCED_LESSON_PLAN

## 0) Мета і рамки

**Мета:** створити `Advanced Study Mode` для складних тем LAB6, щоб студент міг не просто «проклікати» сценарій, а зрозуміти критичні місця алгоритму і підготуватися до захисту.

**Рамки:**
- Не переписувати існуючу архітектуру в нуль.
- Не ламати поточні BST/AVL/rotation сценарії.
- Не робити великий redesign UI.
- Додавати навчальний шар поверх наявного visualizer.

**Формат навчання для кожної складної теми:**
1. Інтуїція (навіщо це взагалі).
2. Що саме зазвичай ламає розуміння.
3. Ключові змінні і їх стани на кроці.
4. Покроковий trace з причинно-наслідковими поясненнями.
5. Інваріанти до/після кроку.
6. Типові помилки студента.
7. Checkpoint-питання.
8. Короткий defense summary.

---

## 1) Уніфікований шаблон теми (контракт для реалізації)

Для кожної advanced-теми в `data/advancedLessons.js` зберігати:
- `id`, `title`, `scenarioIds`.
- `whyHard`.
- `learningOutcomes`.
- `variablesToShow`: `root, x, y, z, parent, successor, uncle, grandparent, height, balance, color` (використовувати релевантну підмножину).
- `nodeHighlightRoles`: `current, parent, successor, uncle, grandparent, pivot, B-subtree, imbalanced, recolored, splay-target`.
- `stepBlueprint`: список обов’язкових логічних кроків.
- `checkpointQuestions`: питання на розуміння причин, а не термінів.
- `defenseSummary`: 5-8 тез, які студент може сказати усно.

---

## A) Transplant

### 1. Назва теми
`Transplant(u, v): заміна піддерева u піддеревом v`

### 2. Чому тема складна
- Студенти плутають «перемістити вузол» і «переприв’язати посилання батька».
- Часто неочевидно, чому `u` не може бути `null`, а `v` може.
- Незрозуміло, що `Transplant` не завершує delete-операцію сам по собі.

### 3. Що студент має зрозуміти
- «Поставити `v` на місце `u`» означає змінити посилання **в батька `u`** (або `root`, якщо `u` був корінь).
- `u` не nullable: без `u` немає «місця», яке замінюємо.
- `v` nullable: ми можемо видаляти вузол і залишати порожнечу.
- `root` може змінитися, якщо `u` був коренем.
- Оновлення `parent` для `v` обов’язкове, якщо `v != null`.
- `Transplant` **не** під’єднує `u.left/u.right` до `v` автоматично.

### 4. Які змінні показувати
`root, u(current), v, parent`

### 5. Які вузли підсвічувати
`current(u), parent, root, moved-subtree(v)`

### 6. Які steps потрібні
1. Зафіксувати `u`, `v`, `u.parent`, і чи `u` є `root/left/right` дитиною.
2. Якщо `u.parent == null` → `root = v`.
3. Інакше якщо `u` лівий син → `u.parent.left = v`.
4. Інакше → `u.parent.right = v`.
5. Якщо `v != null` → `v.parent = u.parent`.
6. Явно підкреслити: `u.left/u.right` не чіпали.

### 7. Які checkpoint questions потрібні
- Чому `u` не може бути `null`, а `v` може?
- У якому кроці може змінитися `root`?
- Яка помилка станеться, якщо не оновити `v.parent`?
- Що саме **не робить** `Transplant`?

### 8. Який defense summary потрібен
- `Transplant` — локальна операція переприв’язки місця `u`.
- Вона змінює тільки зв’язок «батько → дитина» і `v.parent`.
- Вона не переносить автоматично дітей `u`.
- Використовується як базовий примітив у delete і rotation-суміжних кроках.

---

## B) BST Delete (two children)

### 1. Назва теми
`Delete(z) when z has two children`

### 2. Чому тема складна
- Багато умовних гілок і тимчасових станів.
- Студенти не розуміють, чому successor саме мінімум правого піддерева.
- Плутають випадки `y.parent == z` та `y.parent != z`.

### 3. Що студент має зрозуміти
- `z` — вузол для видалення, `y` — його inorder successor.
- `y = TreeMinimum(z.right)` забезпечує найменший ключ, більший за `z`.
- У successor не може бути `left` дитини.
- Якщо `y.parent != z`, треба спочатку витягнути `y` через `Transplant(y, y.right)`.
- Потім `y` займає місце `z` через `Transplant(z, y)`.
- `y.SetRight(z.right)` і `y.SetLeft(z.left)` відновлюють структуру піддерев.

### 4. Які змінні показувати
`root, z(current), y(successor), parent, successor`

### 5. Які вузли підсвічувати
`current(z), successor(y), parent, moved-subtree(y.right), root`

### 6. Які steps потрібні
1. Знайти `z`.
2. Підтвердити, що в `z` двоє дітей.
3. Обчислити `y = TreeMinimum(z.right)`.
4. Пояснити, чому `y.left == null`.
5. Гілка A: `y.parent == z`.
6. Гілка B: `y.parent != z` → `Transplant(y, y.right)`.
7. Після гілки B: `y.SetRight(z.right)` і оновити `parent` у правого піддерева.
8. `Transplant(z, y)`.
9. `y.SetLeft(z.left)` і оновити `parent` лівого піддерева.
10. Фінальна перевірка BST-інваріанта.

### 7. Які checkpoint questions потрібні
- Чому successor береться з `z.right`, а не `z.left`?
- Чому в successor гарантовано немає `left` дитини?
- Навіщо робити `Transplant(y, y.right)` перед `Transplant(z, y)` у гілці B?
- Що зламається, якщо пропустити `y.SetLeft(z.left)`?

### 8. Який defense summary потрібен
- Видалення з двома дітьми зводимо до заміни `z` на successor `y`.
- Successor мінімально більший за `z`, тому порядок BST зберігається.
- Ключова складність — коректно від’єднати `y` зі старого місця.
- `Transplant` робить переприв’язку місця, `SetLeft/SetRight` добудовують піддерева.

---

## C) Rotations (Left/Right) з B-піддеревом

### 1. Назва теми
`LeftRotate(x)` та `RightRotate(y)` із явним перенесенням B-піддерева

### 2. Чому тема складна
- Легко втратити B-піддерево або зламати `parent` links.
- Студенти запам’ятовують «картинку», але не умову порядку ключів.

### 3. Що студент має зрозуміти
- LeftRotate: `y = x.right`, `B = y.left`; `y` піднімається, `x` опускається, `B` стає `x.right`.
- RightRotate: `x = y.left`, `B = x.right`; `x` піднімається, `y` опускається, `B` стає `y.left`.
- В обох випадках порядок ключів не ламається, бо виконується `x < B < y`.
- `root` може змінитися.

### 4. Які змінні показувати
`root, x, y, parent, B`

### 5. Які вузли підсвічувати
`pivot, current, B-subtree, parent, root`

### 6. Які steps потрібні
1. Зафіксувати pivot (`x` для left, `y` для right).
2. Зчитати «піднімаємий» вузол (`y` або `x`).
3. Виділити B-піддерево.
4. Переприв’язати дитину pivot на B.
5. Підняти вузол на місце pivot (через replace-at-parent / transplant-подібний крок).
6. Опустити pivot як протилежну дитину.
7. Оновити `parent` посилання.
8. Пояснити, чому BST-порядок збережений (`x < B < y`).

### 7. Які checkpoint questions потрібні
- Куди переходить B у left rotate? у right rotate?
- Чому B не можна «загубити»?
- У якому випадку rotation міняє `root`?
- Який інваріант доводить, що ключі лишилися впорядкованими?

### 8. Який defense summary потрібен
- Rotation змінює форму, але не inorder-послідовність.
- B-піддерево — критичний переносний фрагмент.
- Найтиповіша помилка — не оновити `parent` або не перенести B.

---

## D) AVL Insert + LL/RR/LR/RL

### 1. Назва теми
`AVL Insert: BST insert + rebalance`

### 2. Чому тема складна
- Дві фази в одному алгоритмі: вставка і балансування.
- Плутаються ознаки LL/RR/LR/RL та single/double rotation.

### 3. Що студент має зрозуміти
- Спочатку завжди звичайна BST-вставка.
- Далі підйом назад до `root`, оновлення `height`.
- `balance = h(left) - h(right)`, допустимі значення `-1,0,1`.
- Перша незбалансована вершина визначає тип rotation.
- LL/RR — single rotation, LR/RL — double rotation.

### 4. Які змінні показувати
`root, inserted(z), parent, height, balance, x, y`

### 5. Які вузли підсвічувати
`inserted, imbalanced, pivot, parent, root`

### 6. Які steps потрібні
1. BST insert нового вузла `z`.
2. Підйом вгору: перерахунок `height`.
3. На кожному вузлі обчислити `balance`.
4. Знайти перший `imbalanced` вузол.
5. Визначити патерн LL/RR/LR/RL за напрямками спуску.
6. Виконати single/double rotation.
7. Перерахувати `height` після rotation.
8. Підтвердити `balance ∈ {-1,0,1}` на критичному шляху.

### 7. Які checkpoint questions потрібні
- Чому шукаємо **перший** незбалансований вузол знизу-вгору?
- Як відрізнити LR від LL на конкретному прикладі?
- Чому LR/RL потребують двох rotation?
- Чому після fix-up висота стабілізується локально?

### 8. Який defense summary потрібен
- AVL вставка = BST-вставка + локальне відновлення балансу.
- Критерій дисбалансу: `|balance| > 1`.
- Тип випадку визначається траєкторією (left-left, left-right, right-right, right-left).

---

## E) Red-Black Insert (загальна логіка)

### 1. Назва теми
`RB-Insert + FixUp`

### 2. Чому тема складна
- Багато правил кольорів і симетричних кейсів.
- Плутаються ролі `uncle` і `grandparent`.

### 3. Що студент має зрозуміти
- Вставка йде як у BST, новий вузол додається `red`.
- `root` завжди має бути `black`.
- `red` вузол не може мати `red parent`.
- Якщо `uncle` червоний → recoloring.
- Якщо `uncle` чорний/`null` → rotation + recoloring.
- Fix-up обмежує висоту дерева, тому структура лишається приблизно збалансованою.

### 4. Які змінні показувати
`root, z(current), parent, grandparent, uncle, color`

### 5. Які вузли підсвічувати
`current, parent, grandparent, uncle, pivot, recolored, root`

### 6. Які steps потрібні
1. BST-insert `z` як `red`.
2. Поки `parent(z)` червоний: аналіз side + `uncle`.
3. Case 1 (`uncle red`): recolor `parent`, `uncle`, `grandparent`; підняти `z` вгору.
4. Case 2/3 (`uncle black/null`): rotation(и) навколо `grandparent` + recolor.
5. В кінці: `root.color = black`.

### 7. Які checkpoint questions потрібні
- Чому новий вузол додаємо саме `red`?
- Чому case `uncle red` вирішується recoloring без rotation?
- Коли потрібна подвійна комбінація rotation?
- Який інваріант RB перевіряється в кінці завжди?

### 8. Який defense summary потрібен
- RB insert зберігає BST-порядок і RB-інваріанти через локальні виправлення.
- Ключова розвилка: колір `uncle`.
- Recoloring «підіймає проблему» вгору, rotation «переструктуровує» локально.

---

## F) RB приклад вставки: 41, 38, 31, 12, 19, 8

### 1. Назва теми
`RB Insert Worked Example: 41, 38, 31, 12, 19, 8`

### 2. Чому тема складна
- Без повного trace важко побачити, як чергуються recoloring і rotation.

### 3. Що студент має зрозуміти
- Рішення залежить від локального триплета `z-parent-grandparent` і `uncle`.
- Один приклад проходить майже всі ключові кейси.

### 4. Які змінні показувати
`z, parent, grandparent, uncle, root, color`

### 5. Які вузли підсвічувати
`current(z), parent, grandparent, uncle, recolored, pivot, root`

### 6. Які steps потрібні (по кожній вставці)
1. **Insert 41**
- Додано `41(red)` як root.
- Fix-up: root -> `black`.
- Конфліктів `red-red` немає.

2. **Insert 38**
- `parent=41(black)`.
- Конфліктів немає, tree валідне.

3. **Insert 31**
- `parent=38(red)`, `grandparent=41(black)`, `uncle=null(black)`.
- `red-red` конфлікт є.
- Case uncle black + line (LL) -> `RightRotate(41)` + recolor.
- Після fix-up: `38(black)` стає вище.

4. **Insert 12**
- `parent=31(red)`, `grandparent=38(black)`, `uncle=41(red)`.
- Case uncle red -> recolor `31,41 -> black`, `38 -> red`, далі root -> black.

5. **Insert 19**
- `parent=12(red)`, `grandparent=31(black)`, `uncle=null(black)`.
- Triangle (LR): спочатку `LeftRotate(12)`, потім `RightRotate(31)` + recolor.

6. **Insert 8**
- `parent=12(red)`, `grandparent=19(black)`, `uncle=31(red)`.
- Case uncle red -> recolor; можлива повторна перевірка вище.
- Завершення: `root` чорний, інваріанти виконані.

### 7. Які checkpoint questions потрібні
- На якому кроці вперше з’явився case uncle red?
- Чому для `19` потрібні дві rotation (LR), а не одна?
- Після якого кроку змінився корінь?
- Де recoloring «підняв» проблему вище без локального повороту?

### 8. Який defense summary потрібен
- На фіксованій послідовності видно всі ключові механізми RB fix-up.
- `uncle red` і `uncle black` дають принципово різні дії.
- Rotation + recoloring разом відновлюють властивості без повного перебудування дерева.

---

## G) Splay Tree (Zig / Zig-Zig / Zig-Zag)

### 1. Назва теми
`Splay після доступу: підняти вузол до root`

### 2. Чому тема складна
- Алгоритм не тримає жорсткий баланс як AVL/RB, тому студентам здається «хаотичним».
- Важко запам’ятати різницю Zig, Zig-Zig, Zig-Zag.

### 3. Що студент має зрозуміти
- Після доступу до вузла робимо splay і піднімаємо його в root.
- Це оптимізує майбутні доступи до «гарячих» ключів.
- Zig: один rotation (коли parent — root).
- Zig-Zig: два rotation одного напряму.
- Zig-Zag: два rotation різних напрямів.
- Коректні `parent` links критично важливі.

### 4. Які змінні показувати
`root, splay-target(z), parent, grandparent, x, y`

### 5. Які вузли підсвічувати
`splay-target, parent, grandparent, pivot, root`

### 6. Які steps потрібні
1. Знайти/доступитися до `z`.
2. Поки `z.parent != null`, визначати випадок Zig / Zig-Zig / Zig-Zag.
3. Виконувати відповідні rotation(и).
4. Після кожного кроку оновлювати parent links і root.
5. Завершення: `z` став root.

### 7. Які checkpoint questions потрібні
- Коли застосовується Zig, а коли Zig-Zig?
- Чому Zig-Zag вимагає поворотів у різні боки?
- Що станеться, якщо parent links неповні/некоректні?
- Яка практична користь splay у послідовних доступах?

### 8. Який defense summary потрібен
- Splay — self-adjusting підхід: адаптується до патерну доступів.
- Вузол запиту піднімається до root через локальні rotation.
- Ефект: часто запитувані вузли стають ближчими до кореня.

---

## 2) Checkpoint strategy (спільна для всіх advanced-тем)

Формат checkpoint-питань:
- 1 питання на інтуїцію («чому так?»).
- 1 питання на стан змінних у конкретному кроці.
- 1 питання на інваріант.
- 1 питання на типову помилку.

Критерій якості питання:
- Перевіряє причинність, а не факт з пам’яті.
- Має пояснення правильної відповіді у 2-4 реченнях.

---

## 3) Defense summary strategy (спільна для всіх advanced-тем)

Для кожної теми зберігати 5-8 коротких тез:
- Що робить алгоритм.
- Який інваріант зберігає.
- Де найризикованіший крок.
- Чому саме такий порядок дій.
- Що буде, якщо пропустити критичний крок.

---

## 4) Мінімальний план реалізації (4 етапи)

1. **Додати `data/advancedLessons.js` без зміни алгоритмів.**
- Описати теми A-G у структурі з цього плану.
- Прив’язати кожну тему до наявних/майбутніх scenario id.

2. **Додати Advanced Study panel у UI.**
- Панель із блоками: `why hard`, `variables`, `critical step`, `checkpoint`, `defense summary`.
- Рендер тільки навчальних метаданих; логіку дерева не чіпати.

3. **Додати Red-Black Insert visualizer.**
- Окремі сценарії RB insert + fix-up.
- Підсвітка `parent/uncle/grandparent/recolored/pivot`.
- Окремий сценарій для послідовності `41,38,31,12,19,8`.

4. **Додати Splay visualizer.**
- Сценарії Zig / Zig-Zig / Zig-Zag.
- Наголос на parent links і послідовності rotation.
- Інтеграція у той самий Advanced Study panel без нового каркаса.
