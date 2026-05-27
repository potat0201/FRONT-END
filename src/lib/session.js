const CURRENT_USER_KEY = "photoApp.currentUser";
const AUTH_TOKEN_KEY = "photoApp.authToken";

export function loadCurrentUser() {
  const storedUser = sessionStorage.getItem(CURRENT_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function getAuthToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveSession(user, token) {
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  if (token) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function clearSession() {
  sessionStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}
