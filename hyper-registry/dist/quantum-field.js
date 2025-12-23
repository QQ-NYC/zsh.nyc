"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantumFieldVisualizer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ink_1 = require("ink");
const gradient_string_1 = __importDefault(require("gradient-string"));
const chalk_1 = __importDefault(require("chalk"));
const particleTypes = {
    registry: "●",
    service: "○",
    plugin: "⬤",
    config: "◇",
    security: "☆",
    mesh: "⬟"
};
const typeColor = {
    registry: "#00f3ff",
    service: "#ff00ff",
    plugin: "#00ff9d",
    config: "#ffd166",
    security: "#ff3366",
    mesh: "#8a2be2"
};
const QuantumFieldVisualizer = ({ particleCount, entangledPairs, decoherence, theme }) => {
    const [particles, setParticles] = (0, react_1.useState)([]);
    const [tick, setTick] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const genParticles = () => {
            const types = Object.keys(particleTypes);
            return Array.from({ length: particleCount }, (_, i) => ({
                x: Math.round(40 + 20 * Math.sin(i + tick / 10)),
                y: Math.round(10 + 6 * Math.cos(i / 8 + tick / 30)),
                type: types[i % types.length],
                entangled: i < entangledPairs
            }));
        };
        setParticles(genParticles());
        const interval = setInterval(() => {
            setTick((t) => t + 1);
        }, 100);
        return () => clearInterval(interval);
    }, [particleCount, entangledPairs, tick]);
    // Colorful quantum field line
    const quantumLine = (line) => (0, gradient_string_1.default)(theme === "quantum-nexus" ? ["#00f3ff", "#ff00ff"] : ["#00ff9d", "#ffd166"]).multiline(line);
    return ((0, jsx_runtime_1.jsxs)(ink_1.Box, { flexDirection: "column", marginY: 1, children: [(0, jsx_runtime_1.jsxs)(ink_1.Box, { children: [(0, jsx_runtime_1.jsx)(ink_1.Text, { bold: true, color: "cyan", children: "\uD83C\uDF0C QUANTUM FIELD VISUALIZER" }), (0, jsx_runtime_1.jsxs)(ink_1.Text, { children: [" \u2502 PARTICLES: ", particleCount.toLocaleString(), " \u2502 ENTANGLED: ", entangledPairs.toLocaleString(), " \u2502 DECOHERENCE: ", decoherence, "%"] })] }), (0, jsx_runtime_1.jsx)(ink_1.Box, { flexDirection: "column", marginY: 1, children: Array.from({ length: 20 }).map((_, row) => ((0, jsx_runtime_1.jsx)(ink_1.Text, { children: particles
                        .filter((p) => p.y === row)
                        .map((p, i) => chalk_1.default.hex(typeColor[p.type])(p.entangled ? chalk_1.default.bold(particleTypes[p.type]) : particleTypes[p.type]))
                        .join(" ") }, row))) }), (0, jsx_runtime_1.jsx)(ink_1.Box, { children: (0, jsx_runtime_1.jsx)(ink_1.Text, { children: "PARTICLE TYPES: \u25CF Registry Nodes \u25CB Services \u2B24 Plugins \u25C7 Configurations \u2606 Security \u2B1F Mesh Nodes" }) }), (0, jsx_runtime_1.jsx)(ink_1.Box, { marginY: 1, children: (0, jsx_runtime_1.jsx)(ink_1.Text, { children: "QUANTUM CONTROLS: [\uD83C\uDF00] ENTANGLE \u2502 [\u26A1] SUPERPOSE \u2502 [\uD83C\uDF0A] INTERFERE \u2502 [\uD83D\uDD2C] COLLAPSE \u2502 [\u267E\uFE0F] DECOHERE \u2502 [\uD83D\uDD04] ENTROPY \u2502 [\uD83C\uDFAF] OBSERVE" }) }), (0, jsx_runtime_1.jsx)(ink_1.Box, { children: (0, jsx_runtime_1.jsx)(ink_1.Text, { children: "QUANTUM METRICS: Entanglement Density: 0.87 \u2502 Superposition States: 142 \u2502 Wave Function Collapse: 24" }) })] }));
};
exports.QuantumFieldVisualizer = QuantumFieldVisualizer;
//# sourceMappingURL=quantum-field.js.map