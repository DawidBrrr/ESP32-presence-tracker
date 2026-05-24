const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const wsBaseUrl =
  process.env.NEXT_PUBLIC_WS_BASE_URL ??
  apiBaseUrl.replace(/^http(s?):/, "ws$1:");

export { apiBaseUrl, wsBaseUrl };
