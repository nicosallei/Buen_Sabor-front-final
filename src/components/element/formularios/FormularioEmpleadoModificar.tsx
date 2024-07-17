import { Modal, Form, Input, Button, notification, Select } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { RolEmpleado } from "../../../types/usuario/Usuario";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
  sucursalId?: string;
  empleadoId?: string;
}

const FormularioEmpleado: React.FC<Props> = ({
  visible,
  onClose,
  initialValues,
  sucursalId,
  empleadoId,
}) => {
  const [form] = Form.useForm();
  const { getAccessTokenSilently } = useAuth0();
  const [nuevaImagenBase64, setNuevaImagenBase64] = useState<string | null>(
    null
  );

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const base64String = (reader.result as string).replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          setNuevaImagenBase64(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleButtonClick = async (values: any) => {
    console.log("Received values of form: ", values);
    const formattedValues = { ...values };

    formattedValues.sucursal = {
      id: sucursalId,
      denominacion: "", // You might want to fill this with actual data if available
    };
    if (values.imagenes) {
      values.imagen = nuevaImagenBase64;
    }

    try {
      const token = await getAccessTokenSilently();
      formattedValues.imagen = nuevaImagenBase64;

      let url = `http://localhost:8080/api/empleado/`;
      let method = "POST";
      if (empleadoId) {
        url = `http://localhost:8080/api/empleado/${empleadoId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        throw new Error("Error al modificar el empleado");
      }

      form.resetFields();
      onClose();
      notification.open({
        message: (
          <span>
            <CheckCircleOutlined style={{ color: "green" }} /> Empleado
            actualizado correctamente
          </span>
        ),
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Modificar Empleado"
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={handleButtonClick}
        layout="vertical"
      >
        <div>
          <Form.Item
            label="Nombre:"
            name="nombre"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el Nombre",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Apellido:"
            name="apellido"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el apellido",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Email:"
            name="email"
            rules={[
              {
                required: true,
                message: "Por favor ingresa un email",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Telefono:"
            name="telefono"
            rules={[
              {
                required: true,
                message: "Por favor ingresa un telefono",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
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
          <Form.Item label="Imagen:">
            {nuevaImagenBase64 && (
              <img
                src={nuevaImagenBase64}
                alt="Nueva imagen de la promoción"
                style={{ maxWidth: "100%", marginBottom: 10 }}
              />
            )}
            {!nuevaImagenBase64 && form.getFieldValue("imagen") && (
              <img
                src={`data:image/jpeg;base64,${form.getFieldValue("imagen")}`}
                alt="Imagen de la promoción"
                style={{ maxWidth: "100%", marginBottom: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item label="Cargar Nueva Imagen:">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImagenChange(e)}
              style={{ marginBottom: 10 }}
            />
          </Form.Item>
        </div>

        <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={() => form.submit()}>
            Cargar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormularioEmpleado;
