import { Link } from "react-router-dom";

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
  return (
    <section className="page">
      <h1>Hub</h1>
      <p>Chọn sảnh game bạn muốn tham gia.</p>
      <div className="card-grid">
        {gameCards.map((card) =>
          card.isActive ? (
            <Link key={card.id} className="card" to={card.path}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </Link>
          ) : (
            <div key={card.id} className="card card--disabled">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <span className="card__status">Sắp ra mắt</span>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default HubPage;
