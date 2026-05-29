import { getApiOrigin } from "./apiConfig";

export function buildImageUrl(fileName) {
  return `${getApiOrigin()}/images/${fileName}`;
}
