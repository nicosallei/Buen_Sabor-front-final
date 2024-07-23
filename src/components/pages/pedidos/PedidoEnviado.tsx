import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Table, message } from "antd";
import {
  cambiarEstadoPedido,
  Estado,
  fetchPedidos,
  Pedido,
} from "../../../service/PedidoService";
import { Empresas, getEmpresas } from "../../../service/ServiceEmpresa";
import { getSucursal, Sucursal } from "../../../service/ServiceSucursal";
import { useAuth0 } from "@auth0/auth0-react";
import { Rol } from "../../../types/usuario/Usuario";
const { Option } = Select;
const PedidosEnviados: React.FC = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<number>(0);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(
    null
  );
  const [isDisabled, setIsDisabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<Estado | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await getEmpresas();
      setEmpresas(empresasData);
    };

    fetchEmpresas();
  }, []);
  useEffect(() => {
    // Obtener el rol del usuario desde el localStorage
    const rolUsuario = localStorage.getItem("rol"); // Asegúrate de que 'rolUsuario' sea la clave correcta
    setUserRole(rolUsuario);
  }, []);

  useEffect(() => {
    const fetchSucursales = async () => {
      if (selectedEmpresa) {
        const sucursalesData = await getSucursal(String(selectedEmpresa));
        setSucursales(sucursalesData);
      }
    };

    fetchSucursales();
  }, [selectedEmpresa]);

  useEffect(() => {
    const empresaId = localStorage.getItem("empresa_id");
    const sucursalId = localStorage.getItem("sucursal_id");
    if (empresaId && sucursalId) {
      setSelectedEmpresa(Number(empresaId));
      setSelectedSucursalId(Number(sucursalId));
      setIsDisabled(true);
    }
  }, []);

  const cargarPedidos = async () => {
    if (selectedSucursalId && selectedSucursalId > 0) {
      try {
        const todosLosPedidos = await fetchPedidos(selectedSucursalId);
        const pedidosFiltrados = todosLosPedidos.filter(
          (pedido: Pedido) => pedido.estado === Estado.ENVIADO
        );
        setPedidos(pedidosFiltrados);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
        message.error("Error al cargar los pedidos");
      }
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [selectedSucursalId]);

  const handleEstadoChange = async (id: number, nuevoEstado: Estado) => {
    try {
      const token = await getAccessTokenSilently();
      const pedidoActualizado = await cambiarEstadoPedido(
        id,
        nuevoEstado,
        token
      );
      message.success(
        `El pedido cambió su estado a: ${pedidoActualizado.estado}`
      );
      cargarPedidos(); // Recargar los pedidos para reflejar el cambio de estado
    } catch (error: any) {
      message.error(error.message);
      //alert(error.message);
    } finally {
      // Asegurarse de restablecer el estado del modal y los valores seleccionados, independientemente del resultado de la operación
      setModalVisible(false);
      setSelectedPedidoId(null);
      setNuevoEstado(null);
    }
  };

  const columns = [
    {
      title: "ID Pedido",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Hora del Pedido",
      dataIndex: "hora",
      key: "hora",
    },
    {
      title: "Fecha del Pedido",
      dataIndex: "fechaPedido",
      key: "fechaPedido",
      render: (fechaPedido: string) =>
        new Date(fechaPedido).toLocaleDateString(),
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
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado: Estado) => <>{estado}</>,
    },
    ...(userRole === "ADMINISTRADOR" || Rol.EMPLEADO_CAJA
      ? [
          {
            title: "Cambiar Estado",
            key: "cambiarEstado",
            render: (_text: any, record: any) => (
              <Button
                onClick={() => {
                  setSelectedPedidoId(record.id);
                  setModalVisible(true);
                }}
              >
                Cambiar Estado
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h1>PEDIDOS</h1>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            margin: "10px 0",
          }}
        >
          <Select
            placeholder="Seleccione una empresa"
            style={{ width: 200 }}
            onChange={(value) => setSelectedEmpresa(value)}
            value={selectedEmpresa || undefined}
            disabled={isDisabled}
          >
            {empresas.map((empresa) => (
              <Option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Seleccione una sucursal"
            style={{ width: 200 }}
            disabled={!selectedEmpresa || isDisabled}
            onChange={(value) => setSelectedSucursalId(Number(value))}
            value={selectedSucursalId || undefined}
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <h1>Pedidos Enviados</h1>
      <Table dataSource={pedidos} columns={columns} rowKey="id" />
      {userRole === "ADMINISTRADOR" ||
        (Rol.EMPLEADO_CAJA && (
          <Modal
            title="Cambiar Estado del Pedido"
            visible={modalVisible}
            onOk={() => {
              if (selectedPedidoId !== null && nuevoEstado !== null) {
                handleEstadoChange(selectedPedidoId, nuevoEstado);
              }
            }}
            onCancel={() => {
              setModalVisible(false);
              setSelectedPedidoId(null);
              setNuevoEstado(null);
            }}
          >
            <Select
              placeholder="Selecciona un estado"
              value={nuevoEstado}
              onChange={(value) => setNuevoEstado(value)}
              style={{ width: "100%" }}
            >
              <Select.Option value="ENTREGADO">ENTREGADO</Select.Option>
              <Select.Option value="CANCELADO">CANCELADO</Select.Option>
            </Select>
          </Modal>
        ))}
    </div>
  );
};

export default PedidosEnviados;
