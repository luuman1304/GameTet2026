import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import HubPage from "./pages/HubPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import LotoLobbyPage from "./pages/LotoLobbyPage.jsx";
import LotoRoomPage from "./pages/LotoRoomPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HubPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/loto/lobby"
            element={
              <ProtectedRoute>
                <LotoLobbyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loto/room/:roomId"
            element={
              <ProtectedRoute>
                <LotoRoomPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
