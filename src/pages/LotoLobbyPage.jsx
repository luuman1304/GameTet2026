import { Link } from "react-router-dom";

const LotoLobbyPage = () => {
  return (
    <section className="page">
      <h1>Loto Lobby</h1>
      <p>Chọn phòng để bắt đầu chơi.</p>
      <div className="card-grid">
        <Link className="card" to="/loto/room/demo">
          <h3>Demo Room</h3>
          <p>Room mẫu để test luồng vào phòng.</p>
        </Link>
        <Link className="card" to="/loto/room/404">
          <h3>Room 404</h3>
          <p>Kiểm tra điều hướng khi phòng không tồn tại.</p>
        </Link>
      </div>
    </section>
  );
};

export default LotoLobbyPage;
