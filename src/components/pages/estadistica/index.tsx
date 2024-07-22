import { Link } from "react-router-dom";
import { Card } from "antd";
import { useState } from "react";

import imagenGraficos from "../../../assets/graficos.png";
import imagenEstadistica from "../../../assets/estadisticas.jpg";

const VistaPrincipal = () => {
  const [isHovered, setIsHovered] = useState({
    graficos: false,
    estadistica: false,
  });

  const cardStyle = {
    width: "100%",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    transition: "0.3s",
  };

  const hoverStyle = {
    ...cardStyle,
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
    transform: "scale(1.05)", // Aumenta el tamaño de la tarjeta un 5%
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        GRÁFICOS Y ESTADÍSTICAS
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh", // Reducido de 100vh a 90vh
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "80%",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <Link to="/graficos" style={{ textDecoration: "none", width: "30%" }}>
            <Card
              hoverable
              style={isHovered.graficos ? hoverStyle : cardStyle}
              cover={
                <img
                  alt="Graficos de Productos y Pedidos"
                  src={imagenGraficos}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              }
              onMouseEnter={() =>
                setIsHovered({ ...isHovered, graficos: true })
              }
              onMouseLeave={() =>
                setIsHovered({ ...isHovered, graficos: false })
              }
            >
              <Card.Meta title="Graficos de Productos y Pedidos" />
            </Card>
          </Link>
          <Link
            to="/estadistica"
            style={{ textDecoration: "none", width: "30%" }}
          >
            <Card
              hoverable
              style={isHovered.estadistica ? hoverStyle : cardStyle}
              cover={
                <img
                  alt="Estadística Ingresos y Ganancias"
                  src={imagenEstadistica}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              }
              onMouseEnter={() =>
                setIsHovered({ ...isHovered, estadistica: true })
              }
              onMouseLeave={() =>
                setIsHovered({ ...isHovered, estadistica: false })
              }
            >
              <Card.Meta title="Estadística Ingresos y Ganancias" />
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VistaPrincipal;
