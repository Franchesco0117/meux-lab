import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ApiError,
  type AuthUser,
  fetchCurrentUser,
} from "../services/auth.services";

export function DashboardScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const currentUser = await fetchCurrentUser();
        if (active) setUser(currentUser);
      } catch (error) {
        if (active && error instanceof ApiError && error.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();
    return () => {
      active = false;
    };
  }, [navigate]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return null;

  return (
    <main>
      <h1>Hola, {user.name}</h1>
    </main>
  );
}
