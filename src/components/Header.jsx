import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../api/session.js";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();
  const nickname = session?.nickname ?? "Guest";
  const beanBalance = session?.wallet?.beans ?? 0;
  const canGoBack = useMemo(() => location.pathname !== "/", [location.pathname]);

  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleExit = () => {
    clearSession();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button type="button" className="ghost-button" onClick={handleBack}>
          Back
        </button>
        <div className="app-title">
          <span className="app-title__name">Tết Game Hub</span>
          <span className="app-title__nickname">{nickname}</span>
          <span className="app-title__meta">Ví đậu: {beanBalance}</span>
        </div>
      </div>
      <button type="button" className="danger-button" onClick={handleExit}>
        Thoát
      </button>
    </header>
  );
};

export default Header;
