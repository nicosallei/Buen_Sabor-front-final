import { Form, Input, Button, DatePicker, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import * as CryptoJS from "crypto-js";
import { Rol } from "../../../types/usuario/Usuario";
import fondoRegistro from "../../../assets/fondo-registro.jpeg";

const RegistroCliente = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    const encryptedPassword = CryptoJS.SHA256(values.password).toString();
    const response = await fetch(
      "http://localhost:8080/api/usuario/registro/usuario-cliente",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.email,
          password: encryptedPassword,
          rol: Rol.CLIENTE,
          cliente: {
            nombre: values.nombre,
            apellido: values.apellido,
            telefono: values.telefono,
            email: values.email,
            fechaNacimiento: values.fechaNacimiento.format("YYYY-MM-DD"),
            imagen: values.imagen,
          },
        }),
      }
    );

    if (response.ok) {
      navigate("/login");
    }
  };

  const handleFechaNacimientoChange = (_date: any, _dateString: any) => {
    form.validateFields(["fechaNacimiento"]);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${fondoRegistro})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Row justify="center" align="middle" style={{ width: "100%" }}>
        <Col xs={24} sm={16} md={12} lg={8} xl={6}>
          <Card
            title={
              <div style={{ textAlign: "center" }}>Registro de Cliente</div>
            }
            bordered={false}
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="password"
                label="Contraseña"
                rules={[{ required: true }]}
              >
                <Input.Password style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[{ required: true }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="apellido"
                label="Apellido"
                rules={[{ required: true }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="telefono"
                label="Teléfono"
                rules={[{ required: true }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="fechaNacimiento"
                label="Fecha de Nacimiento"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingresa tu fecha de nacimiento!",
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      //const comparisonDate = new Date(2024, 7, 30);
                      const now = new Date();
                      const comparisonDate = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate()
                      );
                      const birthDate = new Date(value);
                      let age =
                        comparisonDate.getFullYear() - birthDate.getFullYear();
                      const m =
                        comparisonDate.getMonth() - birthDate.getMonth();
                      if (
                        m < 0 ||
                        (m === 0 &&
                          comparisonDate.getDate() < birthDate.getDate())
                      ) {
                        age--;
                      }
                      if (age < 18) {
                        return Promise.reject(
                          new Error("Debes tener al menos 18 años.")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker
                  onChange={handleFechaNacimientoChange}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item style={{ textAlign: "center" }}>
                <Button
                  type="default"
                  style={{
                    marginTop: "10px",
                    marginRight: "20px",
                    width: "150px",
                  }}
                  onClick={() => navigate("/login")}
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginTop: "10px", width: "150px" }}
                >
                  Registrar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegistroCliente;
