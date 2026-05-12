import { codes } from "./data/codes.js";
import { scenarioDefinitions } from "./data/scenarios.js";
import { topicDefinitions } from "./data/topics.js";
import { quizDefinitions } from "./data/quizzes.js";
import { defenseHints } from "./data/defenseHints.js";
import { advancedLessons } from "./data/advancedLessons.js";

import {
  TreeNode,
  buildBst,
  insertPlain,
  find,
  setLeft,
  setRight,
  replaceAtParent,
  transplant,
  treeMinimum,
  recomputeAll,
  serializeTree
} from "./core/tree.js";

import {
  validateBST,
  validateParentLinks,
  computeHeight,
  validateHeights,
  validateBalanceFactors,
  validateAVL,
  buildInvariantStatus
} from "./core/validation.js";

const homeScreen = document.getElementById("homeScreen");
const visualizerScreen = document.getElementById("visualizerScreen");
const topicGrid = document.getElementById("topicGrid");
const resetProgressLink = document.getElementById("resetProgressLink");
const backToTopicsBtn = document.getElementById("backToTopicsBtn");
const sidebarNav = document.getElementById("sidebarNav");
const activeTopicTitle = document.getElementById("activeTopicTitle");
const scenarioSelect = document.getElementById("scenarioSelect");
const customFields = document.getElementById("customFields");
const customError = document.getElementById("customError");
const treeSvg = document.getElementById("treeSvg");
const treeTitle = document.getElementById("treeTitle");
const codeBlock = document.getElementById("codeBlock");
const explanationText = document.getElementById("explanationText");
const invariantBox = document.getElementById("invariantBox");
const variablesTable = document.getElementById("variablesTable");
const explanationLevelToggle = document.getElementById("explanationLevelToggle");
const defenseModeToggle = document.getElementById("defenseModeToggle");
const defenseHintCard = document.getElementById("defenseHintCard");
const defenseHintText = document.getElementById("defenseHintText");
const prevBtn = document.getElementById("prevBtn");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const quizBtn = document.getElementById("quizBtn");
const stepCounter = document.getElementById("stepCounter");
const quizOverlay = document.getElementById("quizOverlay");
const quizTitle = document.getElementById("quizTitle");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizNextBtn = document.getElementById("quizNextBtn");
const quizCloseBtn = document.getElementById("quizCloseBtn");

// Advanced Study UI
const advancedStudyScreen = document.getElementById("advancedStudyScreen");
const advancedStudyBtn = document.getElementById("advancedStudyBtn");
const backFromAdvancedBtn = document.getElementById("backFromAdvancedBtn");
const advancedSidebarNav = document.getElementById("advancedSidebarNav");
const advancedLessonTitle = document.getElementById("advancedLessonTitle");
const advancedLessonContent = document.getElementById("advancedLessonContent");
const advPrevBtn = document.getElementById("advPrevBtn");
const advNextBtn = document.getElementById("advNextBtn");
const advProgress = document.getElementById("advProgress");

const progressStorageKey = "lab6viz_progress";

let currentTopic = null;
let currentScenario = null;
let steps = [];
let currentIndex = 0;
let playTimer = null;
let explanationLevel = "medium";
let defenseModeEnabled = false;
let appMode = "trace"; // learn | trace | defense | debug
let progressState = readProgress();
let quizState = null;

function valueOf(node) {
  return node ? node.value : null;
}

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressStorageKey) || "{}");
  } catch {
    return {};
  }
}

function writeProgress() {
  try {
    localStorage.setItem(progressStorageKey, JSON.stringify(progressState));
  } catch {
    // Якщо браузер блокує localStorage, візуалізатор усе одно працює без прогресу.
  }
}

function progressLabel(status) {
  if (status === "done") {
    return "Переглянуто ✓";
  }

  if (status === "in-progress") {
    return "В процесі";
  }

  return "Не переглянуто";
}

function markProgress(topicKey, status) {
  if (!topicKey || progressState[topicKey] === "done") {
    return;
  }

  progressState[topicKey] = status;
  writeProgress();
  renderProgressUi();
}

