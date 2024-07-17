import { ReactNode, useState } from "react";
import { Navigate } from "react-router-dom";
import { Usuario } from "../types/usuario/Usuario";

export const RutaPrivada = ({ children }: { children: ReactNode }) => {
  const [usuario] = useState<Usuario>(
    localStorage.getItem("usuario") as unknown as Usuario
  );

  return usuario ? children : <Navigate to="/login" />;
};
