import React from "react";
import { Routes, Route } from "react-router-dom";
import Empresa from "../components/pages/empresa/Empresa";
import Sucursal from "../components/pages/sucursal/Sucursal";
import Categorias from "../components/pages/categorias/Categorias";
import Productos from "../components/pages/productos/Productos";
import Insumo from "../components/pages/insumos/Insumos";
import CompraCategoria from "../components/pages/compra/categoria/CompraCategoria";
import CompraProductos from "../components/pages/compra/productos/CompraProductos";
import UnidadMedida from "../components/pages/unidadMedida/UnidadMedida";
import CategoriasPorSucursal from "../components/pages/categorias/CategoriasPorSucursal";
import Promocion from "../components/pages/promocion/Promocion";
import Empleados from "../components/pages/empleado/Empleado";
import Pedidos from "../components/pages/pedidos/Pedidos";
import SeleccionSucursal from "../components/pages/compra/sucursales/SeleccionSucursal";
import Login from "../components/pages/login-crear/login";
import RegistroCliente from "../components/pages/login-crear/CrearUsuarioCliente";
import Estadistica from "../components/pages/estadistica/Estadistica";
import RegistroEmpleado from "../components/pages/login-crear/CrearUsuarioEmpleado";
import { AuthenticationGuard } from "../components/auth0/AuthenticationGuard";
import ErrorPage from "../components/User/ErrorPage";
import CallbackPage from "../components/auth0/CallbackPage";
import LoginHandler from "../components/ui/LoginHandler";
import EmpleadoProfileCard from "../components/pages/perfil/EmpleadoProfileCard";
import Graficos from "../components/pages/estadistica/Graficos";
import withRoleCheck from "../controlAcceso/withRoleCheck";
import CompraPromociones from "../components/pages/compra/promociones/CompraPromociones";
import PedidosCliente from "../components/pages/pedidosCliente/PedidoClientes";
import Clientes from "../components/pages/clientes/Clientes";
import VistaPrincipal from "../components/pages/estadistica";
import PedidosPendientes from "../components/pages/pedidos/PedidoPendiente";
import PedidoPreparacion from "../components/pages/pedidos/PedidoPreparacion";
import PedidosCancelados from "../components/pages/pedidos/PedidoCancelado";
import PedidosAprobados from "../components/pages/pedidos/PedidosAprobados";
import PedidosEnviados from "../components/pages/pedidos/PedidoEnviado";
import PedidosEntregados from "../components/pages/pedidos/PedidoEntregado";
import PedidosListos from "../components/pages/pedidos/PedidoListo";
import PedidoMenu from "../components/pages/pedidos/PedidoMenu";

