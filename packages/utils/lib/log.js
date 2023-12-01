import log from "npmlog"
import { isDebug } from "./utils.js"

if (isDebug()) {
  log.level = "verbose"
} else {
  log.level = "info"
}

log.heading = "core-cli"

log.addLevel("success", 2000, { fg: "green", bold: true })

export default log
