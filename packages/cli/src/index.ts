#!/usr/bin/env node

import { handleNewCommand } from "./commands/new";

const args = process.argv.slice(2);

if (args[0] === "new" && args[1]) {
  handleNewCommand(args[1]);
} else {
  console.log("Uso: schemify new <nombre-proyecto>");
}
