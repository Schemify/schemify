#!/usr/bin/env node
import { runCLI } from './index.js'

runCLI().catch((err) => {
  console.error('❌ CLI Error:', err)
  process.exit(1)
})
