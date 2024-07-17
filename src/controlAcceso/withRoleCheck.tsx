import { Navigate } from "react-router-dom";

const withRoleCheck = (WrappedComponen: any, allowedRoles: any) => {
  return (props: any) => {
    const userRole = localStorage.getItem("rol");

    if (!allowedRoles.includes(userRole)) {
      // Si el usuario no tiene un rol permitido, redirigir a la página de error o inicio de sesión
      return <Navigate to="/login" />;
    }

    return <WrappedComponen {...props} />;
  };
};

export default withRoleCheck;
