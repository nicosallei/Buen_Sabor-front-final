import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Callback = () => {
  const { isAuthenticated } = useAuth0();

  React.useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/"; // Redirige a una página específica después de la autenticación
    }
  }, [isAuthenticated]);

  return <div>Loading...</div>;
};

export default Callback;
