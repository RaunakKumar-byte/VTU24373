export function buildAuthBody({ email, name, rollNo, accessCode, clientID, clientSecret }) {
  return {
    email,
    name,
    rollNo,
    accessCode,
    clientID,
    clientId: clientID,
    clientSecret,
  };
}

export function parseAuthError(data) {
  if (!data) return "auth failed";

  if (data.message) return data.message;

  if (Array.isArray(data.errors)) {
    return data.errors
      .map((item) => {
        const [field, msg] = Object.entries(item)[0] ?? [];
        return `${field}: ${msg}`;
      })
      .join(", ");
  }

  return JSON.stringify(data);
}
