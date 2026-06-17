import axios from "axios";

const AUTH_API_URL =
  process.env.AUTH_API_URL ??
  "http://4.224.186.213/evaluation-service/auth";

function buildAuthBody() {
  const email = process.env.AUTH_EMAIL;
  const name = process.env.AUTH_NAME;
  const rollNo = process.env.AUTH_ROLL_NO;
  const accessCode = process.env.AUTH_ACCESS_CODE;
  const clientID = process.env.AUTH_CLIENT_ID;
  const clientSecret = process.env.AUTH_CLIENT_SECRET;

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

function parseAuthError(data) {
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors)) {
    return data.errors
      .map((item) => {
        const [field, msg] = Object.entries(item)[0] ?? [];
        return `${field}: ${msg}`;
      })
      .join(", ");
  }
  return JSON.stringify(data);
}

export async function fetchAccessToken() {
  const body = buildAuthBody();
  const missing = Object.entries(body)
    .filter(([k, v]) => !v && k !== "clientId")
    .map(([k]) => k);

  if (missing.length) {
    throw new Error(`Missing auth credentials in .env: ${missing.join(", ")}`);
  }

  try {
    const response = await axios.post(AUTH_API_URL, body, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      timeout: 15000,
    });

    const { token_type, access_token } = response.data ?? {};
    if (!access_token) throw new Error("Auth API did not return access_token");

    return `${token_type ?? "Bearer"} ${access_token}`;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Auth API failed (${error.response.status}): ${parseAuthError(error.response.data)}`);
    }
    throw error;
  }
}

export async function resolveAuthorizationHeader() {
  const manualToken = process.env.AUTHORIZATION_TOKEN?.trim();

  if (manualToken?.startsWith("Bearer ")) return manualToken;
  if (manualToken?.startsWith("eyJ")) return `Bearer ${manualToken}`;
  if (manualToken?.startsWith("http")) {
    throw new Error("AUTHORIZATION_TOKEN must be the JWT token, not the auth URL");
  }
  if (manualToken) return manualToken;

  return fetchAccessToken();
}
