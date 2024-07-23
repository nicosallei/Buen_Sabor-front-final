import { useState, useEffect, useMemo } from "react";
import { Card, Skeleton, Avatar, message } from "antd";
import EmpleadoService from "../../../service/auth0Service/EmpleadoService";
import IEmpleado from "../../../service/auth0Service/typeAuth0/Empleado";
import avatarImage from "../../../assets/user.png";
import ClienteService from "../../../service/auth0Service/ClienteService";
import ICliente from "../../../service/auth0Service/typeAuth0/ICliente";
import { cambiarPasswordCliente } from "../../../service/ClienteService";
import { cambiarPasswordEmpleado } from "../../../service/EmpleadoService";

const clienteService = new ClienteService();
const EmpleadoProfileCard = () => {
  const [empleado, setEmpleado] = useState<IEmpleado | null>(null);
  const [cliente, setCliente] = useState<ICliente | null>(null);
  const [loading, setLoading] = useState(true);
  const email = useMemo(() => localStorage.getItem("email") || "", []);
  const id = useMemo(() => localStorage.getItem("id") || "", []);
  const token = useMemo(() => localStorage.getItem("auth_token") || "", []);
  const rol = useMemo(() => localStorage.getItem("rol") || "", []);
  const empleadoService = useMemo(() => new EmpleadoService(), []);
  const baseURL = useMemo(() => import.meta.env.VITE_API_URL, []);
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  const fetchEmpleado = async () => {
    if (email && token) {
      try {
        console.log("Fetching empleado data...");
        const empleadoData = await empleadoService.getEmpleadoByEmail(
          baseURL,
          email,
          token
        );
        console.log("Empleado data fetched:", empleadoData);
        setEmpleado(empleadoData);
      } catch (error) {
        console.error("Error fetching empleado:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const fetchCliente = async () => {
    try {
      const clienteData = await clienteService.getClienteByEmail(
        baseURL, // Asegúrate de que esta URL es la correcta para obtener datos del cliente
        email,
        token
      );
      setCliente(clienteData);
    } catch (error) {
      console.error("Error al obtener los datos del cliente:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (rol === "CLIENTE") {
      fetchCliente();
    } else {
      fetchEmpleado();
    }
  }, [email, token, empleadoService, baseURL, clienteService, rol]);

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    setCambiandoPassword(true);

    const cambioPasswordDto = {
      username: email, // Asumiendo que 'email' es el username
      passwordActual,
      nuevaPassword,
      id: Number(id),
    };

    try {
      if (rol === "CLIENTE") {
        await cambiarPasswordCliente(cambioPasswordDto, token);
      } else {
        await cambiarPasswordEmpleado(cambioPasswordDto, token);
      }
      message.success(`La contraseña fue cambiada con exito `);
      // Resetear los valores de los inputs después de cambiar la contraseña
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setPasswordActual("");
      setNuevaPassword("");
      setCambiandoPassword(false);
    }
  };

  return (
    <div>
      {rol === "CLIENTE" ? (
        <Card
          style={{ width: 300, margin: "20px auto" }}
          cover={
            cliente?.imagen ? (
              <img
                alt="Empleado"
                src={`http://localhost:8080/images/${cliente.imagen
                  .split("\\")
                  .pop()}`}
              />
            ) : (
              <Avatar size={300} src={<img src={avatarImage} alt="Avatar" />} />
            )
          }
        >
          <Skeleton loading={loading} avatar active>
            {cliente && (
              <>
                <Card.Meta
                  title={`${cliente.nombre} ${cliente.apellido}`}
                  description={cliente.email}
                />
                <p>Teléfono: {cliente.telefono}</p>
                <p>nombre: {cliente.nombre}</p>
                <p>apellido: {cliente.apellido}</p>
                <p>rol: {cliente.rol}</p>
              </>
            )}
          </Skeleton>
        </Card>
      ) : (
        <Card
          style={{ width: 300, margin: "20px auto" }}
          cover={
            empleado?.imagen ? (
              <img
                alt="Empleado"
                src={`http://localhost:8080/images/${empleado.imagen
                  .split("\\")
                  .pop()}`}
              />
            ) : (
              <Avatar size={300} src={<img src={avatarImage} alt="Avatar" />} />
            )
          }
        >
          <Skeleton loading={loading} avatar active>
            {empleado && (
              <>
                <Card.Meta
                  title={`${empleado.nombre} ${empleado.apellido}`}
                  description={empleado.email}
                />
                <p>Teléfono: {empleado.telefono}</p>
                <p>nombre: {empleado.nombre}</p>
                <p>apellido: {empleado.apellido}</p>
                <p>rol: {empleado.rol}</p>
                <p>Sucursal: {empleado.sucursal.nombre}</p>
              </>
            )}
          </Skeleton>
        </Card>
      )}
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Contraseña Actual"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={cambiandoPassword}>
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
};

export default EmpleadoProfileCard;
