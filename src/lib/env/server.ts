import "server-only";
import { getPublicEnv } from "@/lib/env/public";

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getServerEnv() {
  return {
    ...getPublicEnv(),
    supabaseServiceRoleKey: requireEnv(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  };
}
