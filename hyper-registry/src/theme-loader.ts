import fs from "fs";
import { z } from "zod";

const ThemeSchema = z.object({
  name: z.string(),
  description: z.string(),
  base: z.enum(["dark", "light"]),
  colors: z.record(z.string()),
  effects: z.record(z.any()).optional(),
});

export function loadTheme(themeDir: string, themeName: string) {
  const file = `${themeDir}/${themeName}.json`;
  const raw = fs.readFileSync(file, "utf8");
  const theme = ThemeSchema.parse(JSON.parse(raw));
  return theme;
}