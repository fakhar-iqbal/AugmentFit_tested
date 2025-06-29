import "./styles/app.css";
import NavigationPanel from "./components/NavigationPanel";
import Container from "./components/Container";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Header from "./components/Header";
import Settings from "./pages/settings";
import Users from "./pages/users";
import ContentVerification from "./pages/contentVerification";
import Trainers from "./pages/trainers";

function App() {
  return (
    <div>
      <NavigationPanel />
      <Container>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to={"/dashboard"} replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route
            path="/content-verification"
            element={<ContentVerification />}
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
