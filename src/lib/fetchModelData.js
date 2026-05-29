import { API_BASE_URL } from "./apiConfig";

export const UNAUTHORIZED_EVENT = "photoApp:unauthorized";

function buildApiUrl(modelUrl, addCacheBuster = false) {
  const apiBaseUrl = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = modelUrl.startsWith("/") ? modelUrl : `/${modelUrl}`;
  const apiUrl = new URL(
    `${apiBaseUrl}${normalizedPath}`,
    window.location.origin
  );

  if (addCacheBuster) {
    apiUrl.searchParams.set("_", Date.now().toString());
  }

  return apiUrl.toString();
}

function buildRequestBody(body, headers) {
  if (body === undefined || body instanceof FormData) {
    return body;
  }

  headers["Content-Type"] = "application/json";
  return JSON.stringify(body);
}

async function readResponseBody(response) {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

function getResponseMessage(response, responseBody) {
  if (responseBody && typeof responseBody === "object" && responseBody.message) {
    return responseBody.message;
  }

  if (typeof responseBody === "string") {
    return responseBody;
  }

  return `Request failed with status ${response.status}`;
}

export async function apiRequest(modelUrl, options = {}) {
  const method = options.method || "GET";
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };
  const body = buildRequestBody(options.body, headers);
  const response = await fetch(buildApiUrl(modelUrl, method === "GET"), {
    method,
    headers,
    body,
    cache: method === "GET" ? "no-store" : "default",
    credentials: "include",
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }

    const error = new Error(getResponseMessage(response, responseBody));
    error.status = response.status;
    throw error;
  }

  return responseBody;
}

export function postJson(modelUrl, body) {
  return apiRequest(modelUrl, {
    method: "POST",
    body,
  });
}

export function postFormData(modelUrl, formData) {
  return apiRequest(modelUrl, {
    method: "POST",
    body: formData,
  });
}

function fetchModel(modelUrl) {
  return apiRequest(modelUrl);
}

export default fetchModel;