const Rutas: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/empresas"
        element={React.createElement(withRoleCheck(Empresa, ["ADMINISTRADOR"]))}
      />
      <Route
        path="/sucursal/:id"
        element={React.createElement(
          withRoleCheck(Sucursal, ["ADMINISTRADOR"])
        )}
      />
      <Route
        path="/categorias"
        element={React.createElement(
          withRoleCheck(Categorias, ["ADMINISTRADOR"])
        )}
      />

      <Route
        path="/empleados"
        element={React.createElement(
          withRoleCheck(Empleados, ["ADMINISTRADOR"])
        )}
      />

      <Route
        path="/categorias/porSucursal"
        element={React.createElement(
          withRoleCheck(CategoriasPorSucursal, ["ADMINISTRADOR"])
        )}
      />

      <Route
        path="/productos"
        element={React.createElement(
          withRoleCheck(Productos, ["ADMINISTRADOR", "EMPLEADO_COCINA"])
        )}
      />
      <Route
        path="/insumos"
        element={React.createElement(
          withRoleCheck(Insumo, ["ADMINISTRADOR", "EMPLEADO_COCINA"])
        )}
      />
      <Route
        path="/unidadMedida"
        element={React.createElement(
          withRoleCheck(UnidadMedida, ["ADMINISTRADOR"])
        )}
      />
      <Route
        path="/compra"
        element={React.createElement(
          withRoleCheck(SeleccionSucursal, [
            "ADMINISTRADOR",
            "EMPLEADO_COCINA",
            "CLIENTE",
            "EMPLEADO_CAJA",
          ])
        )}
      />
      <Route
        path="/compra/categorias/:sucursalId"
        element={React.createElement(
          withRoleCheck(CompraCategoria, [
            "ADMINISTRADOR",
            "EMPLEADO_COCINA",
            "CLIENTE",
            "EMPLEADO_CAJA",
          ])
        )}
      />
      <Route
        path="/compra/productos/:surucsalId/:categoriaId"
        element={React.createElement(
          withRoleCheck(CompraProductos, [
            "ADMINISTRADOR",
            "EMPLEADO_COCINA",
            "CLIENTE",
            "EMPLEADO_CAJA",
          ])
        )}
      />
      <Route
        path="/compra/promociones/:sucursalId"
        element={React.createElement(
          withRoleCheck(CompraPromociones, [
            "ADMINISTRADOR",
            "EMPLEADO_COCINA",
            "CLIENTE",
          ])
        )}
      />
      <Route
        path="/estadistica"
        element={React.createElement(
          withRoleCheck(Estadistica, [
            "ADMINISTRADOR",
            "EMPLEADO_COCINA",
            "EMPLEADO_CAJA",
          ])
        )}
      />
      <Route
        path="/promociones"
        element={React.createElement(
          withRoleCheck(Promocion, ["ADMINISTRADOR", "EMPLEADO_COCINA"])
        )}
      />
      <Route
        path="/Pedidos"
        element={<AuthenticationGuard component={Pedidos} />}
      />
      <Route path="*" element={<ErrorPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />
      <Route path="/registro/empleado" element={<RegistroEmpleado />} />
      {/* <Route
        path="/"
        element={<AuthenticationGuard component={LoginHandler} />}
      /> */}
      <Route path="/" element={<LoginHandler />} />
      <Route path="/perfil" element={<EmpleadoProfileCard />} />
      <Route
        path="/pedidosCliente"
        element={React.createElement(
          withRoleCheck(PedidosCliente, ["ADMINISTRADOR", "CLIENTE"])
        )}
      />
      <Route
        path="/clientes"
        element={React.createElement(
          withRoleCheck(Clientes, ["ADMINISTRADOR"])
        )}
      />
      <Route
        path="/graficos"
        element={React.createElement(
          withRoleCheck(Graficos, ["ADMINISTRADOR", "EMPLEADO_CAJA"])
        )}
      />
      <Route
        path="/vista-graficos-estadistica"
        element={React.createElement(
          withRoleCheck(VistaPrincipal, ["ADMINISTRADOR", "EMPLEADO_CAJA"])
        )}
      />
      <Route
        path="/pedidos/admin"
        element={React.createElement(withRoleCheck(Pedidos, ["ADMINISTRADOR"]))}
      />
      <Route
        path="/pedidos/pendiente"
        element={React.createElement(
          withRoleCheck(PedidosPendientes, ["ADMINISTRADOR", "EMPLEADO_CAJA"])
        )}
      />
      <Route
        path="/pedidos/preparacion"
        element={React.createElement(
          withRoleCheck(PedidoPreparacion, [
            "ADMINISTRADOR",
            "ADMIN_SUCURSAL",
            "EMPLEADO_COCINA",
          ])
        )}
      />
      <Route
        path="/pedidos/listo-entregar"
        element={React.createElement(
          withRoleCheck(PedidosListos, [
            "ADMINISTRADOR",
            "ADMIN_SUCURSAL",
            "EMPLEADO_CAJA",
          ])
        )}
      />
      <Route
        path="/pedidos/entregado"
        element={React.createElement(
          withRoleCheck(PedidosEntregados, [
            "ADMINISTRADOR",
            "ADMIN_SUCURSAL",
            "EMPLEADO_CAJA",
          ])
        )}
      />
      <Route
        path="/pedidos/enviado"
        element={React.createElement(
          withRoleCheck(PedidosEnviados, [
            "ADMINISTRADOR",
            "EMPLEADO_REPARTIDOR",
          ])
        )}
      />
      <Route
        path="/pedidos/cancelado"
        element={React.createElement(
          withRoleCheck(PedidosCancelados, [
            "ADMINISTRADOR",
            "ADMIN_SUCURSAL",
            "EMPLEADO_CAJA",
          ])
        )}
      />
      <Route
        path="/pedidos/confirmado"
        element={React.createElement(
          withRoleCheck(PedidosAprobados, [
            "ADMINISTRADOR",
            "ADMIN_SUCURSAL",
            "EMPLEADO_COCINA",
          ])
        )}
      />
      <Route
        path="/pedidos/menu"
        element={React.createElement(
          withRoleCheck(PedidoMenu, [
            "ADMINISTRADOR",
            "CLIENTE",
            "EMPLEADO_COCINA",
            "EMPLEADO_REPARTIDOR",
            "EMPLEADO_CAJA",
            "ADMIN_SUCURSAL",
          ])
        )}
      />
    </Routes>
  );
};

export default Rutas;
