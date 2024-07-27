import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  BrowserRouter as Router,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import Sider from "./components/element/menuLateral/Sider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RutasSinSidebar from "./routes/RutasSinSidebar.tsx";

const AppContent = () => {
  const location = useLocation();
  const noSiderRoutes = ["/login", "/registro-cliente", "/callback", "/"];

  // Redirigir de /login/ a /login
  if (location.pathname === "/login/") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {!noSiderRoutes.includes(location.pathname) && <Sider />}
      <RutasSinSidebar />
      <ToastContainer />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  </React.StrictMode>
);
