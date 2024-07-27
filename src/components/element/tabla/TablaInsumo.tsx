import { useEffect, useRef, useState } from "react";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Switch, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import {
  getInsumoXSucursal,
  ArticuloInsumo,
  deleteInsumoXId,
  activarInsumoXId,
} from "../../../service/ServiceInsumos";
import FormularioInsumoModificar from "../formularios/FromularioInsumoModificar";
import FormularioStock from "../formularios/FormularioStock";

type DataIndex = keyof ArticuloInsumo;
type TablaInsumoProps = {
  empresaId: string;
  sucursalId: string;
  updateTabla: boolean;
  reload: boolean;
};

const TablaInsumo: React.FC<TablaInsumoProps> = ({
  sucursalId,
  updateTabla,
  reload,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [data, setData] = useState<ArticuloInsumo[]>([]);
  const [, setModalVisible] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<ArticuloInsumo | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ArticuloInsumo | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, [sucursalId, updateTabla, reload]);

  const fetchData = async () => {
    console.log("Obteniendo insumos de la sucursal:", sucursalId);
    try {
      const data = await getInsumoXSucursal(sucursalId);
      console.log("Datos recibidos:", data);
      setData(data);
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<ArticuloInsumo> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters || (() => {}))}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSwitchChange = async (
    checked: boolean,
    record: ArticuloInsumo
  ) => {
    try {
      if (checked) {
        await activarInsumoXId(record.id.toString());
      } else {
        await deleteInsumoXId(record.id.toString());
      }

      const updatedData = await getInsumoXSucursal(sucursalId);
      setData(updatedData);
    } catch (error) {
      console.error("Error al actualizar el estado del insumo:", error);
    }
  };

  const handleEdit = (record: ArticuloInsumo) => {
    if (record.id) {
      setSelectedInsumo(record);
      setModalVisible(true);
    } else {
      console.error("El ID del insumo es nulo o no está definido.");
    }
  };

  const handleEditStock = (record: ArticuloInsumo) => {
    if (record.id) {
      setCurrentRecord(record);
      setIsModalVisible(true);
    } else {
      console.error("El ID del insumo es nulo o no está definido.");
    }
  };

  const handleCloseStock = async () => {
    setIsModalVisible(false);
    setCurrentRecord(null);

    try {
      const updatedData = await getInsumoXSucursal(sucursalId);
      setData(updatedData);
    } catch (error) {
      console.error("Error al obtener los insumos actualizados:", error);
    }
  };

  const handleModalClose = async () => {
    setModalVisible(false);
    setSelectedInsumo(null);

    try {
      const updatedData = await getInsumoXSucursal(sucursalId);
      setData(updatedData);
    } catch (error) {
      console.error("Error al obtener los insumos actualizados:", error);
    }
  };

  const columns: TableColumnsType<ArticuloInsumo> = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      width: "20%",
      ...getColumnSearchProps("codigo"),
      sorter: (a, b) => {
        const numA = parseInt(a.codigo.split("-")[1], 10);
        const numB = parseInt(b.codigo.split("-")[1], 10);
        return numA - numB;
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Denominación",
      dataIndex: "denominacion",
      key: "denominacion",
      ...getColumnSearchProps("denominacion"),
      sorter: (a, b) => a.denominacion.localeCompare(b.denominacion),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Precio de Compra",
      dataIndex: "precioCompra",
      key: "precioCompra",
      ...getColumnSearchProps("precioCompra"),
      sorter: (a, b) => a.precioCompra - b.precioCompra,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Precio de Venta",
      dataIndex: "precioVenta",
      key: "precioVenta",
      ...getColumnSearchProps("precioVenta"),
      sorter: (a, b) => a.precioVenta - b.precioVenta,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Stock Actual",
      dataIndex: "stockActual",
      key: "stockActual",
      ...getColumnSearchProps("stockActual"),
      sorter: (a, b) => a.stockActual - b.stockActual,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Stock Máximo",
      dataIndex: "stockMaximo",
      key: "stockMaximo",
      ...getColumnSearchProps("stockMaximo"),
      sorter: (a, b) => a.stockMaximo - b.stockMaximo,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Stock Mínimo",
      dataIndex: "stockMinimo",
      key: "stockMinimo",
      ...getColumnSearchProps("stockMinimo"),
      sorter: (a, b) => a.stockMinimo - b.stockMinimo,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Es para Elaborar",
      dataIndex: "esParaElaborar",
      key: "esParaElaborar",
      render: (esParaElaborar: boolean) => (esParaElaborar ? "Sí" : "No"),
    },
    {
      title: "Agregar Stock",
      key: "stock",
      render: (_text: string, record: ArticuloInsumo) => (
        <Space size="middle">
          <a onClick={() => handleEditStock(record)}>
            <EditOutlined />
          </a>
        </Space>
      ),
    },
    {
      title: "Acción",
      key: "action",
      render: (_text: string, record: ArticuloInsumo) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>
            <EditOutlined />
          </a>
          <Switch
            checked={!record.eliminado}
            onChange={(checked) => handleSwitchChange(checked, record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data.map((item) => ({ ...item, key: item.id }))}
        pagination={{
          pageSizeOptions: ["5", "10", "20", "30", "50", "100"],
          showSizeChanger: true,
        }}
      />
      {selectedInsumo && (
        <FormularioInsumoModificar
          onClose={handleModalClose}
          id={selectedInsumo.id}
        />
      )}
      {currentRecord && (
        <FormularioStock
          onClose={handleCloseStock}
          id={currentRecord.id}
          visible={isModalVisible}
        />
      )}
    </>
  );
};

export default TablaInsumo;
