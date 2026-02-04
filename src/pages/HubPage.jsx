import { Link } from "react-router-dom";
import { getSession } from "../api/session.js";

const gameCards = [
  {
    id: "loto",
    title: "Loto",
    description: "Tham gia phòng Loto cùng bạn bè.",
    path: "/loto/lobby",
    isActive: true,
  },
  {
    id: "baccarat",
    title: "Baccarat",
    description: "Đặt cược nhanh với luật chơi đơn giản.",
    isActive: false,
  },
  {
    id: "roulette",
    title: "Roulette",
    description: "Chọn số may mắn để thử vận.",
    isActive: false,
  },
];

const HubPage = () => {
  const session = getSession();
  const history = session?.history ?? [];

  return (
    <section className="page">
      <h1>Hub</h1>
      <p>Chọn sảnh game bạn muốn tham gia.</p>
      {session?.token ? (
        <div className="account-panel">
          <h2>Thông tin account</h2>
          <p>Ví đậu: {session.wallet?.beans ?? 0}</p>
          <div>
            <h3>Lịch sử gần đây</h3>
            {history.length === 0 ? (
              <p>Chưa có lịch sử.</p>
            ) : (
              <ul>
                {history.map((item) => (
                  <li key={item.id}>
                    {item.title} — {item.result}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="account-panel">
          <h2>Bạn chưa đăng nhập</h2>
          <p>Đăng nhập để xem ví đậu và lịch sử chơi.</p>
        </div>
      )}
      <div className="card-grid">
        <Link className="card" to="/loto/lobby">
          <h3>Loto Lobby</h3>
          <p>Tham gia phòng Loto cùng bạn bè.</p>
        </Link>
        <Link className="card" to="/auth">
          <h3>Đăng nhập</h3>
          <p>Đăng nhập để sử dụng account thật.</p>
        </Link>
      </div>
    </section>
  );
};

export default HubPage;
