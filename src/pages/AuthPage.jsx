import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/client.js";
import { setSession } from "../api/session.js";

const AuthPage = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("loading");
    const trimmed = nickname.trim();
    try {
      const response = await login({ username: trimmed, password });
      setSession({
        token: response.data.token,
        nickname: response.data.profile.nickname,
        wallet: response.data.profile.wallet,
        history: response.data.profile.history,
      });
      const redirect = location.state?.from ?? "/";
      navigate(redirect, { replace: true });
    } catch (loginError) {
      setError("Vui lòng nhập tài khoản và mật khẩu hợp lệ.");
      setStatus("idle");
    }
  };

  const isLoading = status === "loading";

  return (
    <section className="page">
      <h1>Đăng nhập</h1>
      <p>Đăng nhập để có account thật, ví đậu và lịch sử (stub).</p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Tài khoản
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Nhập username"
            autoComplete="username"
          />
        </label>
        <label className="form-label">
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthPage;
