import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getRooms } from "../api/client.js";

const LotoLobbyPage = () => {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [stateFilter, setStateFilter] = useState("ALL");
  const [playersFilter, setPlayersFilter] = useState("ALL");

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");
    getRooms()
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setRooms(data);
        setStatus("success");
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err);
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (
        stateFilter !== "ALL" &&
        !(stateFilter === "WAITING" && room.state === "READY") &&
        room.state !== stateFilter
      ) {
        return false;
      }

      if (playersFilter === "ALL") {
        return true;
      }

      const [min, max] = playersFilter.split("-").map(Number);
      return room.playersCount >= min && room.playersCount <= max;
    });
  }, [rooms, stateFilter, playersFilter]);

  const stateLabels = {
    WAITING: "Đang chờ",
    READY: "Sẵn sàng",
    PLAYING: "Đang chơi",
  };

  return (
    <section className="page">
      <h1>Loto Lobby</h1>
      <p>Chọn phòng để bắt đầu chơi.</p>
      <div className="filter-bar">
        <label className="filter-control">
          Trạng thái
          <select
            value={stateFilter}
            onChange={(event) => setStateFilter(event.target.value)}
          >
            <option value="ALL">Tất cả</option>
            <option value="WAITING">Đang chờ / sẵn sàng</option>
            <option value="PLAYING">Đang chơi</option>
          </select>
        </label>
        <label className="filter-control">
          Số người chơi
          <select
            value={playersFilter}
            onChange={(event) => setPlayersFilter(event.target.value)}
          >
            <option value="ALL">Tất cả</option>
            <option value="2-5">2 - 5</option>
            <option value="6-10">6 - 10</option>
            <option value="11-15">11 - 15</option>
            <option value="16-20">16 - 20</option>
          </select>
        </label>
      </div>
      {status === "loading" && <p>Đang tải danh sách phòng...</p>}
      {status === "error" && (
        <p className="helper-error">
          Không thể tải danh sách phòng. {error?.status && `Mã lỗi: ${error.status}`}
        </p>
      )}
      {status === "success" && filteredRooms.length === 0 && (
        <p className="helper-muted">Không có phòng phù hợp bộ lọc.</p>
      )}
      <div className="card-grid">
        {filteredRooms.map((room) => {
          const isFull = room.playersCount >= 20;
          const isPlaying = room.state === "PLAYING";
          const isJoinable = !isFull && !isPlaying;

          return (
            <div className="card room-card" key={room.id}>
              <div className="room-card__header">
                <div>
                  <p className="room-id">#{room.id}</p>
                  <h3>{room.name}</h3>
                </div>
                <span className={`room-state room-state--${room.state.toLowerCase()}`}>
                  {stateLabels[room.state] ?? room.state}
                </span>
              </div>
              <p className="room-players">
                Người chơi: <strong>{room.playersCount}</strong>/20
              </p>
              {isJoinable ? (
                <Link className="primary-button" to={`/loto/room/${room.id}`}>
                  Tham gia
                </Link>
              ) : (
                <button className="primary-button button-disabled" type="button" disabled>
                  {isFull ? "Đầy chỗ" : "Đang chơi"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LotoLobbyPage;
