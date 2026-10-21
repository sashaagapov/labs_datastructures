# Lab 6 tree visualizer

A browser companion to the [C# tree lab](../LAB6/Menu.cs). It presents predefined tree scenarios and interactive explanations; the [topic list](data/topics.js) and [scenarios](data/scenarios.js) are readable on GitHub.

The topics cover BST search, deletion and transplant; left and right rotations; AVL balancing cases; and red-black insertion and deletion. The interface offers Learn, Trace, Defense and Debug modes. This page is separate from the C# console project.

To use it locally, serve this directory over HTTP and open the shown address:

```bash
cd lab6-visualizer
python -m http.server 8080
```

Open `http://localhost:8080/`. A local server is needed because the page loads JavaScript modules.

[Back to all labs](../README.md).
