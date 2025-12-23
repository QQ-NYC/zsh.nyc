"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const vitest_1 = require("vitest");
const ink_testing_library_1 = require("ink-testing-library");
const hyper_registry_1 = require("../hyper-registry");
(0, vitest_1.test)("hyper registry app renders", () => {
    const { lastFrame } = (0, ink_testing_library_1.render)((0, jsx_runtime_1.jsx)(hyper_registry_1.HyperRegistryApp, {}));
    (0, vitest_1.expect)(lastFrame()).toMatch(/Universal Hyper Registry/);
    (0, vitest_1.expect)(lastFrame()).toMatch(/Dashboard Overview/);
});
//# sourceMappingURL=dashboard.test.js.map