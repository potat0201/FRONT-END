export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

export function getApiOrigin() {
  return new URL(API_BASE_URL, window.location.origin).origin;
}
