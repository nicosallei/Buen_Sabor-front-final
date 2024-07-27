import {
  SettingOutlined,
  LogoutOutlined,
  BankOutlined,
  ShoppingCartOutlined,
  FundProjectionScreenOutlined,
  UserOutlined,
  TeamOutlined,
  GoldOutlined,
  InboxOutlined,
  FireOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Dropdown, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { MenuInfo } from "rc-menu/lib/interface";
import { Rol, RolEmpleado } from "../../../types/usuario/Usuario";

//import Rutas from "../../../routes/Routes";
import Rutas from "../../../routes/RoutesSinAuth0";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number] & {
  children?: MenuItem[];
};

function getItem(
  route: string,
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={route}>{label}</Link>,
  } as MenuItem;
}

const allItems: MenuItem[] = [
  getItem("/empresas", "EMPRESA", "2", <BankOutlined />),
  getItem(
    "/vista-graficos-estadistica",
    "GRAFICOS-ESTADISTICAS",
    "13",
    <FundProjectionScreenOutlined />
  ),
  getItem("/pedidos", "PEDIDOS", "3", <FundProjectionScreenOutlined />, [
    getItem("/pedidos/admin", "PEDIDOS ADMIN", "subAdmin"),
    getItem("/pedidos/menu", "MENU PEDIDOS", "sub11"),
    getItem("/pedidos/pendiente", "PENDIENTE", "sub12"),
    getItem("/pedidos/confirmado", "CONFIRMADO", "sub13"),
    getItem("/pedidos/preparacion", "PREPARACION", "sub14"),
    getItem("/pedidos/listo-entregar", "LISTO PARA ENTREGAR", "sub15"),
    getItem("/pedidos/enviado", "ENVIADO", "sub16"),
    getItem("/pedidos/entregado", "ENTREGADO", "sub17"),
    getItem("/pedidos/cancelado", "CANCELADO", "sub18"),
  ]),
  getItem("/productos", "PRODUCTOS", "sub1", <ShoppingCartOutlined />, [
    getItem("/productos", "LISTA DE PRODUCTOS", "4"),
    getItem("/categorias", "CATEGORIAS", "5"),
  ]),
  getItem("/promociones", "PROMOCIONES", "6", <FireOutlined />),
  getItem("/empleados", "EMPLEADOS", "sub2", <TeamOutlined />, [
    getItem("/empleados", "LISTA DE EMPLEADOS", "7"),
  ]),
  getItem("/insumos", "INSUMOS", "9", <InboxOutlined />),
  getItem("/compra/", "COMPRA", "10", <ShoppingCartOutlined />),
  getItem("/unidadMedida", "Unidad de Medida", "11", <GoldOutlined />),
  getItem(
    "/pedidosCliente",
    "PEDIDOS Cliente",
    "14",
    <FundProjectionScreenOutlined />
  ),
  getItem("/clientes", "CLIENTES", "15", <FundProjectionScreenOutlined />),
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function handleMenuClick(info: MenuInfo): void {
    console.log("Menu item clicked:", info.key);
    if (info.key === "logout") {
      localStorage.clear();
      sessionStorage.clear();

      navigate("/login");
    } else if (info.key === "perfil") {
      navigate("/perfil");
    }
  }

  let rol = localStorage.getItem("rol");
  if (!rol) {
    rol = Rol.CLIENTE;
    localStorage.setItem("rol", rol);
  }
  const isAdmin = rol === RolEmpleado.ADMINISTRADOR;
  const isCocinero = rol === RolEmpleado.EMPLEADO_COCINA;
  const isRepartidor = rol === RolEmpleado.EMPLEADO_REPARTIDOR;
  const isCajero = rol == Rol.EMPLEADO_CAJA;
  const isCliente = rol === Rol.CLIENTE;

  const visibleItems = allItems
    .map((item) => {
      if (isAdmin) {
        if (item?.key === "3") {
          const clavesExcluidas = [
            "sub12",
            "sub13",
            "sub14",
            "sub15",
            "sub16",
            "sub17",
            "sub18",
          ];
          const filteredChildren = (item?.children as MenuItem[])?.filter(
            (child: any) => !clavesExcluidas.includes(child.key)
          );
          return { ...item, children: filteredChildren };
        }
        return item;
      }

      if (isCocinero) {
        const clavesPrincipalesExcluidas = [
          "2",
          "12",
          "10",
          "sub2",
          "8",
          "13",
          "11",
          "15",
          "14",
        ];
        if (clavesPrincipalesExcluidas.includes(item?.key?.toString() ?? "")) {
          return null;
        }

        if (item?.key === "3") {
          const clavesExcluidas = [
            "sub12",
            "sub15",
            "sub16",
            "sub17",
            "sub18",
            "subAdmin",
          ];
          const filteredChildren = (item?.children as MenuItem[])?.filter(
            (child: any) => !clavesExcluidas.includes(child.key)
          );
          return { ...item, children: filteredChildren };
        }

        if (item?.key === "sub1") {
          const filteredChildren = (item?.children as MenuItem[])?.filter(
            (child: any) => child.key !== "5"
          );
          return { ...item, children: filteredChildren };
        }
      }
      if (isRepartidor) {
        if (
          item?.key === "2" ||
          item?.key === "12" ||
          item?.key === "sub2" ||
          item?.key === "8" ||
          item?.key === "13" ||
          item?.key === "11" ||
          item?.key === "9" ||
          item?.key === "8" ||
          item?.key === "7" ||
          item?.key === "6" ||
          item?.key === "5" ||
          item?.key === "4" ||
          item?.key === "sub1" ||
          item?.key === "14" ||
          item?.key === "15" ||
          item?.key === "10"
        ) {
          return null;
        }
        if (item?.key === "3") {
          const clavesExcluidas = [
            "sub12",
            "sub13",
            "sub14",
            "sub15",
            "sub17",
            "sub18",
            "subAdmin",
          ];
          const filteredChildren = (item?.children as MenuItem[])?.filter(
            (child: any) => !clavesExcluidas.includes(child.key)
          );
          return { ...item, children: filteredChildren };
        }
      }
      if (isCajero) {
        if (
          item?.key === "2" ||
          item?.key === "12" ||
          item?.key === "sub2" ||
          item?.key === "8" ||
          item?.key === "11" ||
          item?.key === "9" ||
          item?.key === "8" ||
          item?.key === "7" ||
          item?.key === "6" ||
          item?.key === "5" ||
          item?.key === "4" ||
          item?.key === "sub1" ||
          item?.key === "14" ||
          item?.key === "15"
        ) {
          return null;
        }
        if (item?.key === "3") {
          const clavesExcluidas = ["sub13", "sub14", "sub16", "subAdmin"];
          const filteredChildren = (item?.children as MenuItem[])?.filter(
            (child: any) => !clavesExcluidas.includes(child.key)
          );
          return { ...item, children: filteredChildren };
        }
      }
      if (isCliente) {
        if (
          item?.key === "2" ||
          item?.key === "12" ||
          item?.key === "sub2" ||
          item?.key === "8" ||
          item?.key === "13" ||
          item?.key === "11" ||
          item?.key === "9" ||
          item?.key === "8" ||
          item?.key === "7" ||
          item?.key === "6" ||
          item?.key === "5" ||
          item?.key === "4" ||
          item?.key === "sub1" ||
          item?.key === "3" ||
          item?.key === "15"
        ) {
          return null;
        }
      }
      return item;
    })
    .filter(Boolean);

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="perfil" icon={<UserOutlined />}>
        Perfil
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Ajustes
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "50px",
        }}
      >
        <div className="demo-logo" />
        <Dropdown overlay={menu}>
          <Button>
            <UserOutlined />
          </Button>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          width={"15%"}
          style={{
            background: colorBgContainer,
            height: "90vh",
            marginTop: "0.7%",
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={visibleItems}
          />
        </Sider>
        <Layout
          style={{ padding: "0 24px 24px", marginTop: "0.7%", height: "93vh" }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: "auto",
            }}
          >
            <Rutas />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
