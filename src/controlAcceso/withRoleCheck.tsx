import { Navigate } from "react-router-dom";

const withRoleCheck = (WrappedComponen: any, allowedRoles: any) => {
  return (props: any) => {
    const userRole = localStorage.getItem("rol");

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/login" />;
    }

    return <WrappedComponen {...props} />;
  };
};

export default withRoleCheck;
