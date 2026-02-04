const STORAGE_KEY = "tet_game_hub_session";

const generateGuestId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  const randomSuffix = Math.random().toString(16).slice(2);
  return `guest-${Date.now()}-${randomSuffix}`;
};

export const getSession = () => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const setSession = (session) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const createGuestSession = (nickname, existingSession) => {
  const guestId = existingSession?.guestId ?? generateGuestId();

  return {
    guestId,
    nickname,
    mode: "guest",
  };
};

export const clearSession = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};
