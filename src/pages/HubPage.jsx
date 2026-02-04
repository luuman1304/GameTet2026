import { Link } from "react-router-dom";

const HubPage = () => {
  return (
    <section className="page">
      <h1>Hub</h1>
      <p>Chọn sảnh game bạn muốn tham gia.</p>
      <div className="card-grid">
        <Link className="card" to="/loto/lobby">
          <h3>Loto Lobby</h3>
          <p>Tham gia phòng Loto cùng bạn bè.</p>
        </Link>
        <Link className="card" to="/auth">
          <h3>Auth</h3>
          <p>Đăng nhập hoặc tiếp tục với tư cách khách.</p>
        </Link>
      </div>
    </section>
  );
};

export default HubPage;
