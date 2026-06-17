import { Log } from "logging-middleware";

function formatError(data) {
  if (!data) return "unknown error";
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (Array.isArray(data.errors)) {
    return data.errors
      .map((item) => {
        const [field, msg] = Object.entries(item)[0] ?? [];
        return `${field}: ${msg}`;
      })
      .join(", ");
  }
  return data.error ?? JSON.stringify(data);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.response?.status ?? 500;
  const message = formatError(err.response?.data) || err.message || "internal error";

  Log("backend", status >= 500 ? "error" : "warn", "handler", message);

  res.status(status >= 400 && status < 600 ? status : 500).json({
    success: false,
    error: message,
  });
}
