const STORAGE_KEY = "tet_game_hub_session";

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

export const clearSession = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};
