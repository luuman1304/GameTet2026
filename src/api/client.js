import { clearSession, getSession, getToken } from "./session.js";

const handleApiError = (status) => {
  if (status === 401) {
    clearSession();
    window.location.assign("/auth");
  }

  if (status === 404) {
    window.location.assign("/loto/lobby");
  }
};

const mockRequest = ({ status, data, headers }) => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (status && status >= 400) {
        reject({ status });
        return;
      }

      resolve({ data, headers });
    }, 200);
  });
};

const buildAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const login = async ({ username, password }) => {
  const trimmed = username.trim();
  if (!trimmed || !password) {
    throw { status: 400 };
  }

  const demoProfile = {
    nickname: trimmed,
    wallet: {
      beans: 4200,
    },
    history: [
      { id: "tet-1", title: "Loto Demo", result: "Thắng" },
      { id: "tet-2", title: "Loto Bạn bè", result: "Hòa" },
    ],
  };

  return mockRequest({
    data: {
      token: `tet-demo-${window.crypto.randomUUID()}`,
      profile: demoProfile,
    },
  });
};

export const createAuthedSocket = (path) => {
  const token = getToken();
  const url = new URL(path, window.location.origin);
  if (token) {
    url.searchParams.set("token", token);
  }
  return new WebSocket(url.toString());
};

export const getRoom = async (roomId) => {
  const session = getSession();

  if (!session?.token) {
    handleApiError(401);
    throw { status: 401 };
  }

  try {
    if (roomId !== "demo") {
      await mockRequest({ status: 404, headers: buildAuthHeaders() });
      return null;
    }

    const response = await mockRequest({
      data: { id: roomId, name: "Demo Room" },
      headers: buildAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error.status);
    throw error;
  }
};
