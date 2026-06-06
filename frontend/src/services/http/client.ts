import { apiBaseUrl } from "../../config/env";

type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  headers?: HeadersInit;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const method = options.method ?? "GET";
  const hasBody = options.body !== undefined;
  const headers = new Headers(options.headers);

  if (hasBody) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    let message = `${response.status} ${response.statusText || "Request failed"}`;

    try {
      if (contentType.includes("application/json")) {
        const data = await response.json();
        message = data?.message ? String(data.message) : JSON.stringify(data);
      } else {
        const text = await response.text();
        if (text) {
          message = text;
        }
      }
    } catch {
      // If parsing fails, use default message with status code
    }

    // Add helpful debugging info for 403 errors
    if (response.status === 403) {
      message += " (Check backend CORS configuration and token validity)";
    }

    const error = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}
