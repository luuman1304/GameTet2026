import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createGuestSession, getSession, setSession } from "../api/session.js";

const AuthPage = () => {
  const session = useMemo(() => getSession(), []);
  const [nickname, setNickname] = useState(session?.nickname ?? "");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const maxLength = 20;

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = nickname.trim();

    if (trimmed.length === 0) {
      setError("Vui lòng nhập nickname.");
      return;
    }

    if (trimmed.length > maxLength) {
      setError(`Nickname tối đa ${maxLength} ký tự.`);
      return;
    }

    setSession(createGuestSession(trimmed, session));
    const redirect = location.state?.from ?? "/loto/lobby";
    navigate(redirect, { replace: true });
  };

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <section className="page">
      <h1>Vào chơi nhanh</h1>
      <p>Nhập nickname để tiếp tục vào lobby.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Nickname
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="Nhập nickname"
            maxLength={maxLength}
            aria-invalid={error ? "true" : "false"}
            aria-describedby="nickname-help"
          />
        </label>
        <p id="nickname-help" className={error ? "form-error" : "form-hint"}>
          {error || `Tối đa ${maxLength} ký tự.`}
        </p>
        <div className="form-actions">
          <button type="submit" className="primary-button">
            Tiếp tục
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthPage;
