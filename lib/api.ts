export type JsonBodyResult = { ok: true; data: unknown } | { ok: false };

export async function parseJsonBody(request: Request): Promise<JsonBodyResult> {
  try {
    return { ok: true, data: await request.json() };
  } catch {
    return { ok: false };
  }
}
