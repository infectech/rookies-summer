import { GOOGLE_SHEET_ENDPOINT } from "@/lib/config";
import { OrderPayload, OrderResponse } from "@/types";

const REQUEST_TIMEOUT_MS = 15_000;

// Server-side only: called from app/api/order/route.ts, which proxies
// browser requests so the Apps Script URL and any secrets never ship to
// the client, and so we sidestep the CORS/redirect quirks of Apps Script
// web apps when hit directly from a browser.
async function postWithRetry(
  payload: OrderPayload,
  attempts = 3
): Promise<OrderResponse> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS
    );

    try {
      const res = await fetch(GOOGLE_SHEET_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        redirect: "follow",
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Sheet API responded with status ${res.status}`);
      }

      const data = (await res.json()) as OrderResponse;
      if (!data.success) {
        throw new Error(data.message ?? "Order submission failed");
      }
      return data;
    } catch (err) {
      lastError =
        err instanceof Error && err.name === "AbortError"
          ? new Error(
              `Sheet API did not respond within ${REQUEST_TIMEOUT_MS}ms`
            )
          : err;
      if (attempt < attempts) {
        await new Promise((r) => setTimeout(r, attempt * 500));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unknown error submitting order");
}

export async function submitOrderToSheet(
  payload: OrderPayload
): Promise<OrderResponse> {
  if (!GOOGLE_SHEET_ENDPOINT) {
    throw new Error(
      "Google Sheet endpoint is not configured. Set GOOGLE_SHEET_WEBHOOK_URL."
    );
  }
  return postWithRetry(payload);
}
