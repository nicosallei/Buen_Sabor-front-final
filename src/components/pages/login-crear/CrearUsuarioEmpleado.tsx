
import { Form, Input, Button, DatePicker, Select, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import * as CryptoJS from "crypto-js";
import { RolEmpleado } from "../../../types/usuario/Usuario";

const RegistroEmpleado = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values:any) => {
    const encryptedPassword = CryptoJS.SHA256(values.password).toString();
    const response = await fetch(
      "http://localhost:8080/api/usuario/registro/usuario-empleado",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: encryptedPassword,
          rol: values.rol,
          empleado: {
            nombre: values.nombre,
            apellido: values.apellido,
            telefono: values.telefono,
            email: values.email,
            fechaNacimiento: values.fechaNacimiento.format("YYYY-MM-DD"),
            //imagen: values.imagen,
            // Añade otros campos específicos de empleado si es necesario
          },
        }),
      }
    );

    if (response.ok) {
      navigate("/login");
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Card title="Registro de Empleado" bordered={false}>
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="username"
              label="Nombre de usuario"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Contraseña"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item name="rol" label="Rol" rules={[{ required: true }]}>
              <Select>
                {Object.keys(RolEmpleado).map((rol) => (
                  <Select.Option key={rol} value={rol}>
                    {rol}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="apellido"
              label="Apellido"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="telefono"
              label="Teléfono"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </Form.Item>
           
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Registrar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default RegistroEmpleado;