function topicIcon(type) {
  const icons = {
    tree: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8v48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="14" r="8" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="18" cy="34" r="8" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="46" cy="34" r="8" fill="none" stroke="currentColor" stroke-width="4"/><path d="M32 22 18 26m14-4 14 4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
    rotateLeft: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M42 14H24a14 14 0 0 0 0 28h18" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M28 6 18 14l10 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="44" cy="42" r="7" fill="none" stroke="currentColor" stroke-width="4"/></svg>`,
    rotateRight: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 14h18a14 14 0 0 1 0 28H22" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="m36 6 10 8-10 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="42" r="7" fill="none" stroke="currentColor" stroke-width="4"/></svg>`,
    balance: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 10v44M18 22h28M18 22l-9 18h18L18 22Zm28 0-9 18h18l-9-18Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  return icons[type] ?? icons.tree;
}

function renderHome() {
  topicGrid.innerHTML = "";

  topicDefinitions.forEach((topic) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "topic-card";
    card.style.setProperty("--accent", topic.accent);
    card.dataset.topic = topic.key;
    card.innerHTML = `
      ${topicIcon(topic.icon)}
      <h2>${topic.name}</h2>
      <p>${topic.description}</p>
      <div class="topic-meta">
        <span class="topic-badge">${topic.badge}</span>
        <span class="progress-badge ${progressState[topic.key] || "todo"}">${progressLabel(progressState[topic.key])}</span>
      </div>
    `;
    card.addEventListener("click", () => openTopic(topic.key));
    topicGrid.appendChild(card);
  });
}

function renderSidebar() {
  sidebarNav.innerHTML = "";
  const groups = [...new Set(topicDefinitions.map((topic) => topic.navGroup))];

  groups.forEach((groupName) => {
    const group = document.createElement("section");
    group.className = "sidebar-group";

    const title = document.createElement("p");
    title.className = "sidebar-group-title";
    title.textContent = groupName;
    group.appendChild(title);

    topicDefinitions
      .filter((topic) => topic.navGroup === groupName)
      .forEach((topic) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `sidebar-topic${currentTopic && currentTopic.key === topic.key ? " active" : ""}`;
        button.dataset.topic = topic.key;
        button.innerHTML = `<span class="progress-dot ${progressState[topic.key] || "todo"}"></span><span>${topic.shortName}</span>`;
        button.addEventListener("click", () => openTopic(topic.key));
        group.appendChild(button);
      });

    sidebarNav.appendChild(group);
  });
}

function renderProgressUi() {
  renderHome();
  renderSidebar();
}

function showHome() {
  stopPlay();
  quizOverlay.classList.add("hidden");
  visualizerScreen.classList.add("hidden");
  if (advancedStudyScreen) advancedStudyScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  renderProgressUi();
}

function showVisualizer() {
  homeScreen.classList.add("hidden");
  if (advancedStudyScreen) advancedStudyScreen.classList.add("hidden");
  visualizerScreen.classList.remove("hidden");
}

function showAdvancedStudy() {
  stopPlay();
  homeScreen.classList.add("hidden");
  visualizerScreen.classList.add("hidden");
  if (advancedStudyScreen) advancedStudyScreen.classList.remove("hidden");
  renderAdvancedSidebar();
}

let currentAdvLesson = null;
let currentAdvSectionIndex = 0;

function renderAdvancedSidebar() {
  if (!advancedSidebarNav) return;
  advancedSidebarNav.innerHTML = "";
  advancedLessons.forEach((lesson) => {
    const btn = document.createElement("button");
    btn.className = `sidebar-topic${currentAdvLesson && currentAdvLesson.id === lesson.id ? " active" : ""}`;
    btn.dataset.lessonId = lesson.id;
    btn.innerHTML = `<span class="progress-dot ${progressState['adv_' + lesson.id] || "todo"}"></span><span>${lesson.title}</span>`;
    btn.addEventListener("click", () => openAdvancedLesson(lesson));
    advancedSidebarNav.appendChild(btn);
  });
}

function openAdvancedLesson(lesson) {
  currentAdvLesson = lesson;
  currentAdvSectionIndex = 0;
  markProgress('adv_' + lesson.id, "in-progress");
  renderAdvancedSidebar();
  renderAdvancedContent();
}

function renderAdvancedContent() {
  if (!currentAdvLesson || !advancedLessonContent) return;
  
  advancedLessonTitle.textContent = currentAdvLesson.title;
  const section = currentAdvLesson.sections[currentAdvSectionIndex];
  
  advProgress.textContent = `Частина ${currentAdvSectionIndex + 1} / ${currentAdvLesson.sections.length}`;
  
  advPrevBtn.disabled = currentAdvSectionIndex === 0;
  advNextBtn.disabled = currentAdvSectionIndex === currentAdvLesson.sections.length - 1;
  
  if (currentAdvSectionIndex === currentAdvLesson.sections.length - 1) {
    markProgress('adv_' + currentAdvLesson.id, "done");
    renderAdvancedSidebar();
  }

  let html = `<h2 style="color: var(--orange-soft); margin-bottom: 16px;">${section.title}</h2>`;
  html += `<p style="font-size: 16px; line-height: 1.6;">${section.text}</p>`;
  
  if (section.type === "checkpoint") {
    html += `
      <div style="margin-top: 24px; padding: 16px; background: rgba(167, 139, 250, 0.1); border: 1px solid rgba(167, 139, 250, 0.4); border-radius: 8px;">
        <h3 style="color: var(--purple); margin-bottom: 12px;">Питання:</h3>
        <p style="font-size: 16px; margin-bottom: 16px;">${section.question}</p>
        <button id="showAnswerBtn" class="primary" style="padding: 8px 16px; border-radius: 6px; background: #17243a; color: #fff; border: 1px solid var(--purple); cursor: pointer;">Показати відповідь</button>
        <div id="answerBox" class="hidden" style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(167, 139, 250, 0.3);">
          <p style="font-size: 16px; color: #e0f2fe;">${section.answer}</p>
        </div>
      </div>
    `;
  } else if (section.type === "visualizer") {
    html += `
      <div style="margin-top: 24px;">
        <button id="openScenarioBtn" class="primary" style="padding: 10px 20px; border-radius: 8px; border: 1px solid #d97706; background: linear-gradient(180deg, #f59e0b, #d97706); color: #111827; font-weight: 800; cursor: pointer;">Відкрити у візуалізаторі</button>
      </div>
    `;
  }
  
  advancedLessonContent.innerHTML = html;
  
  if (section.type === "checkpoint") {
    document.getElementById("showAnswerBtn").addEventListener("click", (e) => {
      document.getElementById("answerBox").classList.remove("hidden");
      e.target.classList.add("hidden");
    });
  } else if (section.type === "visualizer") {
    document.getElementById("openScenarioBtn").addEventListener("click", () => {
      openVisualizerScenario(section.scenarioId);
    });
  }
}

function openVisualizerScenario(scenarioId) {
  let targetTopic = null;
  for (const topic of topicDefinitions) {
    if (topic.scenarioIds && topic.scenarioIds.includes(scenarioId)) {
      targetTopic = topic;
      break;
    }
  }
  
  if (targetTopic) {
    openTopic(targetTopic.key);
    scenarioSelect.value = scenarioId;
    scenarioSelect.dispatchEvent(new Event("change"));
  } else {
    console.warn("Scenario not found in topics:", scenarioId);
  }
}

function firstSentence(text) {
  const source = String(text ?? "").trim();
  const match = source.match(/[^.!?]+[.!?]/);
  return match ? match[0].trim() : source;
}

function buildDeepExplanation(mediumText, invariantText) {
  const base = String(mediumText ?? "").trim();
  const invariant = String(invariantText ?? "").trim();
  if (!base) {
    return invariant;
  }

  if (!invariant) {
    return base;
  }

  return `${base} Invariant detail: ${invariant}`;
}

function toNodeId(candidate) {
  if (!candidate) {
    return null;
  }

  if (typeof candidate === "string") {
    return candidate;
  }

  if (typeof candidate === "number") {
    return `n${candidate}`;
  }

  if (typeof candidate === "object" && typeof candidate.id === "string") {
    return candidate.id;
  }

  return null;
}

function normalizeRoleName(role) {
  const normalized = String(role ?? "").trim().toLowerCase();
  const map = {
    current: "role-current",
    node: "role-current",
    parent: "role-parent",
    grandparent: "role-grandparent",
    uncle: "role-uncle",
    conflict: "role-conflict",
    recolored: "role-recolored",
    successor: "role-successor",
    "b-subtree": "role-b-subtree",
    bsubtree: "role-b-subtree",
    "rotation-pivot": "role-rotation-pivot",
    rotationpivot: "role-rotation-pivot",
    imbalanced: "role-imbalanced",
    inserted: "role-inserted",
    root: "role-root",
    "moved-subtree": "role-moved-subtree",
    movedsubtree: "role-moved-subtree"
  };

  if (map[normalized]) {
    return map[normalized];
  }

  return normalized.startsWith("role-") ? normalized : `role-${normalized}`;
}

function addRole(bucket, nodeIdValue, role) {
  if (!nodeIdValue || !role) {
    return;
  }

  const normalizedRole = normalizeRoleName(role);
  if (!bucket[nodeIdValue]) {
    bucket[nodeIdValue] = [];
  }

  if (!bucket[nodeIdValue].includes(normalizedRole)) {
    bucket[nodeIdValue].push(normalizedRole);
  }
}

function resolveActiveNodeIds(options) {
  const ids = [];
  (options.activeNodeIds ?? []).forEach((entry) => {
    const id = toNodeId(entry);
    if (id) {
      ids.push(id);
    }
  });

  (options.activeNodes ?? []).forEach((entry) => {
    const id = toNodeId(entry);
    if (id) {
      ids.push(id);
    }
  });

  return [...new Set(ids)];
}

function resolveNodeRoles(options, activeNodeIds, rootId) {
  const roles = {};

  const explicit = options.nodeRoles;
  if (explicit && typeof explicit === "object") {
    Object.entries(explicit).forEach(([key, value]) => {
      const nodeIdValue = toNodeId(key) || toNodeId(value);
      if (!nodeIdValue) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((role) => addRole(roles, nodeIdValue, role));
      } else if (typeof value === "string") {
        addRole(roles, nodeIdValue, value);
      }
    });
  }

  if (Object.keys(roles).length === 0) {
    activeNodeIds.forEach((id) => addRole(roles, id, "current"));
  }

  if (rootId && (!roles[rootId] || roles[rootId].length === 0)) {
    addRole(roles, rootId, "root");
  }

  return roles;
}

function extractNodeColors(tree) {
  const nodeColors = {};
  if (!tree?.nodes) {
    return nodeColors;
  }

  tree.nodes.forEach((node) => {
    if (node?.color === "red" || node?.color === "black") {
      nodeColors[node.id] = node.color;
    }
  });

  return nodeColors;
}

function inferScenarioType(options) {
  if (options.validationContext?.scenarioType) {
    return options.validationContext.scenarioType;
  }

  if (options.showAvlLabels) {
    return "avl";
  }

  const operationLabel = String(options.operationLabel ?? "").toLowerCase();
  if (operationLabel.includes("rotate")) {
    return "rotate";
  }

  return "bst";
}

function inferValidationPhase(options, scenarioType) {
  if (options.validationContext?.phase) {
    return options.validationContext.phase;
  }

  if (scenarioType === "avl") {
    return options.finalStep ? "final" : "intermediate";
  }

  return "final";
}

function collectUnexpectedValidationWarnings(validationContext, scenarioType, phase) {
  const issues = [];

  if (!validationContext || typeof validationContext !== "object") {
    return issues;
  }

  if (validationContext.bst && validationContext.bst.ok === false) {
    issues.push("BST invariant broken");
  }

  if (validationContext.parentLinks && validationContext.parentLinks.ok === false) {
    issues.push("Parent links broken");
  }

  if (scenarioType === "avl" && (phase === "final" || phase === "balanced")) {
    if (validationContext.avl && validationContext.avl.ok === false) {
      issues.push("Final AVL state broken");
    }
  }

  return issues;
}

function addStep(targetSteps, tree, options = {}) {
  try {
    recomputeAll(tree);
  } catch {
    // Keep step generation resilient for partial states.
  }

  const explanationMedium = options.explanationMedium ?? options.explanationNormal ?? options.explanation ?? "";
  const invariant = options.invariant ?? "BST ??????? ?????????: ????? < ????? < ??????.";
  const scenarioType = inferScenarioType(options);
  const phase = inferValidationPhase(options, scenarioType);
  const validationContext = options.validationContext ?? buildInvariantStatus(tree.root, scenarioType, phase);
  const invariantStatus = options.invariantStatus ?? validationContext?.overall ?? "ok";

  const activeNodeIds = resolveActiveNodeIds(options);
  const nodeRoles = resolveNodeRoles(options, activeNodeIds, tree.root?.id ?? null);

  const step = {
    treeSnapshot: serializeTree(tree, options.detachedRootIds ?? []),
    nodeColors: options.nodeColors ?? extractNodeColors(tree),
    activeNodeIds,
    activeNodes: options.activeNodes ?? activeNodeIds,
    nodeRoles,
    codeLine: options.codeLine ?? options.highlightedCodeLine ?? 0,
    highlightedCodeLine: options.highlightedCodeLine ?? options.codeLine ?? 0,
    variables: options.variables ?? {},
    explanation: explanationMedium,
    explanationShort: options.explanationShort ?? firstSentence(explanationMedium),
    explanationMedium,
    explanationNormal: explanationMedium,
    explanationDeep: options.explanationDeep ?? buildDeepExplanation(explanationMedium, invariant),
    invariant,
    invariantStatus,
    validationContext,
    operationLabel: options.operationLabel ?? null,
    showAvlLabels: Boolean(options.showAvlLabels),
    quiz: options.quiz ?? null
  };

  targetSteps.push(step);

  const warnReasons = collectUnexpectedValidationWarnings(validationContext, scenarioType, phase);
  if (warnReasons.length > 0) {
    console.warn(`[validation] ${warnReasons.join('; ')}`, {
      scenarioType,
      phase,
      variables: step.variables
    });
  }
}

function generateSearchScenario(values = [20, 10, 30, 5, 15], target = 15) {
  const tree = buildBst(values);
  const steps = [];
  let current = tree.root;
  let parent = null;

  addStep(steps, tree, {
    activeNodeIds: current ? [current.id] : [],
    nodeRoles: current ? { [current.id]: "current" } : {},
    codeLine: 0,
    variables: { node: valueOf(current), parent: null, target, root: valueOf(tree.root) },
    explanation: `Починаємо BST-пошук значення ${target} з кореня ${valueOf(tree.root)}. Це потрібно, бо правило BST гарантує, що всі менші значення лежать ліворуч, а всі більші — праворуч; після цього кроку поточним вузлом стає root.`,
    invariant: "BST інваріант: ліве піддерево < вузол < праве піддерево ✓"
  });

  while (current) {
    addStep(steps, tree, {
      activeNodeIds: [current.id],
      nodeRoles: parent
        ? {
            [current.id]: "current",
            [parent.id]: "parent"
          }
        : {
            [current.id]: "current"
          },
      codeLine: 2,
      variables: { node: current.value, parent: valueOf(parent), target, root: valueOf(tree.root) },
      explanation: `Порівнюємо target = ${target} із поточним вузлом ${current.value}. Це потрібно, щоб зрозуміти, чи знайдено значення, чи можна відкинути одну половину дерева; після цього кроку алгоритм або завершується, або обирає напрямок руху.`,
      invariant: "BST інваріант дозволяє не перевіряти обидва піддерева одночасно ✓"
    });

    if (current.value === target) {
      addStep(steps, tree, {
        activeNodeIds: [current.id],
        nodeRoles: parent
          ? {
              [current.id]: "current",
              [parent.id]: "parent"
            }
          : {
              [current.id]: "current"
            },
        codeLine: 3,
        variables: { node: `${current.value} ← знайдено`, parent: valueOf(parent), target, root: valueOf(tree.root) },
        explanation: `Значення знайдено: node.Value дорівнює target = ${target}. Це завершує BST-пошук, бо алгоритм повертає перший вузол із потрібним значенням; після цього кроку результатом є вузол ${current.value}.`,
        invariant: "BST інваріант: знайдений вузол лежить на єдиному коректному шляху пошуку ✓"
      });
      return steps;
    }

    parent = current;
    if (target < current.value) {
      current = current.left;
      addStep(steps, tree, {
        activeNodeIds: current ? [parent.id, current.id] : [parent.id],
        nodeRoles: current
          ? {
              [current.id]: "current",
              [parent.id]: "parent"
            }
          : {
              [parent.id]: "parent"
            },
        codeLine: 5,
        variables: { node: valueOf(current), parent: parent.value, target, root: valueOf(tree.root) },
        explanation: `target = ${target} менший за ${parent.value}, тому переходимо в ліве піддерево. Це потрібно, бо всі значення праворуч від ${parent.value} більші за нього і не можуть дорівнювати target; після цього кроку node вказує на ${formatValue(valueOf(current))}.`,
        invariant: `BST інваріант: target(${target}) < parent(${parent.value}), отже рух ліворуч коректний ✓`
      });
    } else {
      current = current.right;
      addStep(steps, tree, {
        activeNodeIds: current ? [parent.id, current.id] : [parent.id],
        nodeRoles: current
          ? {
              [current.id]: "current",
              [parent.id]: "parent"
            }
          : {
              [parent.id]: "parent"
            },
        codeLine: 6,
        variables: { node: valueOf(current), parent: parent.value, target, root: valueOf(tree.root) },
        explanation: `target = ${target} більший за ${parent.value}, тому переходимо в праве піддерево. Це потрібно, бо всі значення ліворуч від ${parent.value} менші за нього і не можуть дорівнювати target; після цього кроку node вказує на ${formatValue(valueOf(current))}.`,
        invariant: `BST інваріант: target(${target}) > parent(${parent.value}), отже рух праворуч коректний ✓`
      });
    }
  }

  addStep(steps, tree, {
    nodeRoles: parent ? { [parent.id]: "parent" } : {},
    codeLine: 2,
    variables: { node: null, parent: valueOf(parent), target, root: valueOf(tree.root) },
    explanation: `Поточний node став null, тому значення ${target} не знайдено в дереві. Це означає, що коректний шлях пошуку закінчився без збігу; після цього кроку алгоритм повертає null.`,
    invariant: "BST інваріант: якщо шлях завершився null, такого значення в дереві немає ✓"
  });

  return steps;
}

function generateLeftRotateScenario() {
  const tree = buildBst([40, 20, 60, 50, 70]);
  const steps = [];
  const x = find(tree, 40);
  const y = x.right;
  const b = y.left;

  addStep(steps, tree, {
    activeNodeIds: [x.id],
    nodeRoles: {
      [x.id]: "rotation-pivot"
    },
    codeLine: 0,
    variables: { x: 40, y: null, B: null, root: 40 },
    explanation: "Початковий стан: x = 40 є коренем піддерева, яке треба повернути вліво, бо правий син y = 60 має піднятися вище без порушення BST-порядку. Після цього кроку вказівники ще не змінені, ми лише визначили вузол, навколо якого буде поворот.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "rotation-pivot",
      [y.id]: "current"
    },
    codeLine: 2,
    variables: { x: 40, y: 60, B: 50, root: 40 },
    explanation: "Зберігаємо y = x.Right, тобто y стає вузол 60. Це потрібно, бо саме правий син x підніматиметься на місце x під час лівого повороту, а результатом цього кроку є зафіксована змінна y для наступних перепідключень.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  y.left = null;
  y.parent = null;
  setRight(x, b);
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id, b.id],
    nodeRoles: {
      [x.id]: "rotation-pivot",
      [y.id]: "current",
      [b.id]: "b-subtree"
    },
    codeLine: 4,
    variables: { x: 40, y: 60, B: 50, root: 40 },
    explanation: "Виконуємо x.SetRight(y.Left): вузол B = 50 переходить із лівого посилання y у праве посилання x. Це необхідно, бо B більший за x, але менший за y, тому після повороту він має бути правим сином x; у результаті x.Right уже вказує на 50.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  y.parent = x.parent;
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "rotation-pivot",
      [y.id]: "current"
    },
    codeLine: 5,
    variables: { x: 40, y: "60, Parent = null", B: 50, root: 40 },
    explanation: "Виконуємо y.Parent = x.Parent: батьківський вказівник y стає таким самим, як був у x. Це потрібно, щоб y міг зайняти позицію x у батьківській ієрархії; після цього y уже готовий стати новою вершиною піддерева.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  replaceAtParent(tree, x, y);
  x.parent = null;
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "rotation-pivot",
      [y.id]: "current"
    },
    codeLine: 6,
    variables: { x: 40, y: 60, B: 50, root: "60 ← новий root" },
    explanation: "Виконуємо ReplaceParentChild(root, x, y): оскільки x був коренем, root перемикається з 40 на 60. Це потрібно, щоб дерево тримало зверху вузол y, і після цього кроку саме 60 стає новим коренем піддерева.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  setLeft(y, x);
  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "rotation-pivot",
      [y.id]: "current"
    },
    codeLine: 7,
    variables: { x: 40, y: 60, B: 50, root: 60 },
    explanation: "Виконуємо y.SetLeft(x): вузол x = 40 стає лівим сином y = 60. Це потрібно, бо всі значення під x менші за y, і після цього кроку лівий поворот завершено: 60 зверху, 40 ліворуч, B = 50 праворуч від 40.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  return steps;
}

function generateRightRotateScenario() {
  const tree = buildBst([60, 40, 70, 20, 50]);
  const steps = [];
  const y = find(tree, 60);
  const x = y.left;
  const b = x.right;

  addStep(steps, tree, {
    activeNodeIds: [y.id],
    nodeRoles: {
      [y.id]: "rotation-pivot"
    },
    codeLine: 0,
    variables: { x: null, y: 60, B: null, root: 60 },
    explanation: "Початковий стан: y = 60 є коренем піддерева, яке треба повернути вправо, бо лівий син x = 40 має піднятися вище без порушення BST-порядку. Після цього кроку вказівники ще не змінені.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "current",
      [y.id]: "rotation-pivot"
    },
    codeLine: 2,
    variables: { x: 40, y: 60, B: 50, root: 60 },
    explanation: "Зберігаємо x = y.Left, тобто x стає вузол 40. Це потрібно, бо саме лівий син y підніматиметься на місце y під час правого повороту, а результатом цього кроку є зафіксована змінна x для наступних перепідключень.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  x.right = null;
  x.parent = null;
  setLeft(y, b);
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id, b.id],
    nodeRoles: {
      [x.id]: "current",
      [y.id]: "rotation-pivot",
      [b.id]: "b-subtree"
    },
    codeLine: 4,
    variables: { x: 40, y: 60, B: 50, root: 60 },
    explanation: "Виконуємо y.SetLeft(x.Right): вузол B = 50 переходить із правого посилання x у ліве посилання y. Це необхідно, бо B більший за x, але менший за y, тому після повороту він має бути лівим сином y; у результаті y.Left уже вказує на 50.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  x.parent = y.parent;
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "current",
      [y.id]: "rotation-pivot"
    },
    codeLine: 5,
    variables: { x: "40, Parent = null", y: 60, B: 50, root: 60 },
    explanation: "Виконуємо x.Parent = y.Parent: батьківський вказівник x стає таким самим, як був у y. Це потрібно, щоб x міг зайняти позицію y у батьківській ієрархії; після цього x готовий стати новою вершиною піддерева.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  replaceAtParent(tree, y, x);
  y.parent = null;
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "current",
      [y.id]: "rotation-pivot"
    },
    codeLine: 6,
    variables: { x: 40, y: 60, B: 50, root: "40 ← новий root" },
    explanation: "Виконуємо ReplaceParentChild(root, y, x): оскільки y був коренем, root перемикається з 60 на 40. Це потрібно, щоб дерево тримало зверху вузол x, і після цього кроку саме 40 стає новим коренем піддерева.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  setRight(x, y);
  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "current",
      [y.id]: "rotation-pivot"
    },
    codeLine: 7,
    variables: { x: 40, y: 60, B: 50, root: 40 },
    explanation: "Виконуємо x.SetRight(y): вузол y = 60 стає правим сином x = 40. Це потрібно, бо всі значення під y більші за x, і після цього кроку правий поворот завершено: 40 зверху, 60 праворуч, B = 50 ліворуч від 60.",
    invariant: "BST інваріант: x(40) < B(50) < y(60) ✓"
  });

  return steps;
}

function generateDeleteLeafScenario() {
  const tree = buildBst([20, 10, 30]);
  const steps = [];
  const z = find(tree, 10);

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    nodeRoles: {
      [z.id]: "current"
    },
    codeLine: 0,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Знайдено z = 10, вузол для видалення, і його батьком є 20. Це потрібно зробити перед будь-яким Transplant, бо алгоритм має знати, яке саме посилання батька буде змінено; після цього кроку ми готові перевіряти дітей z.",
    invariant: "BST інваріант: 10 < parent(20) < 30 ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    codeLine: 2,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Перевіряємо z.Left == null і бачимо, що вузол 10 не має лівого сина; також його правий син дорівнює null. Це правило видалення листка: якщо дітей немає, то посилання батька можна переключити на null, і після цього z буде від'єднаний.",
    invariant: "BST інваріант: видалення листка не змінює порядок інших вузлів ✓"
  });

  transplant(tree, z, null);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [z.id],
    codeLine: 3,
    variables: { z: "10 ← вирізано", y: null, parent: "20.Left = null" },
    explanation: "Виконуємо Transplant(root, z, z.Right), де z.Right = null, тому посилання parent.Left перемикається з 10 на null. Це потрібно, щоб фізично вирізати листок із дерева, і після цього вузол 10 більше не належить основному BST.",
    invariant: "BST інваріант: у дереві лишилися 20 < 30 ✓"
  });

  return steps;
}

function generateDeleteOneChildScenario() {
  const tree = buildBst([20, 10, 30, 5]);
  const steps = [];
  const z = find(tree, 10);
  const child = z.left;

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    codeLine: 0,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Знайдено z = 10, вузол для видалення, і його батьком є 20. Це потрібно, щоб алгоритм знав, яке батьківське посилання буде перепідключене; після цього кроку перевіряємо, скільки дітей має z.",
    invariant: "BST інваріант: 5 < z(10) < parent(20) < 30 ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [z.id, child.id],
    codeLine: 4,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Перевірка показує, що z.Right == null, а z.Left = 5, тобто у вузла 10 є рівно один син. За правилом BST-видалення єдиний син може зайняти місце z, бо все піддерево 5 менше за parent = 20; після цього кроку готуємо Transplant(z, z.Left).",
    invariant: "BST інваріант: піддерево 5 повністю менше за parent(20) ✓"
  });

  transplant(tree, z, child);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [child.id, z.id],
    codeLine: 5,
    variables: { z: "10 ← вирізано", y: null, parent: "20.Left = 5" },
    explanation: "Виконуємо Transplant(root, z, z.Left): посилання parent.Left перемикається з 10 на 5. Це потрібно, щоб зберегти все піддерево єдиного сина, і після цього вузол 5 стоїть на місці видаленого z.",
    invariant: "BST інваріант: 5 < parent(20) < 30 ✓"
  });

  return steps;
}

function generateDeleteTwoChildrenScenario() {
  const tree = buildBst([20, 10, 30, 5, 15, 12]);
  const steps = [];
  const z = find(tree, 10);
  const y = treeMinimum(z.right);
  const yRight = y.right;
  const zLeft = z.left;
  const zRight = z.right;
  const yOldParent = y.parent;

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    codeLine: 0,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "Знайдено z = 10, вузол для видалення, і його батьком є 20. Це потрібно, щоб алгоритм знав, яку позицію в дереві треба замінити; після цього кроку ми бачимо, що z має ліве і праве піддерево.",
    invariant: "BST інваріант: 5 < z(10) < 12 < 15 < parent(20) < 30 ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [z.id, z.right.id],
    nodeRoles: {
      [z.id]: "current"
    },
    codeLine: 6,
    variables: { z: 10, y: null, parent: 20 },
    explanation: "z має двох дітей, тому просте вирізання зруйнувало б зв'язок із одним із піддерев. За правилом BST-видалення треба знайти successor = TreeMinimum(z.Right), бо саме найменший вузол правого піддерева може замінити z і зберегти порядок.",
    invariant: "BST інваріант: successor має бути більшим за все ліве піддерево z і не більшим за інші вузли правого піддерева ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [y.id],
    nodeRoles: {
      [z.id]: "current",
      [y.id]: "successor"
    },
    codeLine: 8,
    variables: { z: 10, y: 12, parent: 15 },
    explanation: "Successor y знайдено: це вузол 12, мінімум правого піддерева z. Це правильно, бо 12 є першим значенням після 10 в BST-порядку; після цього кроку y буде кандидатом на місце z.",
    invariant: "BST інваріант: 5 < z(10) < y(12) < 15 < 20 ✓"
  });

  transplant(tree, y, yRight);
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [y.id, yOldParent.id],
    nodeRoles: {
      [z.id]: "current",
      [y.id]: "successor"
    },
    codeLine: 11,
    variables: { z: 10, y: "12 ← вирізано зі старого місця", parent: "15.Left = null" },
    explanation: "Оскільки y.Parent != z, спочатку виконуємо Transplant(y, y.Right): посилання parent.Left у вузлі 15 перемикається з 12 на y.Right, тобто на null. Це потрібно, щоб successor не залишився одночасно у старому місці й на місці z; після цього y тимчасово від'єднаний.",
    invariant: "BST інваріант: після вирізання successor праве піддерево z усе ще впорядковане ✓"
  });

  setRight(y, zRight);
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [y.id, zRight.id],
    nodeRoles: {
      [z.id]: "current",
      [y.id]: "successor",
      [zRight.id]: "moved-subtree"
    },
    codeLine: 12,
    variables: { z: 10, y: "12.Right = 15", parent: 20 },
    explanation: "Виконуємо y.SetRight(z.Right): праве піддерево z, вузол 15, переходить під successor y = 12. Це потрібно, бо після заміни z вузол 12 має зберегти всі значення, які були праворуч від 10; після цього 15 уже є правим сином 12.",
    invariant: "BST інваріант: z(10) < y(12) < 15 ✓"
  });

  transplant(tree, z, y);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [z.id, y.id],
    nodeRoles: {
      [z.id]: "current",
      [y.id]: "successor"
    },
    codeLine: 14,
    variables: { z: "10 ← вирізано", y: "12 ← на місці z", parent: "20.Left = 12" },
    explanation: "Виконуємо Transplant(z, y): посилання parent.Left у вузлі 20 перемикається з 10 на successor 12. Це потрібно, щоб y фізично зайняв позицію z у дереві, і після цього вузол 10 уже не є частиною основного BST.",
    invariant: "BST інваріант: y(12) < parent(20), тому successor може стояти на місці z ✓"
  });

  setLeft(y, zLeft);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [y.id, zLeft.id],
    nodeRoles: {
      [y.id]: "successor",
      [zLeft.id]: "moved-subtree"
    },
    codeLine: 15,
    variables: { z: "10 ← вирізано", y: "12.Left = 5", parent: 20 },
    explanation: "Виконуємо y.SetLeft(z.Left): ліве піддерево z, вузол 5, переходить під successor y = 12. Це потрібно, бо всі значення лівого піддерева z менші за 12, і після цього y має обидва піддерева, потрібні для заміни z.",
    invariant: "BST інваріант: 5 < y(12) < 15 < parent(20) ✓"
  });

  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [y.id],
    nodeRoles: {
      [y.id]: "successor"
    },
    codeLine: 17,
    variables: { z: "10 ← більше не в дереві", y: "12 ← successor", parent: 20 },
    explanation: "Видалення завершено: z = 10 більше немає в основному дереві, а successor y = 12 стоїть на його місці. Це зберігає BST-правило, бо 5 лишився ліворуч від 12, 15 праворуч від 12, а 12 менший за 20.",
    invariant: "BST інваріант: 5 < y(12) < 15 < parent(20) < 30 ✓"
  });

  return steps;
}

function generateTransplantScenario() {
  const tree = buildBst([20, 10, 30, 5]);
  const steps = [];
  const u = find(tree, 10);
  const v = find(tree, 5);
  const oldParent = u.parent;

  addStep(steps, tree, {
    activeNodeIds: [u.id, v.id, oldParent.id],
    nodeRoles: {
      [u.id]: "current",
      [v.id]: "successor",
      [oldParent.id]: "parent"
    },
    codeLine: 0,
    variables: { u: 10, v: 5, "u.parent": valueOf(oldParent), root: valueOf(tree.root) },
    explanation: "Початковий стан для Transplant: u = 10, v = 5, а батько u — вузол 20. Це потрібно, щоб чітко визначити, яке саме посилання буде переприв'язане; після цього кроку алгоритм переходить до перевірки, де знаходиться u відносно свого батька.",
    invariant: "BST інваріант: v(5) < u(10) < parent(20) < 30 ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [u.id, oldParent.id],
    nodeRoles: {
      [u.id]: "current",
      [oldParent.id]: "parent"
    },
    codeLine: 4,
    variables: { u: 10, v: 5, branch: "u == u.Parent.Left", root: valueOf(tree.root) },
    explanation: "Перевірка гілки показує, що u є лівим сином свого батька, тому треба виконати саме u.Parent.SetLeft(v). Це важливо, бо Transplant змінює лише локальне батьківське посилання; після цього кроку визначено правильну гілку алгоритму.",
    invariant: "BST інваріант до переприв'язки збережено ✓"
  });

  transplant(tree, u, v);
  addStep(steps, tree, {
    activeNodeIds: [oldParent.id, v.id],
    nodeRoles: {
      [v.id]: "current",
      [oldParent.id]: "parent"
    },
    codeLine: 5,
    variables: { "20.Left": valueOf(oldParent.left), "v.parent": valueOf(v.parent), root: valueOf(tree.root) },
    explanation: "Виконуємо Transplant(u, v): посилання 20.Left змінюється з 10 на 5, тобто v займає місце u в основному дереві. Це і є головна ідея операції Transplant; після цього кроку вузол 5 стоїть у позиції, де раніше був 10.",
    invariant: "BST інваріант після локальної заміни місця збережено ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [v.id],
    nodeRoles: {
      [v.id]: "current"
    },
    codeLine: 9,
    variables: { "v.parent": valueOf(v.parent), root: valueOf(tree.root), note: "children of u not moved automatically" },
    explanation: "Окремо фіксуємо ключовий результат: v.Parent оновлено на колишнього батька вузла u. Водночас Transplant не переносить автоматично дітей u під v, тому в повному TreeDelete додатково виконують SetLeft/SetRight; після цього кроку базова операція завершена.",
    invariant: "BST інваріант збережено; Transplant виконано коректно ✓"
  });

  return steps;
}

function generateAvlScenario(caseName, sequence) {
  const tree = { root: null, nodes: new Map() };
  const steps = [];

  addStep(steps, tree, {
    codeLine: 0,
    variables: { sequence: `[${sequence.join(", ")}]`, root: null },
    explanation: `Починаємо AVL-вставку для сценарію ${caseName}: значення будуть вставлятися як у звичайне BST, а після кожної вставки ми підніматимемося назад до кореня. Це потрібно, бо AVL-дерево зберігає баланс у кожному вузлі; після цього кроку дерево ще порожнє і готове до першої вставки.`,
    invariant: "AVL інваріант: порожнє дерево збалансоване ✓",
    showAvlLabels: true
  });

  sequence.forEach((value, index) => {
    const inserted = insertPlain(tree, value);
    addStep(steps, tree, {
      activeNodeIds: [inserted.id],
      nodeRoles: {
        [inserted.id]: "inserted"
      },
      codeLine: 2,
      variables: { node: value, parent: valueOf(inserted.parent), root: valueOf(tree.root), height: inserted.height, "balance factor": signed(inserted.balanceFactor) },
      explanation: `Вставляємо ${value} як у звичайне BST: порівняння веде новий вузол у правильне місце за правилом лівий < вузол < правий. Це потрібно, щоб перед балансуванням не порушити порядок пошуку; після цього вузол ${value} уже фізично підключений до дерева.`,
      invariant: "BST інваріант після вставки збережено ✓",
      showAvlLabels: true
    });

    const path = pathToRoot(inserted);
    path.forEach((node) => {
      recomputeAll(tree);
      addStep(steps, tree, {
        activeNodeIds: [node.id],
        nodeRoles: Math.abs(node.balanceFactor) <= 1
          ? { [node.id]: "current" }
          : { [node.id]: ["current", "imbalanced"] },
        codeLine: 3,
        variables: { node: node.value, parent: valueOf(node.parent), root: valueOf(tree.root), height: node.height, "balance factor": signed(node.balanceFactor) },
        explanation: `Піднімаємося до вузла ${node.value} і перераховуємо його height та balance factor за формулою height = max(left, right) + 1. Це потрібно, бо вставка нижче могла змінити висоту піддерева; після цього біля вузла ${node.value} показано актуальні h=${node.height} і bf=${signed(node.balanceFactor)}.`,
        invariant: Math.abs(node.balanceFactor) <= 1
          ? `AVL інваріант: balance factor вузла ${node.value} = ${signed(node.balanceFactor)} ✓`
          : `⚠ Порушення: bf=${signed(node.balanceFactor)}, потрібне балансування`,
        invariantStatus: Math.abs(node.balanceFactor) <= 1 ? "ok" : "warning",
        showAvlLabels: true
      });
    });
  });

  const rootBefore = findUnbalancedRoot(tree);
  if (!rootBefore) {
    return steps;
  }
  const insertedNode = find(tree, sequence[sequence.length - 1]);

  if (caseName === "LL") {
    const leftChild = rootBefore.left;
    addAvlDecisionStep(steps, tree, {
      node: rootBefore,
      child: leftChild,
      inserted: insertedNode,
      caseName: "LL",
      codeLine: 6
    });
    addAvlCaseStep(steps, tree, rootBefore, 6, "LL", "Баланс вузла 30 = +2, тому ліве піддерево занадто важке. Новий вузол лежить у ліво-лівому напрямку, отже правило AVL вимагає один RightRotate; після цього 20 має піднятися над 30.");
    rightRotateDetailed(tree, rootBefore, steps, {
      lineMap: rightRotateLineMap(),
      showAvlLabels: true,
      label: "AVL LL"
    });
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "LL",
      lowerNode: find(tree, 30),
      subtreeRoot: find(tree, 20),
      inserted: insertedNode,
      codeLine: 7
    });
  }

  if (caseName === "RR") {
    const rightChild = rootBefore.right;
    addAvlDecisionStep(steps, tree, {
      node: rootBefore,
      child: rightChild,
      inserted: insertedNode,
      caseName: "RR",
      codeLine: 8
    });
    addAvlCaseStep(steps, tree, rootBefore, 8, "RR", "Баланс вузла 10 = -2, тому праве піддерево занадто важке. Новий вузол лежить у право-правому напрямку, отже правило AVL вимагає один LeftRotate; після цього 20 має піднятися над 10.");
    leftRotateDetailed(tree, rootBefore, steps, {
      lineMap: leftRotateLineMap(),
      showAvlLabels: true,
      label: "AVL RR"
    });
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "RR",
      lowerNode: find(tree, 10),
      subtreeRoot: find(tree, 20),
      inserted: insertedNode,
      codeLine: 9
    });
  }

  if (caseName === "LR") {
    const leftChild = rootBefore.left;
    addAvlDecisionStep(steps, tree, {
      node: rootBefore,
      child: leftChild,
      inserted: insertedNode,
      caseName: "LR",
      codeLine: 11
    });
    addAvlCaseStep(steps, tree, rootBefore, 11, "LR", "Баланс вузла 30 = +2, тому ліве піддерево занадто важке, але новий вузол прийшов у праву гілку лівого сина. Це випадок LR, тому спочатку треба виконати LeftRotate(leftChild), щоб перетворити форму на LL.");
    leftRotateDetailed(tree, leftChild, steps, {
      lineMap: leftRotateLineMap(),
      showAvlLabels: true,
      label: "AVL LR: перший поворот"
    });
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "LR (після 1-го повороту)",
      lowerNode: find(tree, 10),
      subtreeRoot: find(tree, 20),
      inserted: insertedNode,
      codeLine: 12
    });
    const newRoot = find(tree, 30);
    addStep(steps, tree, {
      activeNodeIds: [newRoot.id],
      codeLine: 12,
      variables: { node: 30, case: "LR", next: "RightRotate(30)", root: valueOf(tree.root), "balance factor": signed(newRoot.balanceFactor) },
      explanation: "Після першого повороту піддерево лівого сина вирівнялося так, що ситуація стала LL відносно вузла 30. Це потрібно для другого стандартного повороту; після цього кроку алгоритм переходить до RightRotate(30).",
      invariant: `⚠ Порушення: bf=${signed(newRoot.balanceFactor)}, потрібне балансування`,
      invariantStatus: "warning",
      showAvlLabels: true
    });
    rightRotateDetailed(tree, newRoot, steps, {
      lineMap: rightRotateLineMap(),
      showAvlLabels: true,
      label: "AVL LR: другий поворот"
    });
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "LR (після 2-го повороту)",
      lowerNode: find(tree, 30),
      subtreeRoot: find(tree, 20),
      inserted: insertedNode,
      codeLine: 13
    });
  }

  if (caseName === "RL") {
    const rightChild = rootBefore.right;
    addAvlDecisionStep(steps, tree, {
      node: rootBefore,
      child: rightChild,
      inserted: insertedNode,
      caseName: "RL",
      codeLine: 16
    });
    addAvlCaseStep(steps, tree, rootBefore, 16, "RL", "Баланс вузла 10 = -2, тому праве піддерево занадто важке, але новий вузол прийшов у ліву гілку правого сина. Це випадок RL, тому спочатку треба виконати RightRotate(rightChild), щоб перетворити форму на RR.");
    rightRotateDetailed(tree, rightChild, steps, {
      lineMap: rightRotateLineMap(),
      showAvlLabels: true,
      label: "AVL RL: перший поворот"
    });
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "RL (після 1-го повороту)",
      lowerNode: find(tree, 30),
      subtreeRoot: find(tree, 20),
      inserted: insertedNode,
      codeLine: 17
    });
    const newRoot = find(tree, 10);
    addStep(steps, tree, {
      activeNodeIds: [newRoot.id],
      codeLine: 17,
      variables: { node: 10, case: "RL", next: "LeftRotate(10)", root: valueOf(tree.root), "balance factor": signed(newRoot.balanceFactor) },
      explanation: "Після першого повороту піддерево правого сина вирівнялося так, що ситуація стала RR відносно вузла 10. Це потрібно для другого стандартного повороту; після цього кроку алгоритм переходить до LeftRotate(10).",
      invariant: `⚠ Порушення: bf=${signed(newRoot.balanceFactor)}, потрібне балансування`,
      invariantStatus: "warning",
      showAvlLabels: true
    });
    leftRotateDetailed(tree, newRoot, steps, {
      lineMap: leftRotateLineMap(),
      showAvlLabels: true,
      label: "AVL RL: другий поворот"
    });
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "RL (після 2-го повороту)",
      lowerNode: find(tree, 10),
      subtreeRoot: find(tree, 20),
      inserted: insertedNode,
      codeLine: 18
    });
  }

  addStep(steps, tree, {
    activeNodeIds: [tree.root.id],
    nodeRoles: {
      [tree.root.id]: "root"
    },
    codeLine: 19,
    variables: { node: valueOf(tree.root), parent: null, root: valueOf(tree.root), height: tree.root.height, "balance factor": signed(tree.root.balanceFactor) },
    explanation: `AVL-вставка завершена для сценарію ${caseName}: після поворотів коренем став вузол ${tree.root.value}. Це потрібно, щоб висоти лівого і правого піддерев знову відрізнялися не більше ніж на 1; після цього всі labels h/bf біля вузлів відповідають збалансованому дереву.`,
    invariant: `AVL інваріант: balance factor вузла ${tree.root.value} = ${signed(tree.root.balanceFactor)} ✓`,
    showAvlLabels: true,
    finalStep: true
  });

  return steps;
}

function pathToRoot(node) {
  const result = [];
  let current = node;

  while (current) {
    result.push(current);
    current = current.parent;
  }

  return result;
}

function findUnbalancedRoot(tree) {
  recomputeAll(tree);
  let result = null;

  tree.nodes.forEach((node) => {
    if (Math.abs(node.balanceFactor) > 1 && (!result || node.height > result.height)) {
      result = node;
    }
  });

  return result;
}

function addAvlCaseStep(steps, tree, node, codeLine, caseName, explanation) {
  addStep(steps, tree, {
    activeNodeIds: [node.id],
    nodeRoles: {
      [node.id]: ["imbalanced", "rotation-pivot"]
    },
    codeLine,
    variables: {
      node: node.value,
      case: caseName,
      height: node.height,
      "balance factor": signed(node.balanceFactor)
    },
    explanation,
    invariant: `⚠ Порушення: bf=${signed(node.balanceFactor)}, потрібне балансування`,
    invariantStatus: "warning",
    showAvlLabels: true
  });
}

function addAvlDecisionStep(steps, tree, options) {
  const node = options.node;
  const child = options.child ?? null;
  const inserted = options.inserted ?? null;
  const caseName = options.caseName;
  const bf = signed(node.balanceFactor);

  const roles = {
    [node.id]: ["imbalanced", "rotation-pivot"]
  };

  if (child) {
    roles[child.id] = "current";
  }

  if (inserted) {
    roles[inserted.id] = "inserted";
  }

  const explanations = {
    LL: `Визначення типу дисбалансу: у вузла ${node.value} balance factor = ${bf}, тобто ліве піддерево стало вищим. Вставка пішла в ліву гілку лівого сина (${child ? child.value : "?"}), тому це LL case. Виправлення: один RightRotate(${node.value}).`,
    RR: `Визначення типу дисбалансу: у вузла ${node.value} balance factor = ${bf}, тобто праве піддерево стало вищим. Вставка пішла в праву гілку правого сина (${child ? child.value : "?"}), тому це RR case. Виправлення: один LeftRotate(${node.value}).`,
    LR: `Визначення типу дисбалансу: у вузла ${node.value} balance factor = ${bf}, тобто ліве піддерево стало вищим. Але вставка пішла в праву гілку лівого сина (${child ? child.value : "?"}), тому це LR case. Одним RightRotate(${node.value}) це не виправляється. Виправлення: спочатку LeftRotate(${child ? child.value : "left child"}), потім RightRotate(${node.value}).`,
    RL: `Визначення типу дисбалансу: у вузла ${node.value} balance factor = ${bf}, тобто праве піддерево стало вищим. Але вставка пішла в ліву гілку правого сина (${child ? child.value : "?"}), тому це RL case. Одним LeftRotate(${node.value}) це не виправляється. Виправлення: спочатку RightRotate(${child ? child.value : "right child"}), потім LeftRotate(${node.value}).`
  };

  addStep(steps, tree, {
    activeNodeIds: [node.id, ...(child ? [child.id] : []), ...(inserted ? [inserted.id] : [])],
    nodeRoles: roles,
    codeLine: options.codeLine,
    variables: {
      node: node.value,
      inserted: valueOf(inserted),
      child: valueOf(child),
      case: caseName,
      "balance factor": bf,
      decision: explanations[caseName]
    },
    explanation: explanations[caseName],
    invariant: `⚠ Порушення: bf=${bf}, потрібне балансування`,
    invariantStatus: "warning",
    showAvlLabels: true
  });
}

function addAvlHeightUpdateStep(steps, tree, options) {
  const lowerNode = options.lowerNode ?? null;
  const subtreeRoot = options.subtreeRoot ?? null;
  const inserted = options.inserted ?? null;
  const caseName = options.caseName;

  const activeNodeIds = [];
  const nodeRoles = {};

  if (lowerNode) {
    activeNodeIds.push(lowerNode.id);
    nodeRoles[lowerNode.id] = "current";
  }

  if (subtreeRoot) {
    activeNodeIds.push(subtreeRoot.id);
    nodeRoles[subtreeRoot.id] = "rotation-pivot";
  }

  if (inserted) {
    activeNodeIds.push(inserted.id);
    nodeRoles[inserted.id] = "inserted";
  }

  addStep(steps, tree, {
    activeNodeIds,
    nodeRoles,
    codeLine: options.codeLine,
    variables: {
      case: caseName,
      lower: lowerNode ? `${lowerNode.value} (h=${lowerNode.height}, bf=${signed(lowerNode.balanceFactor)})` : "null",
      "new subtree root": subtreeRoot ? `${subtreeRoot.value} (h=${subtreeRoot.height}, bf=${signed(subtreeRoot.balanceFactor)})` : "null",
      root: valueOf(tree.root)
    },
    explanation: `Оновлення висот після повороту: зв'язки між вузлами змінилися, тому старі height вже неактуальні. Спочатку оновлюється нижній вузол, потім новий корінь піддерева; після цього balance factor повертається в нормальний діапазон [-1, 0, 1].`,
    invariant: subtreeRoot
      ? `AVL перевірка після повороту: bf(${subtreeRoot.value})=${signed(subtreeRoot.balanceFactor)}`
      : "AVL перевірка після повороту виконана",
    showAvlLabels: true
  });
}

