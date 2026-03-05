import { createHash, randomBytes } from "crypto";

export function generateHostToken() {
  return randomBytes(18).toString("hex");
}

export function hashHostToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
