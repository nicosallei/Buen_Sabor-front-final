import { useState, useEffect } from "react";
import {
  descargarFactura,
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
        const idCliente = localStorage.getItem("id"); // Asegúrate de que 'idCliente' se guarde en el Storage
        const rol = localStorage.getItem("rol"); // Asegúrate de que 'rol' se guarde en el Storage

        // Verificar si el usuario es un cliente
        if (rol === "CLIENTE" && idCliente) {
          const pedidosDelCliente = await fetchPedidosClientes(
            Number(idCliente)
          );
          setPedidos(pedidosDelCliente);
        }
      } catch (error) {
        console.error("Error al cargar los pedidos del cliente:", error);
      }
    };

    cargarPedidos();
  }, []);

  const pedidosFiltrados = pedidos.map((pedido: any, index) => ({
    ...pedido,
    numeroPedido: index + 1,
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
        // Formatear la fecha en el formato día/mes/año
        const opcionesDeFecha: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const fechaFormateada = new Date(fechaPedido).toLocaleDateString(
          "es",
          opcionesDeFecha
        );

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
      filters: [
        { text: "PENDIENTE", value: "PENDIENTE" },
        { text: "CONFIRMADO", value: "CONFIRMADO" },
        { text: "EN PPREPARACION", value: "EN_PREPARACION" },
        { text: "ENVIADO", value: "ENVIADO" },
        { text: "ENTREGADO", value: "ENTREGADO" },
        { text: "CANCELADO", value: "CANCELADO" },
      ],
      onFilter: (value: any, record: any) => record.estado.indexOf(value) === 0,
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

      <Table dataSource={pedidosFiltrados} columns={columns} rowKey="id" />
    </div>
  );
};

export default PedidosCliente;