function leftRotateLineMap() {
  return { save: 24, moveB: 26, parent: 27, replace: 28, finish: 29 };
}

function rightRotateLineMap() {
  return { save: 35, moveB: 37, parent: 38, replace: 39, finish: 40 };
}

function rotationInvariant(x, b, y) {
  if (b) {
    return `BST інваріант: x(${x.value}) < B(${b.value}) < y(${y.value}) ✓`;
  }

  return `BST інваріант: x(${x.value}) < y(${y.value}), B=null ✓`;
}

function leftRotateDetailed(tree, x, steps, options) {
  const y = x.right;
  const b = y ? y.left : null;
  const lines = options.lineMap ?? leftRotateLineMap();

  addStep(steps, tree, {
    activeNodeIds: y ? [x.id, y.id] : [x.id],
    nodeRoles: y
      ? {
          [x.id]: "rotation-pivot",
          [y.id]: "current"
        }
      : {
          [x.id]: "rotation-pivot"
        },
    codeLine: lines.save,
    variables: { x: x.value, y: valueOf(y), B: valueOf(b), T2: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: Крок 1 (до повороту). Поточний корінь піддерева — x=${x.value}, а вузол y=${valueOf(y)} (правий син x) підніматиметься вгору. У сценаріях AVL це відповідає ситуації, коли праве піддерево x занадто високе.`,
    invariant: y ? rotationInvariant(x, b, y) : "⚠ Порушення: у x немає правого сина, лівий поворот неможливий",
    invariantStatus: y ? "ok" : "warning",
    showAvlLabels: options.showAvlLabels
  });

  if (!y) {
    return;
  }

  y.left = null;
  y.parent = null;
  setRight(x, b);
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: b ? [x.id, y.id, b.id] : [x.id, y.id],
    nodeRoles: b
      ? {
          [x.id]: "rotation-pivot",
          [y.id]: "current",
          [b.id]: "b-subtree"
        }
      : {
          [x.id]: "rotation-pivot",
          [y.id]: "current"
        },
    codeLine: lines.moveB,
    variables: { x: x.value, y: y.value, B: valueOf(b), T2: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: Крок 2 (середнє піддерево T2). Беремо T2 = y.Left = ${formatValue(valueOf(b))} і переносимо його в x.Right. BST-порядок не ламається: всі ключі T2 більші за x, але менші за y.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  y.parent = x.parent;
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "rotation-pivot",
      [y.id]: "current"
    },
    codeLine: lines.parent,
    variables: { x: x.value, y: `${y.value}, Parent=${formatValue(valueOf(y.parent))}`, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо y.Parent = x.Parent, тобто y отримує того самого батька, якого мав x. Це потрібно, щоб y міг зайняти місце x у батьківській ієрархії; після цього кроку вертикальний зв'язок y із майбутнім батьком підготовлений.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  replaceAtParent(tree, x, y);
  x.parent = null;
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "rotation-pivot",
      [y.id]: "current"
    },
    codeLine: lines.replace,
    variables: { x: x.value, y: `${y.value} ← займає місце x`, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо ReplaceParentChild(x, y), тому батько піддерева тепер посилається на y замість x. Це потрібно, щоб верхівка піддерева стала коректною після повороту; після цього кроку y уже стоїть над x у зовнішньому дереві.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  setLeft(y, x);
  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "rotation-pivot",
      [y.id]: "current"
    },
    codeLine: lines.finish,
    variables: { x: x.value, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо y.SetLeft(x), тому x стає лівим сином y. Це фінальний технічний крок повороту перед підсумком перепідключення.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  addStep(steps, tree, {
    activeNodeIds: b ? [x.id, y.id, b.id] : [x.id, y.id],
    nodeRoles: b
      ? {
          [x.id]: "rotation-pivot",
          [y.id]: "current",
          [b.id]: "b-subtree"
        }
      : {
          [x.id]: "rotation-pivot",
          [y.id]: "current"
        },
    codeLine: lines.finish,
    variables: {
      "new subtree root": y.value,
      "old subtree root": x.value,
      T2: formatValue(valueOf(b)),
      "x.Right": formatValue(valueOf(x.right)),
      "y.Left": formatValue(valueOf(y.left))
    },
    explanation: `${options.label}: Крок 3 (перепідключення). y стає новим коренем піддерева, x стає лівим сином y, а T2 стає правим піддеревом x.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });
}

function rightRotateDetailed(tree, y, steps, options) {
  const x = y.left;
  const b = x ? x.right : null;
  const lines = options.lineMap ?? rightRotateLineMap();

  addStep(steps, tree, {
    activeNodeIds: x ? [x.id, y.id] : [y.id],
    nodeRoles: x
      ? {
          [x.id]: "current",
          [y.id]: "rotation-pivot"
        }
      : {
          [y.id]: "rotation-pivot"
        },
    codeLine: lines.save,
    variables: { x: valueOf(x), y: y.value, B: valueOf(b), T2: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: Крок 1 (до повороту). Поточний корінь піддерева — y=${y.value}, а вузол x=${valueOf(x)} (лівий син y) підніматиметься вгору. У сценаріях AVL це відповідає ситуації, коли ліве піддерево y занадто високе.`,
    invariant: x ? rotationInvariant(x, b, y) : "⚠ Порушення: у y немає лівого сина, правий поворот неможливий",
    invariantStatus: x ? "ok" : "warning",
    showAvlLabels: options.showAvlLabels
  });

  if (!x) {
    return;
  }

  x.right = null;
  x.parent = null;
  setLeft(y, b);
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: b ? [x.id, y.id, b.id] : [x.id, y.id],
    nodeRoles: b
      ? {
          [x.id]: "current",
          [y.id]: "rotation-pivot",
          [b.id]: "b-subtree"
        }
      : {
          [x.id]: "current",
          [y.id]: "rotation-pivot"
        },
    codeLine: lines.moveB,
    variables: { x: x.value, y: y.value, B: valueOf(b), T2: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: Крок 2 (середнє піддерево T2). Беремо T2 = x.Right = ${formatValue(valueOf(b))} і переносимо його в y.Left. BST-порядок не ламається: всі ключі T2 більші за x, але менші за y.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  x.parent = y.parent;
  addStep(steps, tree, {
    detachedRootIds: [x.id],
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "current",
      [y.id]: "rotation-pivot"
    },
    codeLine: lines.parent,
    variables: { x: `${x.value}, Parent=${formatValue(valueOf(x.parent))}`, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо x.Parent = y.Parent, тобто x отримує того самого батька, якого мав y. Це потрібно, щоб x міг зайняти місце y у батьківській ієрархії; після цього кроку вертикальний зв'язок x із майбутнім батьком підготовлений.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  replaceAtParent(tree, y, x);
  y.parent = null;
  addStep(steps, tree, {
    detachedRootIds: [y.id],
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "current",
      [y.id]: "rotation-pivot"
    },
    codeLine: lines.replace,
    variables: { x: `${x.value} ← займає місце y`, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо ReplaceParentChild(y, x), тому батько піддерева тепер посилається на x замість y. Це потрібно, щоб верхівка піддерева стала коректною після повороту; після цього кроку x уже стоїть над y у зовнішньому дереві.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  setRight(x, y);
  addStep(steps, tree, {
    activeNodeIds: [x.id, y.id],
    nodeRoles: {
      [x.id]: "current",
      [y.id]: "rotation-pivot"
    },
    codeLine: lines.finish,
    variables: { x: x.value, y: y.value, B: valueOf(b), root: valueOf(tree.root) },
    explanation: `${options.label}: виконуємо x.SetRight(y), тому y стає правим сином x. Це фінальний технічний крок повороту перед підсумком перепідключення.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });

  addStep(steps, tree, {
    activeNodeIds: b ? [x.id, y.id, b.id] : [x.id, y.id],
    nodeRoles: b
      ? {
          [x.id]: "current",
          [y.id]: "rotation-pivot",
          [b.id]: "b-subtree"
        }
      : {
          [x.id]: "current",
          [y.id]: "rotation-pivot"
        },
    codeLine: lines.finish,
    variables: {
      "new subtree root": x.value,
      "old subtree root": y.value,
      T2: formatValue(valueOf(b)),
      "y.Left": formatValue(valueOf(y.left)),
      "x.Right": formatValue(valueOf(x.right))
    },
    explanation: `${options.label}: Крок 3 (перепідключення). x стає новим коренем піддерева, y стає правим сином x, а T2 стає лівим піддеревом y.`,
    invariant: rotationInvariant(x, b, y),
    showAvlLabels: options.showAvlLabels
  });
}

function parseNumbers(text) {
  const values = String(text || "")
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value));

  if (!String(text || "").trim() || values.length === 0) {
    return null;
  }

  return [...new Set(values)];
}

