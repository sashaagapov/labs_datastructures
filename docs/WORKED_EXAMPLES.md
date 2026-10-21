# Worked examples

These are small, deterministic examples derived from the linked source and menu scenarios. They are **not captured console transcripts or timing measurements**. Run the projects to see their full interactive output.

| Lab | Input or operation | Result to look for | Source |
| --- | --- | --- | --- |
| 1 | The fixed-size comparison builds `0..99,999` and searches for `99,999` | The target is at zero-based array index **99,999**. Elapsed times vary by machine. | [Fixed-size search program](../LAB1/lab1_ds_maximum_beta/Program.cs) |
| 3 | Search `abcabeabcabcabd` for `abcabd` | The match starts at zero-based index **9**. The menu can run both straightforward and KMP search on this input. | [String search program](../LAB3/Program.cs) |
| 4 | Insert front `10`, insert rear `20`, then delete front from a deque of capacity 2 | The deque holds `[10, 20]` before deletion; the removed value is **10**, leaving `[20]`. | [Deque implementation](../LAB4/MyDeque.cs) · [Menu](../LAB4/Program.cs) |
| 5 | Insert `20`, `10`, `30` into a binary search tree and traverse in order | The visited keys are **10, 20, 30**. The menu also exposes preorder, postorder, minimum, maximum, and predecessor tasks. | [BST insertion](../LAB5/RecursiveTree.Insert.cs) · [Iterative inorder](../LAB5/RecursiveTree.IterativeInOrder.cs) |
| 6 | Choose the AVL `LL` demo with insertion order `30, 20, 10` | A right rotation makes **20** the root, with **10** and **30** as children. The console menu includes LL, RR, LR, and RL cases. | [AVL menu](../LAB6/Menu.Avl.cs) · [Rotations](../LAB6/AvlTree.Rotations.cs) |

For more tree cases, see the [visualizer's predefined scenarios](../lab6-visualizer/data/scenarios.js). They are example inputs for the browser companion, not saved output from the C# console program.
