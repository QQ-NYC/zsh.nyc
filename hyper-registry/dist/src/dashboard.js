"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ink_1 = require("ink");
const quantum_field_1 = require("./quantum-field");
const neural_command_panel_1 = require("./neural-command-panel");
const Dashboard = () => ((0, jsx_runtime_1.jsxs)(ink_1.Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [(0, jsx_runtime_1.jsx)(ink_1.Box, { flexDirection: "row", justifyContent: "center", children: (0, jsx_runtime_1.jsx)(ink_1.Text, { bold: true, color: "cyan", children: "\u26A1 COMMAND DECK v1.0 | HYPER REGISTRY UNIVERSE CONTROL CENTER" }) }), (0, jsx_runtime_1.jsxs)(ink_1.Box, { flexDirection: "row", marginY: 1, children: [(0, jsx_runtime_1.jsx)(ink_1.Box, { flexGrow: 1, flexDirection: "column", children: (0, jsx_runtime_1.jsx)(quantum_field_1.QuantumFieldVisualizer, { particleCount: 142857, entangledPairs: 12459, decoherence: 0.042, theme: "quantum-nexus" }) }), (0, jsx_runtime_1.jsx)(ink_1.Box, { flexGrow: 1, marginX: 2, children: (0, jsx_runtime_1.jsx)(neural_command_panel_1.NeuralCommandPanel, {}) })] }), (0, jsx_runtime_1.jsx)(ink_1.Box, { flexDirection: "row", marginY: 2, children: (0, jsx_runtime_1.jsx)(ink_1.Text, { children: "[1] Registry Map | [2] Quantum Telemetry | [3] Neural Matrix | [4] Fusion Scoring | [TAB] Switch | [ESC] Exit" }) })] }));
exports.Dashboard = Dashboard;
//# sourceMappingURL=dashboard.js.map