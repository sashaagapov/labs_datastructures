# Algorithms and Data Structures: C# labs

Console projects for searching, string matching, linear data structures, and trees. Lab 6 also has a browser visualizer for walking through tree operations.

## A concrete example

Lab 3's built-in case searches `abcabeabcabcabd` for `abcabd`. A console run of the comparison option produced:

```text
SimpleSearch comparisons: 27
KMP comparisons:          17
Simple search: found at index 9
KMP:           found at index 9
```

These are the counts printed for that fixed input by [Lab 3's source](LAB3/Program.cs), not runtime benchmarks. The excerpt translates the program's Ukrainian labels; the values are from the run.

The [worked examples for Labs 1, 3, 4, 5, and 6](docs/WORKED_EXAMPLES.md) show source-derived inputs and results, clearly labeled as examples rather than captured runs. The [Lab 6 visualizer](lab6-visualizer/index.html) shows operations step by step when served locally. Its [scenario definitions](lab6-visualizer/data/scenarios.js) and [topic list](lab6-visualizer/data/topics.js) can be inspected on GitHub without starting a server.

## Find a lab or feature

| Lab | Direct paths |
| --- | --- |
| [1 — search methods](LAB1/README.md) | [Configurable array search](LAB1/lab1_ds_finding_beta/Program.cs), [fixed-size comparison](LAB1/lab1_ds_maximum_beta/Program.cs), [repeated search](LAB1/lab1_ds_futuremain/Program.cs) |
| [3 — substring search](LAB3/Program.cs) | Straightforward search, KMP and comparison counts in one console program |
| [4 — linear structures](LAB4/Program.cs) | [Array deque](LAB4/MyDeque.cs), [queue using stacks](LAB4/MyQueueOnStacks.cs), [stack using queues](LAB4/MyStacksOnQueues.cs), [set of stacks](LAB4/SetOfStacks.cs), [bracket checking, queue merging and visible buildings](LAB4/ExtraTasks.cs) |
| [5 — binary trees](LAB5/Menu.cs) | [Tree construction](LAB5/RecursiveTree.Insert.cs), [preorder/postorder](LAB5/RecursiveTree.Traversals.cs), [iterative inorder](LAB5/RecursiveTree.IterativeInOrder.cs), [minimum/maximum](LAB5/RecursiveTree.MinMax.cs), [predecessor](LAB5/RecursiveTree.Predecessor.cs) |
| [6 — tree operations](LAB6/Menu.cs) | [BST search/delete/rotations](LAB6/Menu.Bst.cs), [AVL insert/search/delete and rotation demos](LAB6/Menu.Avl.cs), [red-black insert/delete demos](LAB6/Menu.RedBlack.cs), [interval-tree left rotation](LAB6/IntervalTreeDemo.cs), [browser visualizer](lab6-visualizer/README.md) |

The repository contains Labs 1 and 3–6; there is no Lab 2 project here. Most C# console prompts are in Ukrainian. Lab 6's console tree menus are in English.

## Run locally

Install the .NET 10 SDK. From the repository root, run a project by its file path:

```bash
dotnet run --project LAB3/LAB3.csproj
dotnet run --project LAB4/LAB4.csproj
dotnet run --project LAB5/LAB5.csproj
dotnet run --project LAB6/LAB_6.csproj
```

Lab 1 has three separate projects; see its [project guide](LAB1/README.md). To open the visualizer, follow the [visualizer instructions](lab6-visualizer/README.md).

## License

[MIT](LICENSE).
