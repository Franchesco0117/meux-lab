import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { RegisterScreen } from "./pages/RegisterScreen";
import { LoginScreen } from "./pages/LoginScreen";
import { DashboardScreen } from "./pages/DashboardScreen";
import { AppLayout } from "./layouts/AppLayout";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
