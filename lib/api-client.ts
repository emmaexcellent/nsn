"use client";

import { account } from "@/lib/appwrite";

type ApiRequestOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init: ApiRequestOptions = {}
): Promise<T> {
  const headers = new Headers(init.headers);

  if (!init.skipAuth) {
    const jwt = await account.createJWT();
    headers.set("Authorization", `Bearer ${jwt.jwt}`);
  }

  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "object" && body && "message" in body
        ? String(body.message)
        : "Request failed";

    throw new Error(message);
  }

  return body as T;
}
