/**
 * core/validation.js
 * Функції для перевірки інваріантів дерева.
 */

export function validateBST(root) {
  const violations = [];
  
  function check(node, min, max) {
    if (!node) return;
    
    if (min !== null && node.value <= min) {
      violations.push(`Node ${node.value} <= min limit ${min}`);
    }
    if (max !== null && node.value >= max) {
      violations.push(`Node ${node.value} >= max limit ${max}`);
    }
    
    check(node.left, min, node.value);
    check(node.right, node.value, max);
  }
  
  check(root, null, null);
  
  return {
    ok: violations.length === 0,
    message: violations.length === 0 ? "BST invariant holds" : "BST invariant violated",
    violations
  };
}

export function validateParentLinks(root) {
  const violations = [];
  
  function check(node, expectedParent) {
    if (!node) return;
    
    if (node.parent !== expectedParent) {
      const parentVal = node.parent ? node.parent.value : 'null';
      const expectedVal = expectedParent ? expectedParent.value : 'null';
      violations.push(`Node ${node.value} has parent ${parentVal}, expected ${expectedVal}`);
    }
    
    check(node.left, node);
    check(node.right, node);
  }
  
  check(root, null);
  
  return {
    ok: violations.length === 0,
    message: violations.length === 0 ? "Parent links invariant holds" : "Parent links invariant violated",
    violations
  };
}

export function computeHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(computeHeight(node.left), computeHeight(node.right));
}

export function validateHeights(root) {
  const violations = [];
  
  function check(node) {
    if (!node) return;
    
    const expectedHeight = computeHeight(node);
    if (node.height !== expectedHeight) {
      violations.push(`Node ${node.value} height is ${node.height}, expected ${expectedHeight}`);
    }
    
    check(node.left);
    check(node.right);
  }
  
  check(root);
  
  return {
    ok: violations.length === 0,
    message: violations.length === 0 ? "Heights invariant holds" : "Heights invariant violated",
    violations
  };
}

export function validateBalanceFactors(root) {
  const violations = [];
  
  function check(node) {
    if (!node) return;
    
    const leftHeight = computeHeight(node.left);
    const rightHeight = computeHeight(node.right);
    const expectedBalance = leftHeight - rightHeight;
    
    // In tree.js, node.balanceFactor might be updated
    if (node.balanceFactor !== undefined && node.balanceFactor !== expectedBalance) {
      violations.push(`Node ${node.value} balanceFactor is ${node.balanceFactor}, expected ${expectedBalance}`);
    }
    
    if (expectedBalance < -1 || expectedBalance > 1) {
      violations.push(`Node ${node.value} has balance ${expectedBalance} (not in {-1, 0, 1})`);
    }
    
    check(node.left);
    check(node.right);
  }
  
  check(root);
  
  return {
    ok: violations.length === 0,
    message: violations.length === 0 ? "Balance factors invariant holds" : "Balance factors invariant violated",
    violations
  };
}

export function validateAVL(root) {
  const bst = validateBST(root);
  const parents = validateParentLinks(root);
  const heights = validateHeights(root);
  const balances = validateBalanceFactors(root);
  
  const ok = bst.ok && parents.ok && heights.ok && balances.ok;
  
  const violations = [
    ...bst.violations,
    ...parents.violations,
    ...heights.violations,
    ...balances.violations
  ];
  
  return {
    ok,
    message: ok ? "AVL invariant holds" : "AVL invariant violated",
    violations,
    details: {
      bst,
      parents,
      heights,
      balances
    }
  };
}

export function buildInvariantStatus(root, scenarioType, phase) {
  const status = {};
  let hasDanger = false;
  let hasWarning = false;

  const bst = validateBST(root);
  status.bst = { ok: bst.ok, message: bst.message };
  if (!bst.ok) hasDanger = true;

  const parents = validateParentLinks(root);
  status.parentLinks = { ok: parents.ok, message: parents.message };
  if (!parents.ok) hasDanger = true;

  if (scenarioType === "avl") {
    const heights = validateHeights(root);
    status.heights = { ok: heights.ok, message: heights.message };
    if (!heights.ok) hasDanger = true;

    const balance = validateBalanceFactors(root);
    const expected = phase === "final" || phase === "balanced";
    
    if (!balance.ok) {
      if (expected) {
        status.balance = { ok: false, message: balance.message, expected: false };
        hasDanger = true; // Unexpected imbalance
      } else {
        status.balance = { 
          ok: false, 
          message: "AVL balance тимчасово порушений — це очікувано перед rotation.", 
          expected: true 
        };
        hasWarning = true; // Expected educational imbalance
      }
    } else {
      status.balance = { ok: true, message: balance.message, expected: true };
    }
    
    status.avl = { 
      ok: heights.ok && balance.ok, 
      message: heights.ok && balance.ok ? "AVL invariant holds" : "AVL invariant violated",
      expected
    };

  } else if (scenarioType === "rotate") {
    status.rotation = { ok: true, message: "Rotation має зберігати BST invariant." };
  }

  status.overall = hasDanger ? "danger" : (hasWarning ? "warning" : "ok");

  return status;
}
