import { useState, useEffect } from "react";
import {
  descargarFactura,
  fetchPedidosClientes,
} from "../../../service/PedidoService"; // Asegúrate de usar el path correcto
import { Select, Spin, Table } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { Cliente, getClientes } from "../../../service/ClienteService";
import moment from "moment";

const { Option } = Select;
const PedidosCliente = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargandoClientes, setCargandoClientes] = useState(false);
  // Obtener el rol y el ID del usuario desde el almacenamiento local
  const rolUsuario = localStorage.getItem("rol");
  const idUsuario = localStorage.getItem("id");
  // Configurar el estado inicial de clienteSeleccionado basado en el rol del usuario
  const [clienteSeleccionado, setClienteSeleccionado] = useState(
    rolUsuario === "CLIENTE" ? idUsuario : undefined
  );
  useEffect(() => {
    const cargarClientes = async () => {
      setCargandoClientes(true);
      try {
        const clientesObtenidos = await getClientes();
        setClientes(clientesObtenidos);
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
      } finally {
        setCargandoClientes(false);
      }
    };

    cargarClientes();
  }, []);

  useEffect(() => {
    const cargarPedidos = async () => {
      if (!clienteSeleccionado) return;
      try {
        const pedidosDelCliente = await fetchPedidosClientes(
          Number(clienteSeleccionado)
        );
        setPedidos(pedidosDelCliente);
      } catch (error) {
        console.error("Error al cargar los pedidos del cliente:", error);
      }
    };

    cargarPedidos();
  }, [clienteSeleccionado]);

  const filtrarPedidosPorFechaYAgregarNumero = (pedidos: any) => {
    const rangoFechas: string | any[] = []; // Asegúrate de definir el rango de fechas correctamente
    let pedidosFiltrados = pedidos;
    if (rangoFechas.length === 2) {
      const [inicio, fin] = rangoFechas;
      pedidosFiltrados = pedidos.filter((pedido: any) => {
        const fechaPedido = moment(pedido.fechaPedido);
        return fechaPedido.isBetween(inicio, fin, undefined, "[]");
      });
    }
    // Añadir el número de pedido basado en el índice del array
    return pedidosFiltrados.map((pedido: any, index: any) => ({
      ...pedido,
      numeroPedido: index + 1, // Añade 1 para empezar la numeración desde 1
    }));
  };

  // const pedidosFiltrados = pedidos.map((pedido: any, index) => ({
  //   ...pedido,
  //   numeroPedido: index + 1,
  // }));

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
      sorter: (a: any, b: any) =>
        moment(a.fechaPedido).unix() - moment(b.fechaPedido).unix(),
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
      {cargandoClientes ? (
        <Spin />
      ) : (
        // Renderizar el selector de clientes solo si el usuario no es un cliente
        rolUsuario !== "CLIENTE" && (
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Selecciona un cliente"
            optionFilterProp="children"
            onChange={(value) => setClienteSeleccionado(value)}
            filterOption={(input, option) =>
              (option?.children?.toString().toLowerCase() ?? "").includes(
                input.toLowerCase()
              )
            }
          >
            {clientes.map((cliente) => (
              <Option
                key={cliente.id}
                value={cliente.id}
              >{`${cliente.nombre} ${cliente.apellido}`}</Option>
            ))}
          </Select>
        )
      )}

      <Table
        dataSource={filtrarPedidosPorFechaYAgregarNumero(pedidos)}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default PedidosCliente;
