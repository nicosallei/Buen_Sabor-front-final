import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  notification,
  DatePicker,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { RolEmpleado } from "../../../types/usuario/Usuario";
import * as CryptoJS from "crypto-js";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
  sucursalId?: string;
}

const FormularioEmpleado: React.FC<Props> = ({
  visible,
  onClose,
  initialValues,
  sucursalId,
  onSubmit,
}) => {
  const [imagenBase64, setImagenBase64] = useState<string | undefined>(
    undefined
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
          setImagenBase64(base64String);
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
      denominacion: "",
    };

    try {
      const encryptedPassword = CryptoJS.SHA256(
        formattedValues.password
      ).toString();
      formattedValues.imagen = imagenBase64;
      formattedValues.password = encryptedPassword;

      const response = await fetch(
        "http://localhost:8080/api/usuario/registro/usuario-empleado",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        }
      );

      if (response.ok) {
        notification.open({
          message: (
            <span>
              <CheckCircleOutlined style={{ color: "green" }} /> Agregado
              correctamente
            </span>
          ),
        });
        onSubmit(values);
        form.resetFields();
        onClose();
      } else {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error: ", error);
      notification.error({
        message: "Error",
        description: "Hubo un problema al agregar el empleado.",
      });
    }
  };
  const handleClose = () => {
    form.resetFields();
    onClose();
  };
  const handleFechaNacimientoChange = (_date: any, _dateString: any) => {
    form.validateFields(["fechaNacimiento"]);
  };

  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Agregar Empleado"
      onCancel={handleClose}
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
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
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
                    return Promise.reject(
                      new Error("Por favor, ingresa tu fecha de nacimiento!")
                    );
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
                  const m = comparisonDate.getMonth() - birthDate.getMonth();
                  if (
                    m < 0 ||
                    (m === 0 && comparisonDate.getDate() < birthDate.getDate())
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
            <DatePicker onChange={handleFechaNacimientoChange} />
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

          <Form.Item label="Imagen:" name="imagen">
            <Input type="file" onChange={handleImagenChange} accept="image/*" />
          </Form.Item>

          {imagenBase64 && (
            <div style={{ marginTop: 20 }}>
              <img src={imagenBase64} alt="Preview" style={{ maxWidth: 200 }} />
            </div>
          )}
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
