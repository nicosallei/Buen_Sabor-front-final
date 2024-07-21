import { useState, useEffect } from "react";
import {
  descargarFactura,
  Estado,
  fetchPedidosClientes,
} from "../../../service/PedidoService"; // Asegúrate de usar el path correcto
import { Table } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
const PedidosCliente = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        // Obtener el idCliente y el rol del Storage
        const idCliente = localStorage.getItem("idCliente"); // Asegúrate de que 'idCliente' se guarde en el Storage
        const rol = localStorage.getItem("rol"); // Asegúrate de que 'rol' se guarde en el Storage

        // Verificar si el usuario es un cliente
        if (rol === "Cliente" && idCliente) {
          const pedidosDelCliente = await fetchPedidosClientes(
            Number(idCliente)
          );
          setPedidos(pedidosDelCliente);
        } else {
          const pedidosDelCliente = await fetchPedidosClientes(Number(1));
          setPedidos(pedidosDelCliente);
        }
      } catch (error) {
        console.error("Error al cargar los pedidos del cliente:", error);
      }
    };

    cargarPedidos();
  }, []);

  const pedidosConNumero = pedidos.map((pedido: any, index) => ({
    ...pedido,
    numeroPedido: index + 1, // Esto añade un número de pedido que empieza en 1 y se incrementa
  }));

  const columns = [
    {
      title: "N° Pedido",
      dataIndex: "numeroPedido",
      key: "numeroPedido",
    },
    {
      title: "Fecha y Hora del Pedido",
      dataIndex: "fechaPedido",
      key: "fechaPedido",
      render: (fechaPedido: string, record: any) => {
        // Formatear la fecha
        const fechaFormateada = new Date(fechaPedido).toLocaleDateString();
        // Asumiendo que la hora viene en un formato 'HH:mm:ss' o similar y está en record.hora
        const partesHora = record.hora.split(":");
        const horaFormateada =
          partesHora.length >= 2
            ? `${partesHora[0]}:${partesHora[1]}`
            : record.hora;
        // Combinar fecha y hora con un guion como separador
        return `${fechaFormateada} - ${horaFormateada}`;
      },
    },
    {
      title: "Detalle del Pedido",
      key: "detalle",
      render: (_text: any, record: any) => (
        <ul>
          {record.pedidoDetalleDto.map((detalle: any) => (
            <li key={detalle.id}>
              {detalle.articulo.denominacion} - Cantidad: {detalle.cantidad}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Costo Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado: Estado) => <>{estado}</>,
    },
    {
      title: "Factura",
      key: "factura",
      render: (_text: any, record: any) => {
        if (record.estado === "ENTREGADO") {
          return (
            <FilePdfOutlined
              style={{ color: "red", fontSize: "20px" }}
              onClick={() => descargarFactura(record.id)}
            />
          );
        }
        return null;
      },
    },
  ];

  return (
    <div>
      <h2>Mis Pedidos</h2>

      <Table dataSource={pedidosConNumero} columns={columns} rowKey="id" />
    </div>
  );
};

export default PedidosCliente;
