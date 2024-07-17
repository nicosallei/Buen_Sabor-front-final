import { useState } from "react";

import { Button, Form, Input, Modal } from "antd";
import { crearEmpresa } from "../../../service/ServiceEmpresa";
import { useAuth0 } from "@auth0/auth0-react";

interface FormularioAgregarEmpresaProps {
  onClose: () => void;
  onSucursalAdded: () => void;
}

const FormularioAgregarEmpresa: React.FC<FormularioAgregarEmpresaProps> = ({
  onClose,
  onSucursalAdded,
}) => {
  const [componentDisabled] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const { getAccessTokenSilently } = useAuth0();
  const [imagenBase64, setImagenBase64] = useState<string | undefined>(
    undefined
  );
  const handleOk = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    onClose();
  };
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

  const handleSubmit = async (values: any) => {
    const formData = {
      nombre: values.nombre,
      razonSocial: values.razonSocial,
      cuil: values.cuil,
      imagen: imagenBase64,
    };
    const token = await getAccessTokenSilently();
    await crearEmpresa(formData, token);
    onSucursalAdded();
    handleOk();
    // window.location.reload();
  };

  return (
    <Modal
      title="Agregar Empresa"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        disabled={componentDisabled}
        style={{ maxWidth: 600 }}
        onFinish={handleSubmit}
      >
        <Form.Item label="Nombre" name="nombre">
          <Input />
        </Form.Item>
        <Form.Item label="Razón Social" name="razonSocial">
          <Input />
        </Form.Item>
        <Form.Item label="Cuit" name="cuil">
          <Input />
        </Form.Item>
        <Form.Item label="Imagen:" name="imagen">
          <Input type="file" onChange={handleImagenChange} accept="image/*" />
        </Form.Item>

        {imagenBase64 && (
          <div style={{ marginTop: 20 }}>
            <img src={imagenBase64} alt="Preview" style={{ maxWidth: 200 }} />
          </div>
        )}
        <Form.Item style={{ textAlign: "right" }}>
          <Button
            type="default"
            style={{ marginRight: "10px" }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            Agregar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormularioAgregarEmpresa;
