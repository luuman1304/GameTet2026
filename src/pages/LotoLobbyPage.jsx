import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createRoom } from "../api/client.js";

const LotoLobbyPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    visibility: "public",
    winRule: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const room = await createRoom(formState);
      navigate(`/loto/room/${room.id}`);
    } catch (error) {
      setErrorMessage("Không thể tạo phòng ngay lúc này. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="card">
        <h2>Tạo phòng mới (optional)</h2>
        <p>Thiết lập phòng chơi với rule cơ bản trước khi mời bạn bè.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="room-name">
            Tên phòng
            <input
              id="room-name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Ví dụ: Hội bạn thân"
            />
          </label>
          <label className="form-label" htmlFor="room-visibility">
            Chế độ phòng
            <select
              id="room-visibility"
              name="visibility"
              value={formState.visibility}
              onChange={handleChange}
            >
              <option value="public">Public - ai cũng có thể vào</option>
              <option value="private">Private - chỉ người có mã</option>
            </select>
          </label>
          <label className="form-label" htmlFor="room-win-rule">
            Win rule (nếu có)
            <input
              id="room-win-rule"
              name="winRule"
              value={formState.winRule}
              onChange={handleChange}
              placeholder="Ví dụ: Bingo 1 hàng"
            />
          </label>
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo phòng"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LotoLobbyPage;