function showCustomError(message) {
  customError.textContent = message;
}

function clearCustomError() {
  customError.textContent = "";
}

function generateLeftRotateCustom(values, rotateValue) {
  const tree = buildBst(values);
  const x = find(tree, rotateValue);
  const steps = [];

  if (!x || !x.right) {
    return null;
  }

  addStep(steps, tree, {
    activeNodeIds: [x.id],
    codeLine: 0,
    variables: { x: x.value, y: valueOf(x.right), B: valueOf(x.right.left), root: valueOf(tree.root) },
    explanation: `Починаємо лівий поворот навколо x = ${x.value} у власному дереві. Це можливо лише тоді, коли x має правого сина, бо саме він піднімається вгору; після цього кроку перевірка умови завершена.`,
    invariant: "BST інваріант перед поворотом збережено ✓"
  });

  leftRotateDetailed(tree, x, steps, {
    lineMap: { save: 2, moveB: 4, parent: 5, replace: 6, finish: 7 },
    showAvlLabels: false,
    label: "Лівий поворот"
  });

  return steps;
}

function generateRightRotateCustom(values, rotateValue) {
  const tree = buildBst(values);
  const y = find(tree, rotateValue);
  const steps = [];

  if (!y || !y.left) {
    return null;
  }

  addStep(steps, tree, {
    activeNodeIds: [y.id],
    codeLine: 0,
    variables: { x: valueOf(y.left), y: y.value, B: valueOf(y.left.right), root: valueOf(tree.root) },
    explanation: `Починаємо правий поворот навколо y = ${y.value} у власному дереві. Це можливо лише тоді, коли y має лівого сина, бо саме він піднімається вгору; після цього кроку перевірка умови завершена.`,
    invariant: "BST інваріант перед поворотом збережено ✓"
  });

  rightRotateDetailed(tree, y, steps, {
    lineMap: { save: 2, moveB: 4, parent: 5, replace: 6, finish: 7 },
    showAvlLabels: false,
    label: "Правий поворот"
  });

  return steps;
}

