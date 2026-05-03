export class TreeNode {
  constructor(value) {
    this.id = nodeId(value);
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 1;
    this.balanceFactor = 0;
  }
}

export function nodeId(value) {
  return `n${value}`;
}

export function valueOf(node) {
  return node ? node.value : null;
}

export function buildBst(values) {
  const tree = {
    root: null,
    nodes: new Map()
  };

  values.forEach((value) => insertPlain(tree, value));
  recomputeAll(tree);
  return tree;
}

export function insertPlain(tree, value) {
  const node = new TreeNode(value);
  tree.nodes.set(node.id, node);

  if (!tree.root) {
    tree.root = node;
    return node;
  }

  let current = tree.root;
  let parent = null;

  while (current) {
    parent = current;
    current = value < current.value ? current.left : current.right;
  }

  node.parent = parent;

  if (value < parent.value) {
    parent.left = node;
  } else {
    parent.right = node;
  }

  recomputeAll(tree);
  return node;
}

export function find(tree, value) {
  return tree.nodes.get(nodeId(value)) ?? null;
}

export function setLeft(parent, child) {
  parent.left = child;
  if (child) {
    child.parent = parent;
  }
}

export function setRight(parent, child) {
  parent.right = child;
  if (child) {
    child.parent = parent;
  }
}

export function replaceAtParent(tree, oldNode, newNode) {
  const parent = oldNode.parent;

  if (!parent) {
    tree.root = newNode;
  } else if (parent.left === oldNode) {
    parent.left = newNode;
  } else if (parent.right === oldNode) {
    parent.right = newNode;
  }

  if (newNode) {
    newNode.parent = parent;
  }
}

export function detachFromParent(tree, node) {
  if (!node.parent) {
    tree.root = null;
    return;
  }

  if (node.parent.left === node) {
    node.parent.left = null;
  } else if (node.parent.right === node) {
    node.parent.right = null;
  }

  node.parent = null;
}

export function transplant(tree, oldNode, newNode) {
  replaceAtParent(tree, oldNode, newNode);
  return tree.root;
}

export function treeMinimum(node) {
  let current = node;
  while (current.left) {
    current = current.left;
  }
  return current;
}

export function recomputeAll(tree) {
  const seen = new Set();

  function height(node) {
    if (!node || seen.has(node.id)) {
      return node ? node.height : 0;
    }

    seen.add(node.id);
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);
    node.height = Math.max(leftHeight, rightHeight) + 1;
    node.balanceFactor = leftHeight - rightHeight;
    return node.height;
  }

  if (tree.root) {
    height(tree.root);
  }

  tree.nodes.forEach((node) => {
    if (!seen.has(node.id)) {
      height(node);
    }
  });
}

export function serializeTree(tree, detachedRootIds = []) {
  recomputeAll(tree);

  const nodes = {};
  tree.nodes.forEach((node) => {
    nodes[node.id] = {
      id: node.id,
      value: node.value,
      left: node.left ? node.left.id : null,
      right: node.right ? node.right.id : null,
      parent: node.parent ? node.parent.id : null,
      height: node.height,
      balanceFactor: node.balanceFactor
    };
  });

  return {
    rootId: tree.root ? tree.root.id : null,
    detachedRootIds: detachedRootIds.filter((id) => id && id !== (tree.root && tree.root.id)),
    nodes
  };
}
