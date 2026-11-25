import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { RegisterScreen } from "./pages/RegisterScreen";
import { LoginScreen } from "./pages/LoginScreen";
import { DashboardScreen } from "./pages/DashboardScreen";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
