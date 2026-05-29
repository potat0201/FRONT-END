const CURRENT_USER_KEY = "photoApp.currentUser";

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

export function saveSession(user) {
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem(CURRENT_USER_KEY);
}
