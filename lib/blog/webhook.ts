import { createHmac, timingSafeEqual } from "node:crypto";

export type WebhookPayload = {
  event: string;
  post?: { slug?: unknown };
  previous?: { slug?: unknown };
  sentAt?: unknown;
};

export type WebhookValidation =
  | { ok: true; payload: WebhookPayload }
  | { ok: false; status: 400 | 401 | 503; error: string };

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export function validateBlogWebhook(
  rawBody: string,
  timestamp: string | null,
  signature: string | null,
  secret: string | undefined,
  now = Date.now(),
): WebhookValidation {
  if (!secret?.trim()) return { ok: false, status: 503, error: "Webhook is not configured" };
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const timestampMs = Number(timestamp) * 1000;
  if (!Number.isSafeInteger(timestampMs) || Math.abs(now - timestampMs) > FIVE_MINUTES_MS) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`, "utf8").digest();
  const normalized = signature.replace(/^sha256=/i, "").trim();
  if (!/^[a-f\d]{64}$/i.test(normalized)) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  const provided = Buffer.from(normalized, "hex");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON" };
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, status: 400, error: "Invalid JSON" };
  }
  return { ok: true, payload: payload as WebhookPayload };
}
