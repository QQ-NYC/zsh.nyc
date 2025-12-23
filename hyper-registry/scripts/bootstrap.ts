import fs from "fs-extra";
import path from "path";

const dirs = [
  "src",
  "plugins",
  "tests",
  "themes",
  "ml",
  "docs",
];
const files = [
  "src/registry.ts",
  "src/quantumField.tsx",
  "src/fusionScoringEngine.ts",
  "src/neuralCommandPanel.tsx",
  "plugins/example-plugin.ts",
  "ml/quantum_fusion.py",
  "src/Dashboard.tsx",
  "docs/architecture.md"
];
dirs.forEach(d => fs.ensureDirSync(d));
files.forEach(f => fs.ensureFileSync(f));
console.log("✅ Quantum Registry structure bootstrapped.");