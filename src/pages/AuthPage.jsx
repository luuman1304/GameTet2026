import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setSession } from "../api/session.js";

const AuthPage = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = nickname.trim();
    const name = trimmed.length > 0 ? trimmed : "Guest";
    setSession({ nickname: name });
    const redirect = location.state?.from ?? "/";
    navigate(redirect, { replace: true });
  };

  const handleGuest = () => {
    setSession({ nickname: "Guest" });
    navigate("/", { replace: true });
  };

  return (
    <section className="page">
      <h1>Auth</h1>
      <p>Tạo session để vào lobby và room.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Nickname
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Nhập nickname"
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="primary-button">
            Tiếp tục
          </button>
          <button type="button" className="ghost-button" onClick={handleGuest}>
            Tiếp tục với khách
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthPage;