function generateDeleteCustom(values, deleteValue) {
  const tree = buildBst(values);
  const steps = [];
  const z = find(tree, deleteValue);

  if (!z) {
    return null;
  }

  addStep(steps, tree, {
    activeNodeIds: [z.id],
    codeLine: 0,
    variables: { z: z.value, y: null, parent: valueOf(z.parent) },
    explanation: `Знайдено z = ${z.value}, вузол для видалення у власному дереві. Це потрібно, щоб визначити конкретне батьківське посилання для Transplant; після цього кроку алгоритм перевіряє дітей z.`,
    invariant: "BST інваріант перед видаленням збережено ✓"
  });

  if (!z.left) {
    const replacement = z.right;
    addStep(steps, tree, {
      activeNodeIds: replacement ? [z.id, replacement.id] : [z.id],
      codeLine: 2,
      variables: { z: z.value, y: null, parent: valueOf(z.parent) },
      explanation: `z.Left дорівнює null, тому z можна замінити його правим піддеревом. Це правило покриває листок і вузол з одним правим сином; після цього кроку готується Transplant(z, z.Right).`,
      invariant: "BST інваріант: праве піддерево z більше за z і може зайняти його позицію ✓"
    });
    transplant(tree, z, replacement);
    addStep(steps, tree, {
      detachedRootIds: [z.id],
      activeNodeIds: replacement ? [replacement.id, z.id] : [z.id],
      codeLine: 3,
      variables: { z: `${z.value} ← вирізано`, y: null, parent: valueOf(replacement ? replacement.parent : null) },
      explanation: `Виконуємо Transplant(z, z.Right): батько z тепер посилається на ${formatValue(valueOf(replacement))}. Це фізично прибирає z з дерева, і після цього основне дерево зберігає всі потрібні піддерева.`,
      invariant: "BST інваріант після Transplant збережено ✓"
    });
    return steps;
  }

  if (!z.right) {
    const replacement = z.left;
    addStep(steps, tree, {
      activeNodeIds: [z.id, replacement.id],
      codeLine: 4,
      variables: { z: z.value, y: null, parent: valueOf(z.parent) },
      explanation: `z.Right дорівнює null, тому z можна замінити його лівим піддеревом. Це правило потрібне для вузла з одним лівим сином; після цього кроку готується Transplant(z, z.Left).`,
      invariant: "BST інваріант: ліве піддерево z менше за батьківську межу і може піднятися ✓"
    });
    transplant(tree, z, replacement);
    addStep(steps, tree, {
      detachedRootIds: [z.id],
      activeNodeIds: [replacement.id, z.id],
      codeLine: 5,
      variables: { z: `${z.value} ← вирізано`, y: null, parent: valueOf(replacement.parent) },
      explanation: `Виконуємо Transplant(z, z.Left): батько z тепер посилається на ${replacement.value}. Це зберігає єдине піддерево z і прибирає сам вузол z з основного дерева.`,
      invariant: "BST інваріант після Transplant збережено ✓"
    });
    return steps;
  }

  const y = treeMinimum(z.right);
  const yRight = y.right;
  const zLeft = z.left;
  const zRight = z.right;
  const yOldParent = y.parent;

  addStep(steps, tree, {
    activeNodeIds: [z.id, z.right.id],
    codeLine: 6,
    variables: { z: z.value, y: null, parent: valueOf(z.parent) },
    explanation: `z має двох дітей, тому потрібно знайти successor = TreeMinimum(z.Right). Це правило гарантує, що заміна буде найменшим більшим значенням; після цього кроку алгоритм переходить у праве піддерево z.`,
    invariant: "BST інваріант: successor буде більшим за ліве піддерево z і меншим або рівним іншим правим вузлам ✓"
  });

  addStep(steps, tree, {
    activeNodeIds: [y.id],
    codeLine: 8,
    variables: { z: z.value, y: y.value, parent: valueOf(y.parent) },
    explanation: `Successor y знайдено: це вузол ${y.value}. Це мінімум правого піддерева z, тому він може замінити z без порушення порядку; після цього кроку y стає кандидатом на нову позицію.`,
    invariant: "BST інваріант для successor збережено ✓"
  });

  if (y.parent !== z) {
    transplant(tree, y, yRight);
    addStep(steps, tree, {
      detachedRootIds: [y.id],
      activeNodeIds: [y.id, yOldParent.id],
      codeLine: 11,
      variables: { z: z.value, y: `${y.value} ← вирізано`, parent: valueOf(yOldParent) },
      explanation: `Оскільки y.Parent != z, виконуємо Transplant(y, y.Right), щоб вирізати successor зі старого місця. Це потрібно, аби y не був у дереві двічі; після цього його старий батько посилається на ${formatValue(valueOf(yRight))}.`,
      invariant: "BST інваріант у старому місці successor збережено ✓"
    });
    setRight(y, zRight);
    addStep(steps, tree, {
      detachedRootIds: [y.id],
      activeNodeIds: [y.id, zRight.id],
      codeLine: 12,
      variables: { z: z.value, y: `${y.value}.Right = ${zRight.value}`, parent: valueOf(z.parent) },
      explanation: `Виконуємо y.SetRight(z.Right), тому праве піддерево z переходить під successor. Це потрібно, щоб після заміни z не втратити вузли, більші за y; після цього y має правильне праве піддерево.`,
      invariant: `BST інваріант: z(${z.value}) < y(${y.value}) < right(${zRight.value}) ✓`
    });
  }

  transplant(tree, z, y);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [z.id, y.id],
    codeLine: 14,
    variables: { z: `${z.value} ← вирізано`, y: `${y.value} ← на місці z`, parent: valueOf(y.parent) },
    explanation: `Виконуємо Transplant(z, y), тому successor стає на місце вузла, який видаляється. Це потрібно, щоб головне батьківське посилання тепер вело до y; після цього z уже не належить основному дереву.`,
    invariant: "BST інваріант: successor може стояти на місці z ✓"
  });

  setLeft(y, zLeft);
  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [y.id, zLeft.id],
    codeLine: 15,
    variables: { z: `${z.value} ← вирізано`, y: `${y.value}.Left = ${zLeft.value}`, parent: valueOf(y.parent) },
    explanation: `Виконуємо y.SetLeft(z.Left), тому ліве піддерево z переходить під successor. Це потрібно, бо всі ці значення менші за y; після цього видалення завершене й обидва піддерева збережені.`,
    invariant: "BST інваріант після видалення збережено ✓"
  });

  return steps;
}

function generateAvlCustom(values, insertValue) {
  const tree = buildBst(values);
  const steps = [];

  addStep(steps, tree, {
    activeNodeIds: tree.root ? [tree.root.id] : [],
    nodeRoles: tree.root ? { [tree.root.id]: "root" } : {},
    codeLine: 0,
    variables: { node: null, parent: null, root: valueOf(tree.root), height: valueOf(tree.root) ? tree.root.height : 0, "balance factor": valueOf(tree.root) ? signed(tree.root.balanceFactor) : 0 },
    explanation: `Побудовано власне AVL/BST-дерево з чисел ${values.join(", ")}. Тепер вставимо ${insertValue} і піднімемося назад до кореня, щоб перерахувати висоти та balance factor; після цього кроку початковий стан готовий.`,
    invariant: "BST інваріант перед AVL-вставкою збережено ✓",
    showAvlLabels: true
  });

  const inserted = insertPlain(tree, insertValue);
  addStep(steps, tree, {
    activeNodeIds: [inserted.id],
    nodeRoles: {
      [inserted.id]: "inserted"
    },
    codeLine: 2,
    variables: { node: insertValue, parent: valueOf(inserted.parent), root: valueOf(tree.root), height: inserted.height, "balance factor": signed(inserted.balanceFactor) },
    explanation: `Вставляємо ${insertValue} як у звичайне BST, тобто новий вузол підключається за правилом порівняння. Це потрібно, щоб спочатку зберегти порядок пошуку; після цього починається AVL-перерахунок вгору.`,
    invariant: "BST інваріант після вставки збережено ✓",
    showAvlLabels: true
  });

  pathToRoot(inserted).forEach((node) => {
    recomputeAll(tree);
    addStep(steps, tree, {
      activeNodeIds: [node.id],
      nodeRoles: Math.abs(node.balanceFactor) <= 1
        ? { [node.id]: "current" }
        : { [node.id]: ["current", "imbalanced"] },
      codeLine: 3,
      variables: { node: node.value, parent: valueOf(node.parent), root: valueOf(tree.root), height: node.height, "balance factor": signed(node.balanceFactor) },
      explanation: `Перераховуємо вузол ${node.value}: висота й balance factor могли змінитися через вставку нижче. Це потрібно, бо AVL-рішення про поворот приймається саме за bf; після цього біля вузла видно h=${node.height}, bf=${signed(node.balanceFactor)}.`,
      invariant: Math.abs(node.balanceFactor) <= 1 ? `AVL інваріант: balance factor вузла ${node.value} = ${signed(node.balanceFactor)} ✓` : `⚠ Порушення: bf=${signed(node.balanceFactor)}, потрібне балансування`,
      invariantStatus: Math.abs(node.balanceFactor) <= 1 ? "ok" : "warning",
      showAvlLabels: true
    });
  });

  const unbalanced = findUnbalancedRoot(tree);
  if (!unbalanced) {
    addStep(steps, tree, {
      activeNodeIds: [inserted.id],
      nodeRoles: {
        [inserted.id]: "inserted"
      },
      codeLine: 19,
      variables: { node: insertValue, parent: valueOf(inserted.parent), root: valueOf(tree.root), height: tree.root.height, "balance factor": signed(tree.root.balanceFactor) },
      explanation: `Після вставки ${insertValue} жоден вузол не має bf поза межами [-1; +1]. Це означає, що поворот не потрібен; після цього AVL-вставка завершена.`,
      invariant: "AVL інваріант збережено для всіх вузлів ✓",
      showAvlLabels: true,
      finalStep: true
    });
    return steps;
  }

  if (unbalanced.balanceFactor > 1 && insertValue < unbalanced.left.value) {
    addAvlDecisionStep(steps, tree, {
      node: unbalanced,
      child: unbalanced.left,
      inserted,
      caseName: "LL",
      codeLine: 6
    });
    addAvlCaseStep(steps, tree, unbalanced, 6, "LL", `Виявлено LL: bf вузла ${unbalanced.value} = ${signed(unbalanced.balanceFactor)}, а новий вузол лежить у лівій гілці лівого сина. Це вимагає RightRotate(${unbalanced.value}); після повороту лівий син підніметься вгору.`);
    rightRotateDetailed(tree, unbalanced, steps, { lineMap: rightRotateLineMap(), showAvlLabels: true, label: "AVL LL" });
    const lowerNode = find(tree, unbalanced.value);
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "LL",
      lowerNode,
      subtreeRoot: lowerNode ? lowerNode.parent : null,
      inserted,
      codeLine: 7
    });
  } else if (unbalanced.balanceFactor < -1 && insertValue > unbalanced.right.value) {
    addAvlDecisionStep(steps, tree, {
      node: unbalanced,
      child: unbalanced.right,
      inserted,
      caseName: "RR",
      codeLine: 8
    });
    addAvlCaseStep(steps, tree, unbalanced, 8, "RR", `Виявлено RR: bf вузла ${unbalanced.value} = ${signed(unbalanced.balanceFactor)}, а новий вузол лежить у правій гілці правого сина. Це вимагає LeftRotate(${unbalanced.value}); після повороту правий син підніметься вгору.`);
    leftRotateDetailed(tree, unbalanced, steps, { lineMap: leftRotateLineMap(), showAvlLabels: true, label: "AVL RR" });
    const lowerNode = find(tree, unbalanced.value);
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "RR",
      lowerNode,
      subtreeRoot: lowerNode ? lowerNode.parent : null,
      inserted,
      codeLine: 9
    });
  } else if (unbalanced.balanceFactor > 1) {
    addAvlDecisionStep(steps, tree, {
      node: unbalanced,
      child: unbalanced.left,
      inserted,
      caseName: "LR",
      codeLine: 11
    });
    addAvlCaseStep(steps, tree, unbalanced, 11, "LR", `Виявлено LR: bf вузла ${unbalanced.value} = ${signed(unbalanced.balanceFactor)}, але новий вузол у правій гілці лівого сина. Це вимагає LeftRotate(leftChild), а потім RightRotate(${unbalanced.value}).`);
    const firstPivotValue = unbalanced.left.value;
    leftRotateDetailed(tree, unbalanced.left, steps, { lineMap: leftRotateLineMap(), showAvlLabels: true, label: "AVL LR: перший поворот" });
    const firstLowerNode = find(tree, firstPivotValue);
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "LR (після 1-го повороту)",
      lowerNode: firstLowerNode,
      subtreeRoot: firstLowerNode ? firstLowerNode.parent : null,
      inserted,
      codeLine: 12
    });
    rightRotateDetailed(tree, unbalanced, steps, { lineMap: rightRotateLineMap(), showAvlLabels: true, label: "AVL LR: другий поворот" });
    const secondLowerNode = find(tree, unbalanced.value);
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "LR (після 2-го повороту)",
      lowerNode: secondLowerNode,
      subtreeRoot: secondLowerNode ? secondLowerNode.parent : null,
      inserted,
      codeLine: 13
    });
  } else {
    addAvlDecisionStep(steps, tree, {
      node: unbalanced,
      child: unbalanced.right,
      inserted,
      caseName: "RL",
      codeLine: 16
    });
    addAvlCaseStep(steps, tree, unbalanced, 16, "RL", `Виявлено RL: bf вузла ${unbalanced.value} = ${signed(unbalanced.balanceFactor)}, але новий вузол у лівій гілці правого сина. Це вимагає RightRotate(rightChild), а потім LeftRotate(${unbalanced.value}).`);
    const firstPivotValue = unbalanced.right.value;
    rightRotateDetailed(tree, unbalanced.right, steps, { lineMap: rightRotateLineMap(), showAvlLabels: true, label: "AVL RL: перший поворот" });
    const firstLowerNode = find(tree, firstPivotValue);
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "RL (після 1-го повороту)",
      lowerNode: firstLowerNode,
      subtreeRoot: firstLowerNode ? firstLowerNode.parent : null,
      inserted,
      codeLine: 17
    });
    leftRotateDetailed(tree, unbalanced, steps, { lineMap: leftRotateLineMap(), showAvlLabels: true, label: "AVL RL: другий поворот" });
    const secondLowerNode = find(tree, unbalanced.value);
    addAvlHeightUpdateStep(steps, tree, {
      caseName: "RL (після 2-го повороту)",
      lowerNode: secondLowerNode,
      subtreeRoot: secondLowerNode ? secondLowerNode.parent : null,
      inserted,
      codeLine: 18
    });
  }

  addStep(steps, tree, {
    activeNodeIds: tree.root ? [tree.root.id] : [],
    nodeRoles: tree.root ? { [tree.root.id]: "root" } : {},
    codeLine: 19,
    variables: { node: insertValue, parent: null, root: valueOf(tree.root), height: tree.root ? tree.root.height : 0, "balance factor": tree.root ? signed(tree.root.balanceFactor) : 0 },
    explanation: `Власна AVL-вставка завершена: після потрібних поворотів коренем є ${valueOf(tree.root)}. Це відновлює AVL-інваріант, і після цього всі вузли мають balance factor у дозволених межах.`,
    invariant: "AVL інваріант відновлено ✓",
    showAvlLabels: true,
    finalStep: true
  });

  return steps;
}

