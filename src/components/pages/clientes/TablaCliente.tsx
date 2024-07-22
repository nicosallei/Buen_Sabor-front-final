import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, message, Space, Table } from "antd"; // Importa Popconfirm para confirmar la acción de eliminar
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

import { useAuth0 } from "@auth0/auth0-react";
import userImage from "../../../assets/user_imagen.jpg";

import {
  actualizarPasswordCliente,
  Cliente,
  getClientes,
} from "../../../service/ClienteService";

type DataIndex = keyof Cliente;
type TablaEmpleadosProps = {
  sucursalId: string;
  reload: boolean;
};

const TablaEmpleados: React.FC<TablaEmpleadosProps> = ({
  sucursalId,
  reload,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [data, setData] = useState<Cliente[]>([]);
  //const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    fetchData();
  }, [sucursalId, reload]);

  const fetchData = async () => {
    try {
      const clientesData = await getClientes();
      setData(clientesData);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
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
  const generarNuevaPassword = () => {
    return "BuenSabor1"; // Ejemplo de contraseña generada
  };

  const resetearContraseña = async (clienteId: number) => {
    const token = await getAccessTokenSilently();
    const nuevaPassword = generarNuevaPassword();

    try {
      await actualizarPasswordCliente(clienteId, nuevaPassword, token);
      console.log("Contraseña reseteada con éxito");
      // Aquí podrías mostrar un mensaje de éxito o actualizar tu UI según sea necesario
    } catch (error: any) {
      message.error(error.message);
      // Maneja el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<Cliente> => ({
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

  const columns: TableColumnsType<Cliente> = [
    {
      title: "Imagen",
      dataIndex: "imagen",
      key: "imagen",
      render: (text) => {
        const defaultImage = "http://localhost:8080/images/default.jpg"; // URL de tu imagen por defecto
        const imageUrl = text
          ? `http://localhost:8080/images/${text.split("\\").pop()}`
          : userImage || defaultImage;
        return <img src={imageUrl} style={{ width: "50px" }} alt="Empleado" />;
      },
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      ...getColumnSearchProps("nombre"),
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
      ...getColumnSearchProps("apellido"),
      sorter: (a, b) => a.apellido.localeCompare(b.apellido),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      ...getColumnSearchProps("telefono"),
      sorter: (a, b) => a.telefono.localeCompare(b.telefono),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button type="primary" onClick={() => resetearContraseña(record.id)}>
          Resetear Contraseña
        </Button>
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
    </>
  );
};

export default TablaEmpleados;
