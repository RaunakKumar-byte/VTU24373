import axios from "axios";

const STACKS = new Set(["backend", "frontend"]);
const LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const BACKEND_PACKAGES = new Set([
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
]);
const FRONTEND_PACKAGES = new Set(["api", "component", "hook", "page", "state"]);
const SHARED_PACKAGES = new Set(["auth", "config", "middleware", "utils", "style"]);

let logUrl = "http://4.224.186.213/evaluation-service/logs";
let getAuthHeader = null;

export function initLog({ logsUrl, getAuthorization }) {
  if (logsUrl) logUrl = logsUrl;
  getAuthHeader = getAuthorization;
}

function validate(stack, level, pkg) {
  const s = stack.toLowerCase();
  const l = level.toLowerCase();
  const p = pkg.toLowerCase();

  if (!STACKS.has(s)) throw new Error(`invalid stack: ${stack}`);
  if (!LEVELS.has(l)) throw new Error(`invalid level: ${level}`);

  const allowed =
    s === "backend"
      ? BACKEND_PACKAGES.has(p) || SHARED_PACKAGES.has(p)
      : FRONTEND_PACKAGES.has(p) || SHARED_PACKAGES.has(p);

  if (!allowed) throw new Error(`invalid package for ${s}: ${pkg}`);

  return { stack: s, level: l, package: p };
}

export function Log(stack, level, pkg, message) {
  const payload = validate(stack, level, pkg);

  sendLog({ ...payload, message: String(message) }).catch(() => {});
}

async function sendLog(body) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };

  if (getAuthHeader) {
    const auth = await getAuthHeader();
    if (auth) headers.Authorization = auth;
  }

  await axios.post(logUrl, body, { headers, timeout: 8000 });
}
