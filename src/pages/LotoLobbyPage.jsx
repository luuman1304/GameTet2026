import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createRoom, getRooms } from "../api/client.js";

const LotoLobbyPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [canCreateRoom, setCanCreateRoom] = useState(false);
  const [status, setStatus] = useState("loading");
  const [quickJoinStatus, setQuickJoinStatus] = useState("idle");
  const [quickJoinMessage, setQuickJoinMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");

    getRooms()
      .then((data) => {
        if (!isMounted) return;
        setRooms(data.rooms ?? []);
        setCanCreateRoom(Boolean(data.canCreateRoom));
        setStatus("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const bestRoom = useMemo(() => {
    const eligibleRooms = rooms
      .filter(
        (room) =>
          ["WAITING", "READY"].includes(room.status) &&
          room.playerCount < room.capacity,
      )
      .sort((roomA, roomB) => roomB.playerCount - roomA.playerCount);
    return eligibleRooms[0] ?? null;
  }, [rooms]);

  const handleQuickJoin = async () => {
    if (quickJoinStatus === "loading") {
      return;
    }

    setQuickJoinMessage("");
    setQuickJoinStatus("loading");

    if (bestRoom) {
      navigate(`/loto/room/${bestRoom.id}`);
      return;
    }

    if (canCreateRoom) {
      try {
        const newRoom = await createRoom();
        setRooms((prevRooms) => [newRoom, ...prevRooms]);
        navigate(`/loto/room/${newRoom.id}`);
        return;
      } catch (error) {
        setQuickJoinMessage("Không thể tạo phòng mới. Vui lòng thử lại.");
        setQuickJoinStatus("idle");
        return;
      }
    }

    setQuickJoinMessage("Hiện không có phòng phù hợp để vào nhanh.");
    setQuickJoinStatus("idle");
  };

  return (
    <section className="page">
      <h1>Loto Lobby</h1>
      <p>Chọn phòng để bắt đầu chơi.</p>
      <div className="lobby-actions">
        <button
          className="primary-button"
          type="button"
          onClick={handleQuickJoin}
          disabled={status !== "ready" || quickJoinStatus === "loading"}
        >
          {quickJoinStatus === "loading" ? "Đang tìm phòng..." : "Quick Join"}
        </button>
        <div className="lobby-meta">
          {status === "loading" && <span>Đang tải danh sách phòng...</span>}
          {status === "error" && (
            <span>Không thể tải phòng. Hãy thử lại sau.</span>
          )}
          {status === "ready" && bestRoom && (
            <span>
              Ưu tiên: {bestRoom.name} • {bestRoom.playerCount}/
              {bestRoom.capacity} người
            </span>
          )}
          {quickJoinMessage && <span>{quickJoinMessage}</span>}
        </div>
      </div>
      <div className="card-grid">
        {rooms.map((room) => (
          <Link key={room.id} className="card" to={`/loto/room/${room.id}`}>
            <h3>{room.name}</h3>
            <p>
              Trạng thái: {room.status} • {room.playerCount}/{room.capacity}{" "}
              người
            </p>
          </Link>
        ))}
        <Link className="card" to="/loto/room/404">
          <h3>Room 404</h3>
          <p>Kiểm tra điều hướng khi phòng không tồn tại.</p>
        </Link>
      </div>
    </section>
  );
};

export default LotoLobbyPage;
