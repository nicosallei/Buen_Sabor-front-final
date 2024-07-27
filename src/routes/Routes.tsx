// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Empresa from "../components/pages/empresa/Empresa";
// import Sucursal from "../components/pages/sucursal/Sucursal";
// import Categorias from "../components/pages/categorias/Categorias";
// import Productos from "../components/pages/productos/Productos";
// import Insumo from "../components/pages/insumos/Insumos";
// import CompraCategoria from "../components/pages/compra/categoria/CompraCategoria";
// import CompraProductos from "../components/pages/compra/productos/CompraProductos";
// import UnidadMedida from "../components/pages/unidadMedida/UnidadMedida";
// import CategoriasPorSucursal from "../components/pages/categorias/CategoriasPorSucursal";
// import Promocion from "../components/pages/promocion/Promocion";

// import Empleados from "../components/pages/empleado/Empleado";

// import Pedidos from "../components/pages/pedidos/Pedidos";
// import SeleccionSucursal from "../components/pages/compra/sucursales/SeleccionSucursal";
// import Login from "../components/pages/login-crear/login";
// import RegistroCliente from "../components/pages/login-crear/CrearUsuarioCliente";
// import Estadistica from "../components/pages/estadistica/Estadistica";
// import RegistroEmpleado from "../components/pages/login-crear/CrearUsuarioEmpleado";
// import { AuthenticationGuard } from "../components/auth0/AuthenticationGuard";
// import ErrorPage from "../components/User/ErrorPage";
// import CallbackPage from "../components/auth0/CallbackPage";
// import LoginHandler from "../components/ui/LoginHandler";
// import EmpleadoProfileCard from "../components/pages/perfil/EmpleadoProfileCard";
// import Graficos from "../components/pages/estadistica/Graficos";
// import withRoleCheck from "../controlAcceso/withRoleCheck";
// import CompraPromociones from "../components/pages/compra/promociones/CompraPromociones";
// import PedidosCliente from "../components/pages/pedidosCliente/PedidoClientes";
// import Clientes from "../components/pages/clientes/Clientes";
// import VistaPrincipal from "../components/pages/estadistica";
// import PedidosPendientes from "../components/pages/pedidos/PedidoPendiente";
// import PedidoPreparacion from "../components/pages/pedidos/PedidoPreparacion";

// const Rutas: React.FC = () => {
//   return (
//     <Routes>
//       <Route
//         path="/empresas"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(Empresa, ["ADMINISTRADOR"])}
//           />
//         }
//       />
//       <Route
//         path="/sucursal/:id"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(Sucursal, ["ADMINISTRADOR"])}
//           />
//         }
//       />
//       <Route
//         path="/categorias"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(Categorias, ["ADMINISTRADOR"])}
//           />
//         }
//       />
//       <Route
//         path="/empleados"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(Empleados, ["ADMINISTRADOR"])}
//           />
//         }
//       />
//       <Route
//         path="/categorias/porSucursal"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(CategoriasPorSucursal, ["ADMINISTRADOR"])}
//           />
//         }
//       />
//       <Route
//         path="/productos"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(Productos, [
//               "ADMINISTRADOR",
//               "EMPLEADO_COCINA",
//             ])}
//           />
//         }
//       />
//       <Route
//         path="/insumos"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(Insumo, [
//               "ADMINISTRADOR",
//               "EMPLEADO_COCINA",
//             ])}
//           />
//         }
//       />
//       <Route
//         path="/unidadMedida"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(UnidadMedida, ["ADMINISTRADOR"])}
//           />
//         }
//       />
//       <Route
//         path="/compra"
//         element={<AuthenticationGuard component={SeleccionSucursal} />}
//       />
//       <Route
//         path="/compra/categorias/:sucursalId"
//         element={<AuthenticationGuard component={CompraCategoria} />}
//       />
//       <Route
//         path="/compra/productos/:surucsalId/:categoriaId"
//         element={<AuthenticationGuard component={CompraProductos} />}
//       />
//       <Route
//         path="/compra/promociones/:sucursalId"
//         element={<AuthenticationGuard component={CompraPromociones} />}
//       />
//       <Route
//         path="/estadistica"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(Estadistica, [
//               "ADMINISTRADOR",
//               "EMPLEADO_COCINA",
//             ])}
//           />
//         }
//       />
//       <Route
//         path="/promociones"
//         element={
//           <AuthenticationGuard
//             component={withRoleCheck(Promocion, [
//               "ADMINISTRADOR",
//               "EMPLEADO_COCINA",
//             ])}
//           />
//         }
//       />
//       <Route
//         path="/Pedidos"
//         element={<AuthenticationGuard component={Pedidos} />}
//       />
//       <Route path="*" element={<ErrorPage />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/callback" element={<CallbackPage />} />
//       <Route path="/registro-cliente" element={<RegistroCliente />} />
//       <Route path="/registro/empleado" element={<RegistroEmpleado />} />
//       {/* <Route
//         path="/"
//         element={<AuthenticationGuard component={LoginHandler} />}
//       /> */}
//       <Route path="/" element={<LoginHandler />} />
//       <Route path="/perfil" element={<EmpleadoProfileCard />} />
//       <Route
//         path="/pedidosCliente"
//         element={React.createElement(
//           withRoleCheck(PedidosCliente, ["ADMINISTRADOR", "CLIENTE"])
//         )}
//       />
//       <Route
//         path="/clientes"
//         element={React.createElement(
//           withRoleCheck(Clientes, ["ADMINISTRADOR"])
//         )}
//       />
//       <Route
//         path="/graficos"
//         element={React.createElement(
//           withRoleCheck(Graficos, ["ADMINISTRADOR"])
//         )}
//       />
//       <Route
//         path="/vista-graficos-estadistica"
//         element={React.createElement(
//           withRoleCheck(VistaPrincipal, ["ADMINISTRADOR"])
//         )}
//       />
//       //---------------------------------------------------------
//       <Route
//         path="/pedido-pendiente"
//         element={React.createElement(
//           withRoleCheck(PedidosPendientes, ["ADMINISTRADOR"])
//         )}
//       />
//       <Route
//         path="/pedido-preparacion"
//         element={React.createElement(
//           withRoleCheck(PedidoPreparacion, ["ADMINISTRADOR"])
//         )}
//       />
//     </Routes>
//   );
// };

// export default Rutas;
