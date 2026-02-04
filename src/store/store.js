import { createContext, useContext, useMemo, useReducer } from "react";
import {
  clearSession as clearPersistedSession,
  getSession as getPersistedSession,
  setSession as persistSession,
} from "../api/session.js";
import { RoomStatus } from "./types.js";

const SESSION_STATUS = {
  GUEST: "guest",
  LOGIN: "login",
};

const normalizePlayers = (players = []) => {
  const playersById = {};
  const playerIds = [];

  players.forEach((player) => {
    playersById[player.id] = player;
    playerIds.push(player.id);
  });

  return { playersById, playerIds };
};

const persistedSession = getPersistedSession();

const initialState = {
  session: {
    status: persistedSession ? SESSION_STATUS.LOGIN : SESSION_STATUS.GUEST,
    user: persistedSession,
  },
  lobby: {
    rooms: [
      {
        id: "demo",
        name: "Demo Room",
        status: RoomStatus.READY,
        playerCount: 4,
        maxPlayers: 6,
      },
      {
        id: "404",
        name: "Room 404",
        status: RoomStatus.WAITING,
        playerCount: 0,
        maxPlayers: 6,
      },
    ],
  },
  room: {
    status: "idle",
    roomId: null,
    snapshot: null,
    playersById: {},
    playerIds: [],
    round: null,
    tickets: [],
    events: [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SESSION_SET": {
      return {
        ...state,
        session: {
          status: action.payload ? SESSION_STATUS.LOGIN : SESSION_STATUS.GUEST,
          user: action.payload,
        },
      };
    }
    case "SESSION_CLEAR": {
      return {
        ...state,
        session: {
          status: SESSION_STATUS.GUEST,
          user: null,
        },
      };
    }
    case "LOBBY_SET_ROOMS": {
      return {
        ...state,
        lobby: {
          ...state.lobby,
          rooms: action.payload,
        },
      };
    }
    case "ROOM_LOADING": {
      return {
        ...state,
        room: {
          ...state.room,
          status: "loading",
          roomId: action.payload,
        },
      };
    }
    case "ROOM_SNAPSHOT": {
      const { playersById, playerIds } = normalizePlayers(
        action.payload.players
      );
      const { players, ...snapshot } = action.payload;

      return {
        ...state,
        room: {
          ...state.room,
          status: "ready",
          roomId: action.payload.id,
          snapshot,
          playersById,
          playerIds,
          round: action.payload.round ?? null,
          tickets: action.payload.tickets ?? [],
          events: action.payload.events ?? [],
        },
      };
    }
    case "ROOM_ERROR": {
      return {
        ...state,
        room: {
          ...state.room,
          status: action.payload,
        },
      };
    }
    case "ROOM_EVENT": {
      return {
        ...state,
        room: {
          ...state.room,
          events: [...state.room.events, action.payload],
        },
      };
    }
    default:
      return state;
  }
};

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      setSession: (session) => {
        persistSession(session);
        dispatch({ type: "SESSION_SET", payload: session });
      },
      clearSession: () => {
        clearPersistedSession();
        dispatch({ type: "SESSION_CLEAR" });
      },
      setLobbyRooms: (rooms) =>
        dispatch({ type: "LOBBY_SET_ROOMS", payload: rooms }),
      setRoomLoading: (roomId) =>
        dispatch({ type: "ROOM_LOADING", payload: roomId }),
      setRoomSnapshot: (snapshot) =>
        dispatch({ type: "ROOM_SNAPSHOT", payload: snapshot }),
      setRoomError: (status) =>
        dispatch({ type: "ROOM_ERROR", payload: status }),
      addRoomEvent: (event) => dispatch({ type: "ROOM_EVENT", payload: event }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
