"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTheme = loadTheme;
const fs_1 = __importDefault(require("fs"));
const zod_1 = require("zod");
const ThemeSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    base: zod_1.z.enum(["dark", "light"]),
    colors: zod_1.z.record(zod_1.z.string()),
    effects: zod_1.z.record(zod_1.z.any()).optional(),
});
function loadTheme(themeDir, themeName) {
    const file = `${themeDir}/${themeName}.json`;
    const raw = fs_1.default.readFileSync(file, "utf8");
    const theme = ThemeSchema.parse(JSON.parse(raw));
    return theme;
}
//# sourceMappingURL=theme-loader.js.map