import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";

import { actualizarEmpresa } from "../../../service/ServiceEmpresa";
import { useAuth0 } from "@auth0/auth0-react";

interface FormularioModificarEmpresaProps {
  empresa: any; // Aquí define la estructura de la empresa que vas a modificar
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const FormularioModificarEmpresa: React.FC<FormularioModificarEmpresaProps> = ({
  empresa,
  onClose,
  onSubmit,
}) => {
  const [componentDisabled] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const { getAccessTokenSilently } = useAuth0();
  const [form] = Form.useForm();
  const [nuevaImagenBase64, setNuevaImagenBase64] = useState<string | null>(
    null
  );

  useEffect(() => {
    setNuevaImagenBase64(null);
    // Asegúrate de que el valor inicial de 'imagen' se establezca correctamente
    const imagenInicial = empresa.imagen
      ? `data:image/jpeg;base64,${empresa.imagen}`
      : null;
    form.setFieldsValue({
      nombre: empresa.nombre,
      razonSocial: empresa.razonSocial,
      cuil: empresa.cuil,
      imagen: imagenInicial,
    });
  }, [empresa, form]);

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
          setNuevaImagenBase64(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any) => {
    const formData = {
      id: empresa.id, // Asegúrate de tener el campo ID de la empresa
      nombre: values.nombre,
      razonSocial: values.razonSocial,
      cuil: values.cuil,
      imagen: nuevaImagenBase64,
    };
    const token = await getAccessTokenSilently();
    await actualizarEmpresa(empresa.id, formData, token);
    onSubmit(values);
    handleOk();
    //window.location.reload(); // Esto recarga la página, considera si realmente es necesario
  };

  return (
    <Modal
      title="Modificar Empresa"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
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
        <Form.Item style={{ textAlign: "right" }}>
          <Button
            type="default"
            style={{ marginRight: "10px" }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            Modificar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormularioModificarEmpresa;
