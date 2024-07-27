import { Select, Table, message, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { Empresas, getEmpresas } from "../../../service/ServiceEmpresa";
import { getSucursal, Sucursal } from "../../../service/ServiceSucursal";
import {
  Estado,
  fetchPedidos,
  cambiarEstadoPedido,
} from "../../../service/PedidoService";

const { Option } = Select;

const Pedidos: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<number>(0);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(
    null
  );
  const [isDisabled, setIsDisabled] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<Estado | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await getEmpresas();
      setEmpresas(empresasData);
    };

    fetchEmpresas();
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
    cargarPedidos();
  }, [selectedSucursalId]);

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
        const pedidosData = await fetchPedidos(selectedSucursalId);
        setPedidos(pedidosData);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
      }
    }
  };

  const handleEstadoChange = async (id: number, nuevoEstado: Estado) => {
    try {
      const pedidoActualizado = await cambiarEstadoPedido(id, nuevoEstado);
      message.success(
        `El pedido cambió su estado a: ${pedidoActualizado.estado}`
      );
      cargarPedidos();
    } catch (error: any) {
      message.error(error.message);
      //alert(error.message);
    } finally {
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
    {
      title: "Cambiar Estado",
      key: "cambiarEstado",
      render: (_text: any, record: any) => (
        <Button
          onClick={() => {
            setSelectedPedidoId(record.id);
            setNuevoEstado(record.estado);
            setModalVisible(true);
          }}
        >
          Cambiar Estado
        </Button>
      ),
    },
  ];

  const pedidosFiltrados = pedidos.filter(
    (pedido) => filtroEstado === "" || pedido.estado === filtroEstado
  );

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
      <Select
        placeholder="Filtrar por estado"
        style={{ width: 200, marginBottom: 20 }}
        onChange={(value) => setFiltroEstado(value)}
        value={filtroEstado}
      >
        <Option value="">Todos</Option>
        {Object.values(Estado).map((estado) => (
          <Option key={estado} value={estado}>
            {estado}
          </Option>
        ))}
      </Select>
      <Table dataSource={pedidosFiltrados} columns={columns} rowKey="id" />

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
          value={nuevoEstado || undefined}
          placeholder="Seleccione un nuevo estado"
          style={{ width: "100%" }}
          onChange={(value) => setNuevoEstado(value as Estado)}
        >
          {Object.values(Estado).map((estado) => (
            <Option key={estado} value={estado}>
              {estado}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default Pedidos;
