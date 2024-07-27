import { useState, useEffect } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import cancelado from "../../../assets/imagPedido/cancelado.png";
import entregado from "../../../assets/imagPedido/entregado.png";
import enviado from "../../../assets/imagPedido/enviando.jpeg";
import pedidoAprobado from "../../../assets/imagPedido/pedidoAprobado.jpg";
import pendiente from "../../../assets/imagPedido/pendiente.png";
import preparacion from "../../../assets/imagPedido/preparacion.jpeg";
import listo from "../../../assets/imagPedido/listo.jpg";

const PedidoMenu = () => {
  const [rolUsuario, setRolUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("rol");
    setRolUsuario(rol || "");
  }, []);

  const estadosPedidos = [
    {
      estado: "En Preparación",
      roles: ["ADMINISTRADOR", "ADMIN_SUCURSAL", "EMPLEADO_COCINA"],
      ruta: "/pedidos/preparacion",
      imagen: preparacion,
    },
    {
      estado: "Listo para Entregar",
      roles: ["ADMINISTRADOR", "ADMIN_SUCURSAL", "EMPLEADO_CAJA"],
      ruta: "/pedidos/listo-entregar",
      imagen: listo,
    },
    {
      estado: "Entregado",
      roles: ["ADMINISTRADOR", "ADMIN_SUCURSAL", "EMPLEADO_CAJA"],
      ruta: "/pedidos/entregado",
      imagen: entregado,
    },
    {
      estado: "Enviado",
      roles: ["ADMINISTRADOR", "EMPLEADO_REPARTIDOR"],
      ruta: "/pedidos/enviado",
      imagen: enviado,
    },
    {
      estado: "Pendiente",
      roles: ["ADMINISTRADOR", "EMPLEADO_CAJA"],
      ruta: "/pedidos/pendiente",
      imagen: pendiente,
    },
    {
      estado: "Cancelado",
      roles: ["ADMINISTRADOR", "ADMIN_SUCURSAL", "EMPLEADO_CAJA"],
      ruta: "/pedidos/cancelado",
      imagen: cancelado,
    },
    {
      estado: "Confirmado",
      roles: ["ADMINISTRADOR", "ADMIN_SUCURSAL", "EMPLEADO_COCINA"],
      ruta: "/pedidos/confirmado",
      imagen: pedidoAprobado,
    },
  ];

  const tarjetasFiltradas = estadosPedidos.filter((pedido) =>
    pedido.roles.includes(rolUsuario)
  );

  return (
    <div
      className="site-card-wrapper"
      style={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
      }}
    >
      {tarjetasFiltradas.map((pedido, index) => (
        <Card
          key={index}
          title={pedido.estado}
          bordered={false}
          onClick={() => navigate(pedido.ruta)}
          hoverable
          style={{
            width: "200px",
            height: "300px",
            margin: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          cover={
            <img
              alt={pedido.estado}
              src={pedido.imagen}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "contain",
              }}
            />
          }
        ></Card>
      ))}
    </div>
  );
};

export default PedidoMenu;