function generateAvlDeleteScenario() {
  const tree = buildBst([30, 20, 40, 10, 35, 50, 60]);
  const steps = [];
  const target = 10;

  const root = find(tree, 30);
  const node20 = find(tree, 20);
  const node40 = find(tree, 40);
  const z = find(tree, target);

  addStep(steps, tree, {
    activeNodeIds: [root.id],
    nodeRoles: {
      [root.id]: "root",
      [node20.id]: "current",
      [node40.id]: "current"
    },
    codeLine: 0,
    variables: {
      root: valueOf(tree.root),
      target,
      note: "Початковий стан AVL перед delete",
      "root bf": signed(root.balanceFactor)
    },
    explanation: "Крок 1. Початкове AVL-дерево: усі вузли мають коректні h/bf, дерево збалансоване.",
    invariant: "AVL інваріант: всі bf у межах [-1, 0, 1] ✓",
    showAvlLabels: true
  });

  addStep(steps, tree, {
    activeNodeIds: [root.id],
    nodeRoles: {
      [root.id]: "current"
    },
    codeLine: 2,
    variables: { node: 30, target, decision: "10 < 30 → йдемо вліво" },
    explanation: "Крок 2. Пошук вузла для delete іде так само, як у BST: порівнюємо ключ і обираємо гілку.",
    invariant: "BST-пошук по інваріанту порядку ✓",
    showAvlLabels: true
  });

  addStep(steps, tree, {
    activeNodeIds: [root.id, node20.id],
    nodeRoles: {
      [root.id]: "parent",
      [node20.id]: "current"
    },
    codeLine: 2,
    variables: { node: 20, target, decision: "10 < 20 → йдемо вліво" },
    explanation: "Продовжуємо шлях пошуку: 30 → 20.",
    invariant: "Пошук лишається коректним ✓",
    showAvlLabels: true
  });

  addStep(steps, tree, {
    activeNodeIds: [node20.id, z.id],
    nodeRoles: {
      [node20.id]: "parent",
      [z.id]: "current"
    },
    codeLine: 2,
    variables: { node: z.value, target, found: true },
    explanation: "Знайдено вузол 10. У цьому прикладі це листок, тому для BST-частини delete це найпростіший випадок.",
    invariant: "Leaf-випадок: successor не потрібен ✓",
    showAvlLabels: true
  });

  addStep(steps, tree, {
    activeNodeIds: [z.id, node20.id],
    nodeRoles: {
      [z.id]: "current",
      [node20.id]: "parent"
    },
    codeLine: 2,
    variables: { case: "leaf", operation: "Transplant(z, null)", z: z.value },
    explanation: "Крок 3. Видаляємо вузол як у BST: листок 10 просто від'єднуємо.",
    invariant: "BST delete (leaf) виконано ✓",
    showAvlLabels: true
  });

  transplant(tree, z, null);
  z.parent = null;

  addStep(steps, tree, {
    detachedRootIds: [z.id],
    activeNodeIds: [node20.id],
    nodeRoles: {
      [node20.id]: "parent"
    },
    codeLine: 3,
    variables: { removed: 10, "20.Left": "null", note: "Фізичне видалення завершено" },
    explanation: "Крок 4. BST-видалення завершене, але AVL delete ще ні: треба повернутися до предків і оновити висоти.",
    invariant: "Після фізичного delete потрібна AVL-перевірка",
    showAvlLabels: true
  });

  const ancestors = pathToRoot(node20);
  ancestors.forEach((node) => {
    recomputeAll(tree);
    addStep(steps, tree, {
      activeNodeIds: [node.id],
      nodeRoles: Math.abs(node.balanceFactor) <= 1
        ? { [node.id]: "current" }
        : { [node.id]: ["current", "imbalanced"] },
      codeLine: 6,
      variables: {
        node: node.value,
        height: node.height,
        "balance factor": signed(node.balanceFactor)
      },
      explanation: `Крок 5. Для предка ${node.value}: оновлюємо height і рахуємо bf = h(left) - h(right).`,
      invariant: Math.abs(node.balanceFactor) <= 1
        ? `Вузол ${node.value} в нормі: bf=${signed(node.balanceFactor)}`
        : `⚠ Вузол ${node.value} розбалансований: bf=${signed(node.balanceFactor)}`,
      invariantStatus: Math.abs(node.balanceFactor) <= 1 ? "ok" : "warning",
      showAvlLabels: true
    });
  });

  const unbalanced = find(tree, 30);
  const child = unbalanced.right;
  addStep(steps, tree, {
    activeNodeIds: [unbalanced.id, child.id],
    nodeRoles: {
      [unbalanced.id]: ["imbalanced", "rotation-pivot"],
      [child.id]: "current"
    },
    codeLine: 16,
    variables: {
      node: unbalanced.value,
      "node bf": signed(unbalanced.balanceFactor),
      child: child.value,
      "child bf": signed(child.balanceFactor),
      rule: "right-heavy + child bf <= 0 => RR => LeftRotate(node)"
    },
    explanation: "Крок 6. Визначення case після delete: bf(30)=-2 і bf(40)<=0, отже це RR-випадок після delete.",
    invariant: "Після delete case визначається за bf вузла і bf дитини",
    invariantStatus: "warning",
    showAvlLabels: true
  });

  addStep(steps, tree, {
    activeNodeIds: [unbalanced.id, child.id],
    nodeRoles: {
      [unbalanced.id]: "rotation-pivot",
      [child.id]: "current"
    },
    codeLine: 17,
    variables: {
      rotation: "LeftRotate(30)",
      reason: "RR case після delete"
    },
    explanation: "Крок 7. Виконуємо rotation для RR-випадку: LeftRotate(30). Детальні підкроки повороту показані далі.",
    invariant: "Rotation має зберегти BST-порядок і прибрати локальний дисбаланс",
    showAvlLabels: true
  });

  leftRotateDetailed(tree, unbalanced, steps, {
    lineMap: leftRotateLineMap(),
    showAvlLabels: true,
    label: "AVL delete: RR fix"
  });

  addStep(steps, tree, {
    activeNodeIds: [find(tree, 30).id, find(tree, 40).id],
    nodeRoles: {
      [find(tree, 30).id]: "current",
      [find(tree, 40).id]: "rotation-pivot"
    },
    codeLine: 17,
    variables: {
      lower: 30,
      "new subtree root": 40,
      note: "Оновлення height після rotation"
    },
    explanation: "Крок 8. Після повороту зв'язки змінилися, тому old height вже не валідні: спочатку оновлюємо нижній вузол, потім новий корінь піддерева.",
    invariant: "Перед фінальною перевіркою треба перерахувати h і bf",
    showAvlLabels: true
  });

  addAvlHeightUpdateStep(steps, tree, {
    caseName: "AVL delete RR",
    lowerNode: find(tree, 30),
    subtreeRoot: find(tree, 40),
    codeLine: 17
  });

  const finalRoot = tree.root;
  addStep(steps, tree, {
    activeNodeIds: [finalRoot.id],
    nodeRoles: {
      [finalRoot.id]: "root"
    },
    codeLine: 22,
    variables: {
      root: finalRoot.value,
      "root bf": signed(finalRoot.balanceFactor),
      summary: "AVL delete = BST delete + rebalance вгору до кореня"
    },
    explanation: "Крок 9. Фінальне дерево: після rotation і оновлення висот усі bf знову в межах -1, 0, 1.",
    invariant: "AVL інваріант відновлено ✓",
    showAvlLabels: true,
    finalStep: true
  });

  return steps;
}

function rbSetColor(node, color) {
  if (node) {
    node.color = color;
  }
}

function rbColorOf(node) {
  return node ? node.color ?? "black" : "black";
}

function leftRotateBasic(tree, x) {
  if (!x || !x.right) {
    return x;
  }

  const y = x.right;
  const t2 = y.left;

  setRight(x, t2);
  replaceAtParent(tree, x, y);
  setLeft(y, x);
  recomputeAll(tree);
  return y;
}

function rightRotateBasic(tree, y) {
  if (!y || !y.left) {
    return y;
  }

  const x = y.left;
  const t2 = x.right;

  setLeft(y, t2);
  replaceAtParent(tree, y, x);
  setRight(x, y);
  recomputeAll(tree);
  return x;
}

function addRbStep(steps, tree, options = {}) {
  addStep(steps, tree, {
    ...options,
    operationLabel: options.operationLabel ?? "rb-insert",
    nodeColors: options.nodeColors ?? extractNodeColors(tree)
  });
}

function generateRbInsertScenario() {
  const tree = { root: null, nodes: new Map() };
  const steps = [];
  const sequence = [41, 38, 31, 12, 19, 8];
  const explain = (short, medium, deep) => ({
    explanationShort: short,
    explanationMedium: medium,
    explanationDeep: deep
  });

  addRbStep(steps, tree, {
    codeLine: 0,
    variables: {
      sequence: `[${sequence.join(", ")}]`,
      root: null
    },
    ...explain(
      "Починаємо RB insert demo для послідовності 41, 38, 31, 12, 19, 8.",
      "Працюємо покроково: спочатку вставка як у BST, далі новий вузол стає red, потім InsertFixup перевіряє parent/grandparent/uncle, і в кінці root примусово black.",
      "Такий порядок потрібен, бо Red-Black Tree — це BST із кольоровими інваріантами: структуру дає BST-вставка, а кольоровий баланс повертають recoloring і rotations."
    ),
    invariant: "RB старт: порожнє дерево валідне."
  });

  let z = insertPlain(tree, 41);
  rbSetColor(z, "red");
  addRbStep(steps, tree, {
    activeNodeIds: [z.id],
    nodeRoles: { [z.id]: ["node", "recolored"] },
    codeLine: 2,
    variables: { insert: 41, "new color": "red", parent: valueOf(z.parent), root: valueOf(tree.root) },
    ...explain(
      "Вставляємо 41 як у BST і одразу фарбуємо новий вузол у red.",
      "Перший крок RB insert не ламає BST-логіку: шукаємо позицію за ключем і вставляємо листок, після чого newNode.Color = Red.",
      "Новий вузол робимо red, а не black, щоб не змінювати black-height на шляху від кореня: так локально можна порушити тільки правило red-parent, яке виправляється дешевше за глобальне вирівнювання."
    ),
    invariant: "Тимчасово корінь може бути red до завершення fixup."
  });

  rbSetColor(tree.root, "black");
  addRbStep(steps, tree, {
    activeNodeIds: [tree.root.id],
    nodeRoles: { [tree.root.id]: "root" },
    codeLine: 4,
    variables: { root: valueOf(tree.root), "root color": rbColorOf(tree.root) },
    ...explain(
      "Після fixup корінь обов'язково стає black.",
      "Вузол 41 зараз корінь, тому виконуємо Root.Color = Black.",
      "Останній крок InsertFixup завжди примусовий: навіть якщо через recoloring корінь тимчасово став red, ця команда повертає ключову властивість RB-дерева."
    ),
    invariant: "RB ✓ root = black."
  });

  z = insertPlain(tree, 38);
  rbSetColor(z, "red");
  addRbStep(steps, tree, {
    activeNodeIds: [z.id, z.parent.id],
    nodeRoles: { [z.id]: "node", [z.parent.id]: "parent" },
    codeLine: 2,
    variables: {
      insert: 38,
      parent: `${z.parent.value} (${rbColorOf(z.parent)})`,
      grandparent: null,
      uncle: "null (black)"
    },
    ...explain(
      "38 вставляється як у BST, стає red, а його parent=41 уже black.",
      "Після BST-вставки вузол 38 стоїть ліворуч від 41; новий вузол red, але red-red конфлікту немає, бо батько чорний.",
      "Коли parent black, жоден RB-інваріант не ламається: black-height не змінився, а правило 'red node не має red parent' вже виконується, тому fixup фактично не потрібен."
    ),
    invariant: "RB ✓ red-вузол має black-батька."
  });

  addRbStep(steps, tree, {
    activeNodeIds: [tree.root.id],
    nodeRoles: { [tree.root.id]: "root" },
    codeLine: 7,
    variables: { root: `${tree.root.value} (${rbColorOf(tree.root)})`, status: "fixup skipped" },
    ...explain(
      "Цикл fixup не запускається, бо parent не red.",
      "Умова while для InsertFixup: працюємо лише коли parent червоний; для 38 це false, тому алгоритм одразу завершується.",
      "Такий early-exit зберігає швидкість: RB insert робить додаткову роботу тільки там, де реально є red-red конфлікт."
    ),
    invariant: "RB ✓ дерево валідне після вставки 38."
  });

  z = insertPlain(tree, 31);
  rbSetColor(z, "red");
  let p = z.parent;
  let g = p.parent;
  let u = g.right;
  addRbStep(steps, tree, {
    activeNodeIds: [z.id, p.id, g.id],
    nodeRoles: { [z.id]: ["node", "conflict"], [p.id]: ["parent", "conflict"], [g.id]: "grandparent", ...(u ? { [u.id]: "uncle" } : {}) },
    codeLine: 10,
    variables: {
      insert: 31,
      parent: `${p.value} (${rbColorOf(p)})`,
      grandparent: `${g.value} (${rbColorOf(g)})`,
      uncle: u ? `${u.value} (${rbColorOf(u)})` : "null (black)"
    },
    ...explain(
      "Для 31 з'являється red-red conflict: node=31 red і parent=38 red.",
      "Тут чітко виділяємо ролі: node — новий вузол, parent — його батько, grandparent — батько parent, uncle — брат parent відносно grandparent; uncle відсутній, тому в RB-логіці він вважається black.",
      "Null-uncle трактуємо як black, бо порожні NIL-листки концептуально чорні; отже це не recoloring-case, а випадок із rotations."
    ),
    invariant: "⚠ RB порушення: два червоні підряд."
  });

  addRbStep(steps, tree, {
    activeNodeIds: [z.id, p.id, g.id],
    nodeRoles: { [z.id]: "node", [p.id]: "parent", [g.id]: "grandparent" },
    codeLine: 16,
    variables: {
      case: "LL (прямий випадок)",
      action: "RightRotate(41) + recolor"
    },
    ...explain(
      "Це LL-випадок: parent ліворуч від grandparent і node ліворуч від parent.",
      "Оскільки uncle black/null, переходимо до rotation-гілки; LL і RR є прямими випадками, де достатньо одного повороту навколо grandparent.",
      "Для LL один RightRotate вирівнює локальну 'лінію' й піднімає середній ключ вгору, зберігаючи BST-порядок."
    )
  });

  rightRotateBasic(tree, g);
  rbSetColor(find(tree, 38), "black");
  rbSetColor(find(tree, 41), "red");
  rbSetColor(tree.root, "black");
  addRbStep(steps, tree, {
    activeNodeIds: [find(tree, 38).id, find(tree, 41).id],
    nodeRoles: { [find(tree, 38).id]: ["root", "recolored"], [find(tree, 41).id]: ["grandparent", "recolored"] },
    codeLine: 23,
    variables: {
      rotation: "RightRotate(41)",
      recolor: "38 -> black, 41 -> red",
      root: `${tree.root.value} (${rbColorOf(tree.root)})`
    },
    ...explain(
      "Після повороту верх піддерева стає black, а старий grandparent стає red.",
      "RightRotate(41) підняв 38 вище, потім recoloring робить 38 чорним і 41 червоним, щоб прибрати red-red локально.",
      "Нова верхівка піддерева стає black, бо саме вона з'єднує обидві гілки після повороту; старий grandparent стає red, щоб зберегти однакову кількість black-вузлів на шляхах."
    ),
    invariant: "RB ✓ конфлікт усунуто."
  });

  z = insertPlain(tree, 12);
  rbSetColor(z, "red");
  p = z.parent;
  g = p.parent;
  u = g.right;
  addRbStep(steps, tree, {
    activeNodeIds: [z.id, p.id, g.id, u.id],
    nodeRoles: { [z.id]: ["node", "conflict"], [p.id]: ["parent", "conflict"], [g.id]: "grandparent", [u.id]: "uncle" },
    codeLine: 11,
    variables: {
      insert: 12,
      parent: `${p.value} (${rbColorOf(p)})`,
      grandparent: `${g.value} (${rbColorOf(g)})`,
      uncle: `${u.value} (${rbColorOf(u)})`,
      case: "parent red + uncle red"
    },
    ...explain(
      "Для 12 маємо parent red і uncle red — це recoloring-case.",
      "Node=12 red має red parent=31, але uncle=41 теж red, тому fixup обирає перефарбування без rotations.",
      "Коли uncle red, геометрія піддерева не проблема: порушення чисто кольорове, тож rotation не потрібен."
    ),
    invariant: "⚠ Локальний red-red конфлікт перед fixup."
  });

  rbSetColor(p, "black");
  rbSetColor(u, "black");
  rbSetColor(g, "red");
  addRbStep(steps, tree, {
    activeNodeIds: [p.id, g.id, u.id],
    nodeRoles: { [p.id]: ["parent", "recolored"], [u.id]: ["uncle", "recolored"], [g.id]: ["grandparent", "recolored"] },
    codeLine: 14,
    variables: {
      recolor: `${p.value}->black, ${u.value}->black, ${g.value}->red`,
      next: "перевіряємо вище"
    },
    ...explain(
      "Recoloring: parent і uncle стають black, grandparent стає red.",
      "Цей крок прибирає локальний red-red біля node: тепер обидві гілки під grandparent мають чорні вершини, а сам grandparent тимчасово червоний.",
      "Grandparent стає red, щоб не збільшити black-height цієї локальної частини; через це потенційний конфлікт може піднятися вище, тому node = grandparent і цикл триває."
    ),
    invariant: "Після recoloring перевірка рухається вгору."
  });

  rbSetColor(tree.root, "black");
  addRbStep(steps, tree, {
    activeNodeIds: [tree.root.id],
    nodeRoles: { [tree.root.id]: "root" },
    codeLine: 4,
    variables: { root: `${tree.root.value} (${rbColorOf(tree.root)})` },
    ...explain(
      "Після підйому fixup знову гарантуємо root black.",
      "Після recoloring корінь потенційно міг змінити колір, тому виконується фінальна нормалізація Root.Color = Black.",
      "Це обов'язковий запобіжник незалежно від гілки fixup: RB-правило для кореня не має винятків."
    ),
    invariant: "RB ✓ root = black."
  });

  z = insertPlain(tree, 19);
  rbSetColor(z, "red");
  p = z.parent;
  g = p.parent;
  u = g.right;
  addRbStep(steps, tree, {
    activeNodeIds: [z.id, p.id, g.id],
    nodeRoles: { [z.id]: ["node", "conflict"], [p.id]: ["parent", "conflict"], [g.id]: "grandparent", ...(u ? { [u.id]: "uncle" } : {}) },
    codeLine: 16,
    variables: {
      insert: 19,
      parent: `${p.value} (${rbColorOf(p)})`,
      grandparent: `${g.value} (${rbColorOf(g)})`,
      uncle: u ? `${u.value} (${rbColorOf(u)})` : "null (black)",
      case: "left-right"
    },
    ...explain(
      "Для 19 uncle black/null, тому йдемо в rotation-гілку; це LR-зигзаг.",
      "Node=19 праворуч від red parent=12, а parent ліворуч від grandparent=31, отже маємо LR (зигзаг), не прямий LL.",
      "LR/RL потребують два повороти: перший перетворює зигзаг у пряму форму, другий вже стабілізує піддерево."
    ),
    invariant: "⚠ Потрібна подвійна ротація (LR)."
  });

  leftRotateBasic(tree, p);
  addRbStep(steps, tree, {
    activeNodeIds: [find(tree, 12).id, find(tree, 19).id, find(tree, 31).id],
    nodeRoles: {
      [find(tree, 19).id]: "node",
      [find(tree, 12).id]: "parent",
      [find(tree, 31).id]: "grandparent"
    },
    codeLine: 17,
    variables: {
      step: "1/2",
      rotation: "LeftRotate(12)",
      effect: "перетворюємо на left-left відносно 31"
    },
    ...explain(
      "Перший поворот для LR: LeftRotate(parent=12).",
      "Цим поворотом переносимо node=19 вище за 12 і перетворюємо LR-конфігурацію на прямий LL-випадок відносно grandparent=31.",
      "Без цього кроку один поворот навколо grandparent не прибере red-red правильно: зигзаг спочатку треба 'розпрямити'."
    ),
    invariant: "Підготовка до другого повороту."
  });

  rightRotateBasic(tree, find(tree, 31));
  rbSetColor(find(tree, 19), "black");
  rbSetColor(find(tree, 31), "red");
  rbSetColor(tree.root, "black");
  addRbStep(steps, tree, {
    activeNodeIds: [find(tree, 19).id, find(tree, 31).id],
    nodeRoles: { [find(tree, 19).id]: ["node", "recolored"], [find(tree, 31).id]: ["grandparent", "recolored"] },
    codeLine: 23,
    variables: {
      step: "2/2",
      rotation: "RightRotate(31)",
      recolor: "19 -> black, 31 -> red",
      root: `${tree.root.value} (${rbColorOf(tree.root)})`
    },
    ...explain(
      "Другий поворот завершує LR fix: RightRotate(grandparent=31) + recoloring.",
      "Після повороту новий верх локального піддерева — 19, його фарбуємо black, а старий grandparent 31 — red.",
      "Це відновлює властивості одразу в двох площинах: структура стає збалансованішою, а кольори прибирають red-red на критичному ребрі."
    ),
    invariant: "RB ✓ порушення для вставки 19 виправлене."
  });

  z = insertPlain(tree, 8);
  rbSetColor(z, "red");
  p = z.parent;
  g = p.parent;
  u = g.right;
  addRbStep(steps, tree, {
    activeNodeIds: [z.id, p.id, g.id, u.id],
    nodeRoles: { [z.id]: ["node", "conflict"], [p.id]: ["parent", "conflict"], [g.id]: "grandparent", [u.id]: "uncle" },
    codeLine: 11,
    variables: {
      insert: 8,
      parent: `${p.value} (${rbColorOf(p)})`,
      grandparent: `${g.value} (${rbColorOf(g)})`,
      uncle: `${u.value} (${rbColorOf(u)})`,
      case: "parent red + uncle red"
    },
    ...explain(
      "Для 8 знову випадок parent red + uncle red.",
      "Node=8 вставився в BST, став red, і тепер має red-батька 12; uncle=31 також red, тож знову виконуємо recoloring без rotation.",
      "Rotation тут не додає користі, бо симетрично червоні parent і uncle вже можна 'погасити' простим перефарбуванням."
    ),
    invariant: "⚠ Потрібен recoloring."
  });

  rbSetColor(p, "black");
  rbSetColor(u, "black");
  rbSetColor(g, "red");
  addRbStep(steps, tree, {
    activeNodeIds: [p.id, g.id, u.id],
    nodeRoles: { [p.id]: ["parent", "recolored"], [u.id]: ["uncle", "recolored"], [g.id]: ["grandparent", "recolored"] },
    codeLine: 14,
    variables: {
      recolor: `${p.value}->black, ${u.value}->black, ${g.value}->red`,
      next: "перевіряємо предків вище"
    },
    ...explain(
      "Recoloring робить 12 і 31 чорними, а 19 — червоним.",
      "Локальний конфлікт знято, але тепер саме 19 може конфліктувати зі своїм батьком, тому fixup піднімається вище.",
      "Це стандартна ідея RB insert: інколи проблему не знищуємо, а 'переносимо' на рівень вище, поки не дійдемо до стабільного чорного предка або кореня."
    ),
    invariant: "Fixup триває вгору по дереву."
  });

  rbSetColor(tree.root, "black");
  const n38 = find(tree, 38);
  const n19 = find(tree, 19);
  addRbStep(steps, tree, {
    activeNodeIds: [n38.id, n19.id],
    nodeRoles: { [n38.id]: "root", [n19.id]: "parent" },
    codeLine: 4,
    variables: {
      check: "parent(19)=38 black, додаткових порушень немає",
      root: `${n38.value} (${rbColorOf(n38)})`
    },
    ...explain(
      "Після підйому вище конфлікту вже немає: parent для 19 є black.",
      "Цикл while завершується, бо умова red-parent більше не виконується.",
      "Фінальний крок Root.Color = Black гарантує, що навіть після ланцюжка recoloring корінь не залишиться червоним."
    ),
    invariant: "RB ✓ усі властивості відновлено."
  });

  addRbStep(steps, tree, {
    activeNodeIds: [tree.root.id],
    nodeRoles: { [tree.root.id]: "root" },
    codeLine: 4,
    variables: {
      root: `${tree.root.value} (${rbColorOf(tree.root)})`,
      final: "38(B) -> left 19(R), right 41(B); 19.left=12(B), 19.right=31(B), 12.left=8(R)"
    },
    ...explain(
      "Фінал: RB insert = BST-вставка + fixup (recoloring/rotations) + root black.",
      "Після послідовності 41, 38, 31, 12, 19, 8 дерево зберігає BST-порядок і RB-правила кольорів.",
      "Головна різниця з простою BST: дерево не вироджується в ланцюжок, бо локальні порушення одразу гасяться через чіткі випадки uncle red або uncle black/null."
    ),
    invariant: "RB фінал ✓ root black, red-вузли мають black-дітей, BST-порядок збережено.",
    finalStep: true
  });

  return steps;
}

