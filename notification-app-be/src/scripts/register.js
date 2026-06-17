import "dotenv/config";
import axios from "axios";
import { config } from "../config/env.js";

async function register() {
  const payload = {
    email: process.env.REGISTER_EMAIL ?? process.env.AUTH_EMAIL,
    name: process.env.REGISTER_NAME ?? process.env.AUTH_NAME,
    mobileNo: process.env.REGISTER_MOBILE ?? "9999999999",
    githubUsername: process.env.REGISTER_GITHUB ?? "github",
    rollNo: process.env.REGISTER_ROLL_NO ?? process.env.AUTH_ROLL_NO,
    accessCode: process.env.REGISTER_ACCESS_CODE ?? process.env.AUTH_ACCESS_CODE,
  };

  const missing = Object.entries(payload)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    console.error("Missing:", missing.join(", "));
    process.exit(1);
  }

  const { data } = await axios.post(`${config.evaluationBase}/register`, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
  });

  console.log(JSON.stringify(data, null, 2));
  console.log("\nSave clientID and clientSecret in .env — you cannot retrieve them again.");
}

register().catch((err) => {
  console.error(err.response?.data?.message ?? err.message);
  process.exit(1);
});
