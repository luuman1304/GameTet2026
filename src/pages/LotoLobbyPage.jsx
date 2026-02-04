import { Link } from "react-router-dom";
import { useStore } from "../store/index.js";

const LotoLobbyPage = () => {
  const {
    state: {
      lobby: { rooms },
    },
  } = useStore();

  return (
    <section className="page">
      <h1>Loto Lobby</h1>
      <p>Chọn phòng để bắt đầu chơi.</p>
      <div className="card-grid">
        {rooms.map((room) => (
          <Link key={room.id} className="card" to={`/loto/room/${room.id}`}>
            <h3>{room.name}</h3>
            <p>Trạng thái: {room.status}</p>
            <p>
              Người chơi: {room.playerCount}/{room.maxPlayers}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LotoLobbyPage;
