import {
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  renameSync,
} from "fs";
import { join, extname, dirname, basename } from "path";

const BINARY_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".ico",
  ".pdf",
  ".zip",
];

/**
 * Reemplaza placeholders en contenido de archivos y en nombres de archivos/carpetas.
 */
export function replacePlaceholders(
  baseDir: string,
  replacements: Record<string, string>
) {
  const isBinaryFile = (filePath: string) =>
    BINARY_EXTENSIONS.includes(extname(filePath).toLowerCase());

  const replaceInContent = (filePath: string) => {
    if (isBinaryFile(filePath)) return;
    const original = readFileSync(filePath, "utf-8");
    const updated = applyReplacements(original, replacements);
    if (updated !== original) writeFileSync(filePath, updated);
  };

  const applyReplacements = (str: string, dict: Record<string, string>) =>
    Object.entries(dict).reduce(
      (acc, [key, val]) => acc.replace(new RegExp(`__${key}__`, "g"), val),
      str
    );

  const walk = (currentPath: string) => {
    for (const entry of readdirSync(currentPath)) {
      const fullPath = join(currentPath, entry);
      const stats = statSync(fullPath);

      let newFullPath = fullPath;

      // Reemplazo en nombres
      const replacedName = applyReplacements(entry, replacements);
      if (replacedName !== entry) {
        newFullPath = join(currentPath, replacedName);
        renameSync(fullPath, newFullPath);
      }

      stats.isDirectory() ? walk(newFullPath) : replaceInContent(newFullPath);
    }
  };

  walk(baseDir);
}
