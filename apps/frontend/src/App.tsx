import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { RegisterScreen } from "./pages/RegisterScreen";

const LoginPlaceHolderScreen = () => (
  <AuthLayout title="Iniciar sesión - MEUX LAB" heading="Iniciar sesión">
    <p className="field-hint">Paantalla de inicio de sesión (proximamente!).</p>
  </AuthLayout>
);

const DashboardPlaceHolderScreen = () => (
  <AuthLayout title="Dashboard - MEUX LAB" heading="Dashboard principal">
    <p className="field-hint">Bienvenido a MEUX LAB.</p>
  </AuthLayout>
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginPlaceHolderScreen />} />
        <Route path="/dashboard" element={<DashboardPlaceHolderScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
