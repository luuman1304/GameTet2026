import { clearSession, getSession } from "./session.js";
import { PlayerRoundStatus, RoomStatus } from "../store/index.js";

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

    return await mockRequest({
      data: {
        id: roomId,
        name: "Demo Room",
        status: RoomStatus.READY,
        players: [
          {
            id: "p1",
            name: "Lan",
            roundStatus: PlayerRoundStatus.READY,
            isHost: true,
          },
          {
            id: "p2",
            name: "Minh",
            roundStatus: PlayerRoundStatus.PLAYING,
          },
          {
            id: "p3",
            name: "Bảo",
            roundStatus: PlayerRoundStatus.NOT_READY,
          },
        ],
        round: {
          id: "round-1",
          status: RoomStatus.PLAYING,
          calledNumbers: [5, 11, 23],
        },
        tickets: [
          { id: "t1", ownerId: "p1", numbers: [1, 2, 3, 4, 5] },
          { id: "t2", ownerId: "p2", numbers: [6, 7, 8, 9, 10] },
        ],
        events: [{ id: "evt-1", type: "ROOM_READY", at: Date.now() }],
      },
    });
  } catch (error) {
    handleApiError(error.status);
    throw error;
  }
};
