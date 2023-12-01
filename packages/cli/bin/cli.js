#!/usr/bin/env node

import { dirname, filename } from "dirname-filename-esm"
import importLocal from "import-local"
import log from "npmlog"
import entry from "../lib/index.js"

const __dirname = dirname(import.meta)
const __filename = filename(import.meta)

if (importLocal(__filename)) {
  log.info("core-cli", "Using local version of this package")
} else {
  // Code for both global and local version here…
  // log.info("core-cli", "Code for both global and local version here…")
  entry(process.argv.slice(2))
}
