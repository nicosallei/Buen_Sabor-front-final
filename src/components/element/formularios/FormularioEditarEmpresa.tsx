import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";

import { actualizarEmpresa } from "../../../service/ServiceEmpresa";

interface FormularioModificarEmpresaProps {
  empresa: any;
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

  const [form] = Form.useForm();
  const [nuevaImagenBase64, setNuevaImagenBase64] = useState<string | null>(
    null
  );

  useEffect(() => {
    setNuevaImagenBase64(null);

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
      id: empresa.id,
      nombre: values.nombre,
      razonSocial: values.razonSocial,
      cuil: values.cuil,
      imagen: nuevaImagenBase64,
    };

    await actualizarEmpresa(empresa.id, formData);
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
