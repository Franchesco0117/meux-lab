import { useOutletContext } from "react-router";
import type { AuthUser } from "../services/auth.services";

/** Usuario autenticado, disponible en cualquier pantalla dentro de <AppLayout /> */
export const useAppUser = (): AuthUser =>
  useOutletContext<{ user: AuthUser }>().user;
