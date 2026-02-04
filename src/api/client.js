import { clearSession, getSession } from "./session.js";

const handleApiError = (status) => {
  if (status === 401) {
    clearSession();
    window.location.assign("/auth");
  }

  if (status === 404) {
    window.location.assign("/loto/lobby");
  }
};

const mockRequest = ({ status, data }) => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (status && status >= 400) {
        reject({ status });
        return;
      }

      resolve(data);
    }, 200);
  });
};

export const getRoom = async (roomId) => {
  const session = getSession();

  if (!session) {
    handleApiError(401);
    throw { status: 401 };
  }

  try {
    if (roomId !== "demo") {
      return await mockRequest({ status: 404 });
    }

    return await mockRequest({ data: { id: roomId, name: "Demo Room" } });
  } catch (error) {
    handleApiError(error.status);
    throw error;
  }
};
