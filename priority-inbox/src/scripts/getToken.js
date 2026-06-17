import "dotenv/config";

import { fetchAccessToken } from "../services/authApi.js";

/**
 * Helper script: call the auth API and print the Bearer token.
 * Run: npm run auth
 */
async function main() {
  console.log("Requesting access token from evaluation auth API...\n");

  const authorization = await fetchAccessToken();
  const token = authorization.replace(/^Bearer\s+/i, "");

  console.log("Success! Add ONE of these to your .env:\n");
  console.log(`AUTHORIZATION_TOKEN=${authorization}\n`);
  console.log("— or keep AUTH_EMAIL / AUTH_CLIENT_ID / etc. and token is fetched automatically.\n");
  console.log("Token (first 60 chars):", token.slice(0, 60) + "...");
}

main().catch((error) => {
  console.error("\n[ERROR]", error.message);
  process.exitCode = 1;
});