const SCENARIO_BUILDERS = {
  "bst-search": () => generateSearchScenario([20, 10, 30, 5, 15], 15),
  "delete-leaf": () => generateDeleteLeafScenario(),
  "delete-one-child": () => generateDeleteOneChildScenario(),
  "delete-two-children": () => generateDeleteTwoChildrenScenario(),
  "transplant-basic": () => generateTransplantScenario(),
  "left-rotate": () => generateLeftRotateScenario(),
  "right-rotate": () => generateRightRotateScenario(),
  "avl-ll": () => generateAvlScenario("LL", [30, 20, 10]),
  "avl-rr": () => generateAvlScenario("RR", [10, 20, 30]),
  "avl-lr": () => generateAvlScenario("LR", [30, 10, 20]),
  "avl-rl": () => generateAvlScenario("RL", [10, 30, 20]),
  "avl-delete-demo": () => generateAvlDeleteScenario(),
  "rb-insert-sequence": () => generateRbInsertScenario()
};

function signed(number) {
  if (number > 0) {
    return `+${number}`;
  }

  return String(number);
}

function findTopic(key) {
  return topicDefinitions.find((topic) => topic.key === key) ?? topicDefinitions[0];
}

function findScenario(id) {
  const definition = scenarioDefinitions.find((item) => item.id === id) ?? scenarioDefinitions[0];
  return {
    ...definition,
    build: SCENARIO_BUILDERS[definition.id] ?? (() => generateSearchScenario([20, 10, 30, 5, 15], 15))
  };
}

function populateScenarioSelect(topic) {
  scenarioSelect.innerHTML = "";
  topic.scenarioIds.forEach((scenarioId) => {
    const definition = findScenario(scenarioId);
    const option = document.createElement("option");
    option.value = definition.id;
    option.textContent = definition.title;
    scenarioSelect.appendChild(option);
  });
}

function openTopic(topicKey, preferredScenarioId = null) {
  currentTopic = findTopic(topicKey);
  activeTopicTitle.textContent = currentTopic.name;
  populateScenarioSelect(currentTopic);
  renderCustomFields(currentTopic);
  markProgress(currentTopic.key, "in-progress");
  showVisualizer();
  renderSidebar();
  loadScenario(preferredScenarioId ?? currentTopic.scenarioIds[0]);
}

function loadScenario(id, customSteps = null, customTitle = null, customCodeKey = null) {
  stopPlay();
  currentScenario = customCodeKey
    ? { ...findScenario(id), title: customTitle ?? "Власний сценарій", codeKey: customCodeKey, quizKey: findScenario(id).quizKey }
    : findScenario(id);
  steps = customSteps ?? currentScenario.build();
  currentIndex = 0;
  treeTitle.textContent = currentScenario.title;
  scenarioSelect.value = id;
  render();
}

function render() {
  const step = steps[currentIndex];

  if (!step) {
    return;
  }

  renderTree(step);
  renderCode(codes[currentScenario.codeKey], step.highlightedCodeLine ?? step.codeLine);
  scrollActiveCodeLineIntoView();
  renderExplanation(step);
  updateControls();
}

function renderTree(step) {
  const snapshot = step.treeSnapshot;
  const width = Math.max(treeSvg.clientWidth, 680);
  const height = Math.max(treeSvg.clientHeight, 520);
  treeSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  treeSvg.innerHTML = "";

  const defs = createSvgElement("defs");
  defs.innerHTML = `
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#22c55e"></path>
    </marker>
  `;
  treeSvg.appendChild(defs);

  const roots = [snapshot.rootId, ...snapshot.detachedRootIds].filter(Boolean);

  if (roots.length === 0) {
    const emptyText = createSvgElement("text");
    emptyText.setAttribute("x", width / 2);
    emptyText.setAttribute("y", height / 2);
    emptyText.setAttribute("fill", "#94a3b8");
    emptyText.setAttribute("font-size", "18");
    emptyText.setAttribute("text-anchor", "middle");
    emptyText.textContent = "Дерево порожнє";
    treeSvg.appendChild(emptyText);
    return;
  }

  const positions = new Map();
  roots.forEach((rootId, index) => {
    const segmentWidth = width / roots.length;
    const startX = segmentWidth * index + segmentWidth / 2;
    const offset = Math.max(segmentWidth / 4, 72);
    calculatePositions(snapshot, rootId, startX, 86, offset, positions);
  });

  roots.forEach((rootId) => drawLinks(snapshot, rootId, positions));
  roots.forEach((rootId, index) => drawNodes(snapshot, rootId, positions, step, index > 0));
}

function calculatePositions(snapshot, nodeIdValue, x, y, offset, positions) {
  const node = snapshot.nodes[nodeIdValue];
  if (!node || positions.has(nodeIdValue)) {
    return;
  }

  positions.set(nodeIdValue, { x, y });
  const nextOffset = Math.max(offset / 2, 48);

  if (node.left) {
    calculatePositions(snapshot, node.left, x - offset, y + 104, nextOffset, positions);
  }

  if (node.right) {
    calculatePositions(snapshot, node.right, x + offset, y + 104, nextOffset, positions);
  }
}

function drawLinks(snapshot, nodeIdValue, positions, visited = new Set()) {
  if (visited.has(nodeIdValue)) {
    return;
  }
  visited.add(nodeIdValue);

  const node = snapshot.nodes[nodeIdValue];
  const position = positions.get(nodeIdValue);

  ["left", "right"].forEach((side) => {
    const childId = node[side];
    if (!childId) {
      return;
    }

    const childPosition = positions.get(childId);
    const line = createSvgElement("line");
    line.setAttribute("class", "tree-link");
    line.setAttribute("x1", position.x);
    line.setAttribute("y1", position.y + 25);
    line.setAttribute("x2", childPosition.x);
    line.setAttribute("y2", childPosition.y - 25);
    treeSvg.appendChild(line);
    drawLinks(snapshot, childId, positions, visited);
  });
}

function drawNodes(snapshot, nodeIdValue, positions, step, isDetached, visited = new Set()) {
  if (visited.has(nodeIdValue)) {
    return;
  }
  visited.add(nodeIdValue);

  const node = snapshot.nodes[nodeIdValue];
  const position = positions.get(nodeIdValue);
  const isRoot = nodeIdValue === snapshot.rootId;
  const isActive = step.activeNodeIds.includes(nodeIdValue);
  const roleClasses = Array.isArray(step.nodeRoles?.[nodeIdValue]) ? step.nodeRoles[nodeIdValue] : [];
  const rbColor = step.nodeColors?.[nodeIdValue];
  const rbClass = rbColor === "red" || rbColor === "black" ? ` rb-${rbColor}` : "";

  const group = createSvgElement("g");
  group.setAttribute("class", `tree-node${rbClass} ${roleClasses.join(" ")}${isActive ? " active" : ""}${isRoot ? " is-root" : ""}`.trim());
  group.setAttribute("transform", `translate(${position.x}, ${position.y})`);

  const circle = createSvgElement("circle");
  circle.setAttribute("class", "node-circle");
  circle.setAttribute("r", "25");
  group.appendChild(circle);

  const text = createSvgElement("text");
  text.setAttribute("class", "node-text");
  text.textContent = node.value;
  group.appendChild(text);

  if (step.showAvlLabels) {
    const meta = createSvgElement("text");
    meta.setAttribute("class", "node-meta");
    meta.setAttribute("y", "42");
    meta.textContent = `h=${node.height} bf=${signed(node.balanceFactor)}`;
    group.appendChild(meta);
  }

  if (isRoot) {
    const label = createSvgElement("text");
    label.setAttribute("class", "root-label");
    label.setAttribute("y", "-43");
    label.textContent = "root";
    group.appendChild(label);

    const arrow = createSvgElement("line");
    arrow.setAttribute("class", "root-arrow");
    arrow.setAttribute("x1", "0");
    arrow.setAttribute("y1", "-35");
    arrow.setAttribute("x2", "0");
    arrow.setAttribute("y2", "-26");
    group.appendChild(arrow);
  }

  if (isDetached) {
    const label = createSvgElement("text");
    label.setAttribute("class", "detached-label");
    label.setAttribute("y", "-43");
    label.textContent = "тимчасово";
    group.appendChild(label);
  }

  treeSvg.appendChild(group);

  if (node.left) {
    drawNodes(snapshot, node.left, positions, step, false, visited);
  }

  if (node.right) {
    drawNodes(snapshot, node.right, positions, step, false, visited);
  }
}

function createSvgElement(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function renderCode(lines, activeLine) {
  codeBlock.innerHTML = "";

  lines.forEach((line, index) => {
    const row = document.createElement("div");
    row.className = `code-line${index === activeLine ? " active" : ""}`;

    const number = document.createElement("span");
    number.className = "line-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const code = document.createElement("span");
    code.textContent = line;

    row.append(number, code);
    codeBlock.appendChild(row);
  });
}

function scrollActiveCodeLineIntoView() {
  const activeLine = codeBlock.querySelector(".code-line.active");
  if (!activeLine) {
    return;
  }

  const blockTop = codeBlock.scrollTop;
  const blockBottom = blockTop + codeBlock.clientHeight;
  const lineTop = activeLine.offsetTop;
  const lineBottom = lineTop + activeLine.offsetHeight;
  const padding = 18;

  if (lineTop < blockTop + padding || lineBottom > blockBottom - padding) {
    activeLine.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });
  }
}

