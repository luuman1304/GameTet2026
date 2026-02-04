import { clearSession, getSession } from "./session.js";
import { PlayerRoundStatus, RoomStatus } from "../store/index.js";

const buildAuthContext = (session) => {
  if (!session) {
    return {};
  }

  if (session.token) {
    return { token: session.token };
  }

  if (session.guestId) {
    return { guestId: session.guestId };
  }

  return {};
};

const handleApiError = (status) => {
  if (status === 401) {
    clearSession();
    window.location.assign("/auth");
  }

  if (status === 404) {
    window.location.assign("/loto/lobby");
  }
};

const mockRequest = ({ status, data, authContext }) => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      void authContext;

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

  const authContext = buildAuthContext(session);

  try {
    if (roomId !== "demo") {
      return await mockRequest({ status: 404, authContext });
    }

    return await mockRequest({
      data: { id: roomId, name: "Demo Room" },
      authContext,
    });
  } catch (error) {
    handleApiError(error.status);
    throw error;
  }
};
