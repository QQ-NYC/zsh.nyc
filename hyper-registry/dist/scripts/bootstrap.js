"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
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
dirs.forEach(d => fs_extra_1.default.ensureDirSync(d));
files.forEach(f => fs_extra_1.default.ensureFileSync(f));
console.log("✅ Quantum Registry structure bootstrapped.");
//# sourceMappingURL=bootstrap.js.map