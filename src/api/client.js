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

const ROOMS_STORAGE_KEY = "loto_rooms";

const getStoredRooms = () => {
  const raw = window.localStorage.getItem(ROOMS_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveRooms = (rooms) => {
  window.localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
};

const generateRoomId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(16).slice(2, 10);
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
      const storedRooms = getStoredRooms();
      const foundRoom = storedRooms.find((room) => room.id === roomId);

      if (!foundRoom) {
        return await mockRequest({ status: 404 });
      }

      return await mockRequest({ data: foundRoom });
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

export const createRoom = async ({ name, visibility, winRule }) => {
  const session = getSession();

  if (!session) {
    handleApiError(401);
    throw { status: 401 };
  }

  const trimmedName = name?.trim() || "Loto Room";
  const newRoom = {
    id: generateRoomId(),
    name: trimmedName,
    visibility,
    winRule: winRule?.trim() || null,
  };

  try {
    const storedRooms = getStoredRooms();
    const updatedRooms = [newRoom, ...storedRooms];
    saveRooms(updatedRooms);
    return await mockRequest({ data: newRoom });
  } catch (error) {
    handleApiError(error.status);
    throw error;
  }
};
