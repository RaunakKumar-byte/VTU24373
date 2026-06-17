import { Log } from "logging-middleware";

export function logInfo(pkg, message) {
  Log("frontend", "info", pkg, message);
}

export function logError(pkg, message) {
  Log("frontend", "error", pkg, message);
}

export function logWarn(pkg, message) {
  Log("frontend", "warn", pkg, message);
}
