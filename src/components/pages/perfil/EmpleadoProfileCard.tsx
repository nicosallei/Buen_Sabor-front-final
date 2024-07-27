import { useState, useEffect, useMemo } from "react";
import {
  Card,
  Skeleton,
  Avatar,
  message,
  Modal,
  Form,
  Input,
  Button,
} from "antd";
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

  const rol = useMemo(() => localStorage.getItem("rol") || "", []);
  const empleadoService = useMemo(() => new EmpleadoService(), []);
  const baseURL = useMemo(() => import.meta.env.VITE_API_URL, []);
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const fetchEmpleado = async () => {
    if (email) {
      try {
        console.log("Fetching empleado data...");
        const empleadoData = await empleadoService.getEmpleadoByEmail(
          baseURL,
          email
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
        baseURL,
        email
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
  }, [email, empleadoService, baseURL, clienteService, rol]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    setCambiandoPassword(true);

    const cambioPasswordDto = {
      username: email,
      passwordActual,
      nuevaPassword,
      id: Number(id),
    };
    try {
      if (rol === "CLIENTE") {
        await cambiarPasswordCliente(cambioPasswordDto);
      } else {
        await cambiarPasswordEmpleado(cambioPasswordDto);
      }
      message.success(`La contraseña fue cambiada con exito `);
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
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}
      >
        <Button type="primary" onClick={showModal}>
          Cambiar Contraseña
        </Button>
      </div>
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

      <Modal
        title="Cambiar Contraseña"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="changePasswordForm"
          initialValues={{ remember: true }}
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="passwordActual"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu contraseña actual!",
              },
            ]}
          >
            <Input.Password placeholder="Contraseña Actual" />
          </Form.Item>
          <Form.Item
            name="nuevaPassword"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu nueva contraseña!",
              },
            ]}
          >
            <Input.Password placeholder="Nueva Contraseña" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={cambiandoPassword}
            >
              Cambiar Contraseña
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmpleadoProfileCard;
