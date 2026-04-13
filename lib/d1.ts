import { requireEnv } from "@/lib/env";

const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${requireEnv("CLOUDFLARE_ACCOUNT_ID")}/d1/database/${requireEnv("CLOUDFLARE_D1_DATABASE_ID")}/query`;

export async function queryD1<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await fetch(D1_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireEnv("CLOUDFLARE_API_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });

  const data = await res.json() as {
    success: boolean;
    errors: { message: string }[];
    result: { results: T[] }[];
  };

  if (!data.success) {
    throw new Error(data.errors?.[0]?.message ?? "D1 query failed");
  }

  return data.result?.[0]?.results ?? [];
}
