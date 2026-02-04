import { clearSession, getSession } from "./session.js";

const ROOMS_STORAGE_KEY = "tet_game_rooms";
const DEFAULT_ROOMS = [
  {
    id: "demo",
    name: "Demo Room",
    status: "READY",
    playerCount: 1,
    capacity: 2,
  },
  {
    id: "silent",
    name: "Silent Room",
    status: "WAITING",
    playerCount: 0,
    capacity: 2,
  },
  {
    id: "full",
    name: "Full House",
    status: "READY",
    playerCount: 2,
    capacity: 2,
  },
];

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

const readRooms = () => {
  const raw = window.localStorage.getItem(ROOMS_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_ROOMS;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ROOMS;
  } catch (error) {
    return DEFAULT_ROOMS;
  }
};

const writeRooms = (rooms) => {
  window.localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
};

export const getRoom = async (roomId) => {
  const session = getSession();

  if (!session) {
    handleApiError(401);
    throw { status: 401 };
  }

  try {
    const rooms = readRooms();
    const room = rooms.find((item) => item.id === roomId);

    if (!room) {
      return await mockRequest({ status: 404 });
    }

    return await mockRequest({ data: room });
  } catch (error) {
    handleApiError(error.status);
    throw error;
  }
};

export const getRooms = async () => {
  const session = getSession();

  if (!session) {
    handleApiError(401);
    throw { status: 401 };
  }

  try {
    return await mockRequest({
      data: {
        rooms: readRooms(),
        canCreateRoom: true,
      },
    });
  } catch (error) {
    handleApiError(error.status);
    throw error;
  }
};

export const createRoom = async () => {
  const session = getSession();

  if (!session) {
    handleApiError(401);
    throw { status: 401 };
  }

  try {
    const rooms = readRooms();
    const newRoom = {
      id: `room-${Date.now()}`,
      name: "Quick Room",
      status: "WAITING",
      playerCount: 1,
      capacity: 2,
    };
    const updatedRooms = [newRoom, ...rooms];
    writeRooms(updatedRooms);

    return await mockRequest({ data: newRoom });
  } catch (error) {
    handleApiError(error.status);
    throw error;
  }
};
