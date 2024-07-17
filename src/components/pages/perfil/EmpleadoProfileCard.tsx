import { useState, useEffect, useMemo } from "react";
import { Card, Skeleton, Avatar } from "antd";
import EmpleadoService from "../../../service/auth0Service/EmpleadoService";
import IEmpleado from "../../../service/auth0Service/typeAuth0/Empleado";
import avatarImage from "../../../assets/user.png";

const EmpleadoProfileCard = () => {
  const [empleado, setEmpleado] = useState<IEmpleado | null>(null);
  const [loading, setLoading] = useState(true);
  const email = useMemo(() => localStorage.getItem("email") || "", []);
  const token = useMemo(() => localStorage.getItem("auth_token") || "", []);
  const empleadoService = useMemo(() => new EmpleadoService(), []);
  const baseURL = useMemo(() => import.meta.env.VITE_API_URL, []);

  useEffect(() => {
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

    fetchEmpleado();
  }, [email, token, empleadoService, baseURL]);

  return (
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
  );
};

export default EmpleadoProfileCard;
