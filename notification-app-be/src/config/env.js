import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 5000),
  evaluationBase: process.env.EVALUATION_BASE_URL ?? "http://4.224.186.213/evaluation-service",
  prioritySize: Number(process.env.PRIORITY_INBOX_SIZE ?? 10),
  auth: {
    email: process.env.AUTH_EMAIL ?? "",
    name: process.env.AUTH_NAME ?? "",
    rollNo: process.env.AUTH_ROLL_NO ?? "",
    accessCode: process.env.AUTH_ACCESS_CODE ?? "",
    clientID: process.env.AUTH_CLIENT_ID ?? "",
    clientSecret: process.env.AUTH_CLIENT_SECRET ?? "",
  },
};