function renderExplanation(step) {
  // Determine effective explanation level based on appMode
  let effectiveLevel = explanationLevel;
  if (appMode === "learn") {
    effectiveLevel = "short";
  } else if (appMode === "debug") {
    effectiveLevel = "deep";
  }

  const explanationByLevel = {
    short: step.explanationShort,
    medium: step.explanationMedium ?? step.explanationNormal,
    deep: step.explanationDeep
  };

  const fallback = step.explanationMedium ?? step.explanationNormal ?? step.explanation ?? "";
  explanationText.textContent = explanationByLevel[effectiveLevel] ?? fallback;
  invariantBox.textContent = step.invariant ?? "";
  invariantBox.classList.toggle("warning", step.invariantStatus === "warning");
  invariantBox.classList.toggle("danger", step.invariantStatus === "danger");

  // Defense hint: show when defenseModeEnabled (set by 🛡 button OR Defense mode button)
  if (defenseModeEnabled) {
    defenseHintCard.classList.remove("hidden");
    let hintKey = "default";

    if (currentScenario) {
      const id = String(currentScenario.id || currentTopic?.key || "");
      const hintMap = {
        "bst-search": "bstSearch",
        "delete-leaf": "bstDelete",
        "delete-one-child": "bstDelete",
        "delete-two-children": "bstDelete",
        "transplant-basic": "bstTransplant",
        "left-rotate": "leftRotate",
        "right-rotate": "rightRotate",
        "avl-ll": "avlLL",
        "avl-rr": "avlRR",
        "avl-lr": "avlLR",
        "avl-rl": "avlRL",
        "avl-delete-demo": "avlDelete",
        "rb-insert-sequence": "rbInsert"
      };

      hintKey = hintMap[id] ?? (id.includes("avl") ? "avlInsert" : "default");
    }

    defenseHintText.innerHTML = defenseHints[hintKey] || defenseHints.default || "";
  } else {
    defenseHintCard.classList.add("hidden");
  }

  // Debug panel: show validation details only in debug mode
  const debugPanel = document.getElementById("debugPanel");
  if (debugPanel) {
    if (appMode === "debug" && step.validationContext) {
      debugPanel.classList.remove("hidden");
      const debugContent = document.getElementById("debugContent");
      if (debugContent) {
        const vc = step.validationContext;
        const checks = [];
        if (vc.bst) checks.push({ label: "BST invariant", ok: vc.bst.ok, err: vc.bst.error });
        if (vc.parentLinks) checks.push({ label: "Parent links", ok: vc.parentLinks.ok, err: vc.parentLinks.error });
        if (vc.avl) checks.push({ label: "AVL balance", ok: vc.avl.ok, err: vc.avl.error });
        debugContent.innerHTML = checks.map(c => `
          <div class="debug-check ${c.ok ? 'ok' : 'fail'}">
            <div class="debug-check-title">${c.ok ? '✓' : '✗'} ${c.label}</div>
            ${c.err ? `<div class="debug-check-error">${c.err}</div>` : ''}
          </div>
        `).join("") || "<div class=\"debug-check ok\"><div class=\"debug-check-title\">No validation data</div></div>";
      }
    } else {
      debugPanel.classList.add("hidden");
    }
  }

  variablesTable.innerHTML = "";
  const entries = Object.entries(step.variables ?? {});

  if (entries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "variable-value";
    empty.textContent = "На цьому кроці немає відстежуваних змінних.";
    variablesTable.appendChild(empty);
    return;
  }

  entries.forEach(([name, value]) => {
    const row = document.createElement("div");
    row.className = "variable-row";

    const variableName = document.createElement("span");
    variableName.className = "variable-name";
    variableName.textContent = name;

    const variableValue = document.createElement("span");
    variableValue.className = "variable-value";
    variableValue.textContent = formatValue(value);

    row.append(variableName, variableValue);
    variablesTable.appendChild(row);
  });
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  return String(value);
}

function updateControls() {
  const lastIndex = steps.length - 1;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === lastIndex;
  resetBtn.disabled = currentIndex === 0;
  stepCounter.textContent = `Крок ${currentIndex + 1} / ${steps.length}`;
  playBtn.textContent = playTimer ? "Пауза" : "Пуск";
  quizBtn.classList.toggle("hidden", currentIndex !== lastIndex);

  if (currentIndex === lastIndex && currentTopic) {
    markProgress(currentTopic.key, "done");
  }
}

function goToStep(index) {
  currentIndex = Math.max(0, Math.min(index, steps.length - 1));
  render();
}

function startPlay() {
  if (playTimer) {
    return;
  }

  playTimer = window.setInterval(() => {
    if (currentIndex >= steps.length - 1) {
      stopPlay();
      return;
    }

    goToStep(currentIndex + 1);
  }, 1500);

  updateControls();
}

function stopPlay() {
  if (playTimer) {
    window.clearInterval(playTimer);
    playTimer = null;
  }

  updateControls();
}

function renderCustomFields(topic) {
  clearCustomError();
  const placeholder = "30, 20, 10, 25";

  if (topic.customType === "transplant") {
    customFields.innerHTML = `
      <div class="custom-row">
        <button id="customRunBtn" type="button">Запустити демонстрацію Transplant</button>
      </div>
    `;
  } else if (topic.customType === "avlDelete") {
    customFields.innerHTML = `
      <div class="custom-row">
        <button id="customRunBtn" type="button">Запустити AVL delete demo</button>
      </div>
    `;
  } else if (topic.customType === "rbInsert") {
    customFields.innerHTML = `
      <div class="custom-row">
        <button id="customRunBtn" type="button">Запустити RB insert demo (41, 38, 31, 12, 19, 8)</button>
      </div>
    `;
  } else if (topic.customType === "search") {
    customFields.innerHTML = `
      <div class="custom-row">
        <input id="customValuesInput" type="text" placeholder="Числа: ${placeholder}">
        <button id="customBuildBtn" type="button">Побудувати дерево</button>
      </div>
      <div id="customActionRow" class="custom-row hidden">
        <input id="customActionInput" type="number" placeholder="Знайти вузол">
        <button id="customRunBtn" type="button">Шукати</button>
      </div>
    `;
  } else if (topic.customType === "delete") {
    customFields.innerHTML = `
      <div class="custom-row">
        <input id="customValuesInput" type="text" placeholder="Числа: ${placeholder}">
        <button id="customBuildBtn" type="button">Побудувати дерево</button>
      </div>
      <div id="customActionRow" class="custom-row hidden">
        <input id="customActionInput" type="number" placeholder="Видалити вузол">
        <button id="customRunBtn" type="button">Запустити</button>
      </div>
    `;
  } else if (topic.customType === "avl") {
    customFields.innerHTML = `
      <div class="custom-row">
        <input id="customValuesInput" type="text" placeholder="Початкові числа: ${placeholder}">
        <button id="customBuildBtn" type="button">Побудувати дерево</button>
      </div>
      <div id="customActionRow" class="custom-row hidden">
        <input id="customActionInput" type="number" placeholder="Додати вузол">
        <button id="customRunBtn" type="button">Вставити</button>
      </div>
    `;
  } else {
    customFields.innerHTML = `
      <div class="custom-row three">
        <input id="customValuesInput" type="text" placeholder="Числа: ${topic.customType === "leftRotate" ? "40, 20, 60, 50, 70" : "60, 40, 70, 20, 50"}">
        <input id="customActionInput" type="number" placeholder="Вузол для повороту">
        <button id="customRunBtn" type="button">Запустити поворот</button>
      </div>
    `;
  }

  const buildBtn = document.getElementById("customBuildBtn");
  if (buildBtn) {
    buildBtn.addEventListener("click", () => {
      clearCustomError();
      const values = parseNumbers(document.getElementById("customValuesInput").value);
      if (!values) {
        showCustomError("Введи коректні числа");
        return;
      }
      document.getElementById("customActionRow").classList.remove("hidden");
    });
  }

  document.getElementById("customRunBtn").addEventListener("click", () => runCustomScenario(topic));
}

function runCustomScenario(topic) {
  clearCustomError();
  if (topic.customType === "transplant") {
    const customSteps = generateTransplantScenario();
    loadScenario("transplant-basic", customSteps, "BST Transplant: покрокова демонстрація", "transplant");
    return;
  }

  if (topic.customType === "avlDelete") {
    const customSteps = generateAvlDeleteScenario();
    loadScenario("avl-delete-demo", customSteps, "AVL delete: покрокова демонстрація", "avlDelete");
    return;
  }

  if (topic.customType === "rbInsert") {
    const customSteps = generateRbInsertScenario();
    loadScenario("rb-insert-sequence", customSteps, "Red-Black Tree insert: 41, 38, 31, 12, 19, 8", "rbInsert");
    return;
  }

  const values = parseNumbers(document.getElementById("customValuesInput").value);
  const actionValue = Number(document.getElementById("customActionInput").value);

  if (!values || !Number.isFinite(actionValue)) {
    showCustomError("Введи коректні числа");
    return;
  }

  let customSteps = null;
  let scenarioId = topic.scenarioIds[0];
  let title = "Власний сценарій";
  let codeKey = findScenario(scenarioId).codeKey;

  if (topic.customType === "search") {
    customSteps = generateSearchScenario(values, actionValue);
    scenarioId = "bst-search";
    codeKey = "bstSearch";
    title = `Власний BST-пошук: знайти ${actionValue}`;
  } else if (topic.customType === "delete") {
    if (!find(buildBst(values), actionValue)) {
      showCustomError(`Вузол ${actionValue} не знайдено в дереві`);
      return;
    }
    customSteps = generateDeleteCustom(values, actionValue);
    scenarioId = "delete-two-children";
    codeKey = "bstDelete";
    title = `Власне BST-видалення: ${actionValue}`;
  } else if (topic.customType === "leftRotate") {
    const tree = buildBst(values);
    const node = find(tree, actionValue);
    if (!node) {
      showCustomError(`Вузол ${actionValue} не знайдено в дереві`);
      return;
    }
    if (!node.right) {
      showCustomError(`У вузла ${actionValue} немає правого сина для лівого повороту`);
      return;
    }
    customSteps = generateLeftRotateCustom(values, actionValue);
    scenarioId = "left-rotate";
    codeKey = "leftRotate";
    title = `Власний лівий поворот: x = ${actionValue}`;
  } else if (topic.customType === "rightRotate") {
    const tree = buildBst(values);
    const node = find(tree, actionValue);
    if (!node) {
      showCustomError(`Вузол ${actionValue} не знайдено в дереві`);
      return;
    }
    if (!node.left) {
      showCustomError(`У вузла ${actionValue} немає лівого сина для правого повороту`);
      return;
    }
    customSteps = generateRightRotateCustom(values, actionValue);
    scenarioId = "right-rotate";
    codeKey = "rightRotate";
    title = `Власний правий поворот: y = ${actionValue}`;
  } else if (topic.customType === "avl") {
    if (values.includes(actionValue)) {
      showCustomError(`Вузол ${actionValue} вже є в дереві`);
      return;
    }
    customSteps = generateAvlCustom(values, actionValue);
    scenarioId = "avl-ll";
    codeKey = "avlInsert";
    title = `Власна AVL-вставка: додати ${actionValue}`;
  }

  if (!customSteps) {
    showCustomError(`Вузол ${actionValue} не знайдено в дереві`);
    return;
  }

  loadScenario(scenarioId, customSteps, title, codeKey);
}

function startQuiz() {
  const quiz = quizDefinitions[currentScenario.quizKey] ?? quizDefinitions[currentTopic.key] ?? quizDefinitions.bstSearch;
  quizState = {
    quiz,
    index: 0,
    score: 0,
    answered: false
  };
  quizOverlay.classList.remove("hidden");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const { quiz, index, score } = quizState;

  if (index >= quiz.questions.length) {
    quizTitle.textContent = quiz.title;
    quizQuestion.textContent = score === 3
      ? `${score}/3 — Відмінно! ✓`
      : `${score}/3 — Майже! Повтори ключові кроки й спробуй ще раз.`;
    quizOptions.innerHTML = "";
    quizFeedback.textContent = "Квіз завершено.";
    quizNextBtn.textContent = "Закрити";
    quizState.answered = true;
    return;
  }

  const question = quiz.questions[index];
  quizTitle.textContent = quiz.title;
  quizQuestion.textContent = `${index + 1}. ${question.text}`;
  quizOptions.innerHTML = "";
  quizFeedback.textContent = "";
  quizNextBtn.textContent = "Наступне питання";
  quizState.answered = false;

  question.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + optionIndex)}) ${option}`;
    button.addEventListener("click", () => answerQuiz(optionIndex));
    quizOptions.appendChild(button);
  });
}

function answerQuiz(optionIndex) {
  if (quizState.answered) {
    return;
  }

  const question = quizState.quiz.questions[quizState.index];
  quizState.answered = true;

  [...quizOptions.children].forEach((button, index) => {
    if (index === question.correct) {
      button.classList.add("correct");
    } else if (index === optionIndex) {
      button.classList.add("wrong");
    }
  });

  if (optionIndex === question.correct) {
    quizState.score += 1;
    quizFeedback.textContent = `Правильно. ${question.why}`;
  } else {
    quizFeedback.textContent = `Не зовсім. ${question.why}`;
  }
}

function nextQuizStep() {
  if (!quizState) {
    return;
  }

  if (quizState.index >= quizState.quiz.questions.length) {
    quizOverlay.classList.add("hidden");
    return;
  }

  if (!quizState.answered) {
    quizFeedback.textContent = "Спочатку обери відповідь.";
    return;
  }

  quizState.index += 1;
  renderQuizQuestion();
}

scenarioSelect.addEventListener("change", () => loadScenario(scenarioSelect.value));
prevBtn.addEventListener("click", () => goToStep(currentIndex - 1));
nextBtn.addEventListener("click", () => goToStep(currentIndex + 1));
resetBtn.addEventListener("click", () => {
  stopPlay();
  goToStep(0);
});
playBtn.addEventListener("click", () => {
  if (playTimer) {
    stopPlay();
  } else {
    startPlay();
  }
});
backToTopicsBtn.addEventListener("click", showHome);
resetProgressLink.addEventListener("click", () => {
  progressState = {};
  writeProgress();
  renderProgressUi();
});
quizBtn.addEventListener("click", startQuiz);
quizCloseBtn.addEventListener("click", () => quizOverlay.classList.add("hidden"));
quizNextBtn.addEventListener("click", nextQuizStep);
explanationLevelToggle.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-level]");
  if (!button) {
    return;
  }

  explanationLevel = button.dataset.level;
  [...explanationLevelToggle.querySelectorAll("button")].forEach((item) => {
    item.classList.toggle("active", item === button);
  });
  renderExplanation(steps[currentIndex]);
});

defenseModeToggle.addEventListener("click", () => {
  defenseModeEnabled = !defenseModeEnabled;
  defenseModeToggle.classList.toggle("active", defenseModeEnabled);
  defenseModeToggle.setAttribute("aria-pressed", defenseModeEnabled);

  // Keep shield toggle and app mode synchronized without conflicting body mode classes.
  // If shield is turned off while Defense mode is active, return to Trace.
  if (!defenseModeEnabled && appMode === "defense") {
    applyAppMode("trace");
    return;
  }

  if (steps[currentIndex]) {
    renderExplanation(steps[currentIndex]);
  }
});

// ── Mode button listeners ──
function applyAppMode(mode) {
  appMode = mode;

  // Update active class on mode buttons
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  // Sync defenseModeEnabled with Defense mode
  if (mode === "defense") {
    defenseModeEnabled = true;
    defenseModeToggle.classList.add("active");
    defenseModeToggle.setAttribute("aria-pressed", "true");
  } else {
    defenseModeEnabled = false;
    defenseModeToggle.classList.remove("active");
    defenseModeToggle.setAttribute("aria-pressed", "false");
  }

  // Apply body class for CSS-driven layout changes
  document.body.classList.remove("mode-learn", "mode-trace", "mode-defense", "mode-debug");
  document.body.classList.add(`mode-${mode}`);

  // Re-render explanation with new mode
  if (steps[currentIndex]) {
    renderExplanation(steps[currentIndex]);
  }
}

document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    if (mode) {
      applyAppMode(mode);
    }
  });
});

window.addEventListener("resize", () => render());

if (advPrevBtn) {
  advPrevBtn.addEventListener("click", () => {
    if (currentAdvSectionIndex > 0) {
      currentAdvSectionIndex--;
      renderAdvancedContent();
    }
  });
}

if (advNextBtn) {
  advNextBtn.addEventListener("click", () => {
    if (currentAdvLesson && currentAdvSectionIndex < currentAdvLesson.sections.length - 1) {
      currentAdvSectionIndex++;
      renderAdvancedContent();
    }
  });
}

if (advancedStudyBtn) {
  advancedStudyBtn.addEventListener("click", showAdvancedStudy);
}

if (backFromAdvancedBtn) {
  backFromAdvancedBtn.addEventListener("click", showHome);
}

renderProgressUi();
showHome();
