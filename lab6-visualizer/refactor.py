import sys

with open(r'c:\Users\sasha\OneDrive\Desktop\University\АСД\labs_datastructures\lab6-visualizer\main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

import_statement = 'import { TreeNode, buildBst, insertPlain, find, setLeft, setRight, replaceAtParent, transplant, treeMinimum, recomputeAll, serializeTree, nodeId, valueOf, detachFromParent } from "./core/tree.js";\n'

import_end_idx = 0
for i, line in enumerate(lines):
    if not line.startswith('import ') and line.strip() != '':
        import_end_idx = i
        break

lines.insert(import_end_idx, import_statement)

start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if line.startswith('class TreeNode'):
        start_idx = i
    if line.startswith('function firstSentence'):
        end_idx = i
        break

if start_idx is not None and end_idx is not None:
    del lines[start_idx:end_idx]
    
with open(r'c:\Users\sasha\OneDrive\Desktop\University\АСД\labs_datastructures\lab6-visualizer\main.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Updated main.js successfully.')
