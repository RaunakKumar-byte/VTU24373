import axios from "axios";
import { config } from "../config/env.js";
import { buildAuthBody, parseAuthError } from "../utils/authPayload.js";

let cachedToken = null;
let tokenExpiry = 0;

export async function getAuthorizationHeader() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const { email, name, rollNo, accessCode, clientID, clientSecret } = config.auth;
  const missing = Object.entries({ email, name, rollNo, accessCode, clientID, clientSecret })
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    throw new Error(`missing auth config: ${missing.join(", ")}`);
  }

  try {
    const { data } = await axios.post(
      `${config.evaluationBase}/auth`,
      buildAuthBody({ email, name, rollNo, accessCode, clientID, clientSecret }),
      { headers: { "Content-Type": "application/json" }, timeout: 15000 }
    );

    if (!data?.access_token) {
      throw new Error("auth response missing access_token");
    }

    cachedToken = `${data.token_type ?? "Bearer"} ${data.access_token}`;
    tokenExpiry = Date.now() + 50 * 60 * 1000;
    return cachedToken;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(parseAuthError(err.response.data));
    }
    throw err;
  }
}
