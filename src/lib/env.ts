const required = ["DATABASE_URL", "CLERK_SECRET_KEY", "OPENAI_API_KEY"] as const;

export function validateEnv() {
  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`Missing environment variable: ${key}`);
    }
  }
}
