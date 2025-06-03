import fs from "fs";
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const content = `export const version = "${pkg.version}";\n`;
fs.writeFileSync("./src/version.ts", content);
console.log(`📦 version.ts actualizado a v${pkg.version}`);
