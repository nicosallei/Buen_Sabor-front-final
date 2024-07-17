import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Upload,
  Button,
  Switch,
  Image,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  modificarInsumoId,
  getInsumoXId,
  getUnidadMedida,
} from "../../../service/ServiceInsumos";
import { useAuth0 } from "@auth0/auth0-react";

interface FormularioInsumoProps {
  onClose: () => void;
  id: number;
}

interface ImageData {
  id: string;
  name: string;
  status: string;
  url: string;
}

interface unidadMedida {
  id: number;
  denominacion: string;
}

const FormularioInsumoModificar: React.FC<FormularioInsumoProps> = ({
  onClose,
  id,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [form] = Form.useForm();
  const [images, setImages] = useState<ImageData[]>([]);
  const [, setIsSwitchOn] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState<unidadMedida[]>([]);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInsumoXId(id.toString());
        setFormData(data);
        console.log("data: ", data);

        form.setFieldsValue(data);
        form.setFieldsValue({ unidadMedida: data.unidadMedida.id });
        setIsModalVisible(true);

        const imagesData = data.imagenes.map(
          (img: { id: string; url: string }) => ({
            id: img.id,
            name: `image-${img.id}.jpeg`,
            status: "done",
            url: img.url,
          })
        );

        setImages(imagesData);
      } catch (error) {
        console.error("Error al obtener datos del insumo:", error);
      }
    };

    fetchData();
  }, [id, form]);

  useEffect(() => {
    const fetchUnidadesMedida = async () => {
      const data = await getUnidadMedida();
      setUnidadesMedida(data);
    };

    fetchUnidadesMedida();
  }, []);

  const onFinish = async (values: any) => {
    try {
      let uploadedImages = [];
      if (values.uploadImagenes) {
        uploadedImages = await Promise.all(
          values.uploadImagenes.map(async (file: any) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = (reader.result as string).replace(
                  /^data:image\/\w+;base64,/,
                  ""
                );
                resolve({ url: base64String });
              };
              reader.onerror = reject;
              reader.readAsDataURL(file.originFileObj);
            });
          })
        );
      }

      if (images.length > 0) {
        const existingImages = images.map((image) => ({
          url: image.url,
        }));
        uploadedImages = [...uploadedImages, ...existingImages];
      }

      values.imagenes = uploadedImages;

      values.unidadMedida = {
        id: values.unidadMedida,
        denominacion: unidadesMedida.find(
          (unidad) => unidad.id === values.unidadMedida
        )?.denominacion,
      };

      console.log("values:", values);
      const token = await getAccessTokenSilently();
      await modificarInsumoId(values, formData.id, token);
      onClose();
    } catch (error: any) {
      message.error(error.message);
    }
    setIsModalVisible(false);
    onClose();
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleOk = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleDelete = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const [, setUnidadMedida] = useState({
    id: "",
    denominacion: "",
  });

  const handleUnidadMedidaChange = (value: string) => {
    setUnidadMedida({
      id: value,
      denominacion:
        unidadesMedida.find((unidad) => unidad.id === +value)?.denominacion ||
        "",
    });
  };

  return (
    <Modal
      title="Modificar Insumo"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Codigo" name="codigo">
              <Input />
            </Form.Item>
            <Form.Item label="Stock minimo" name="stockMinimo">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Unidad de Medida" name="unidadMedida">
              <Select onChange={handleUnidadMedidaChange}>
                {unidadesMedida.map((unidad) => (
                  <Select.Option key={unidad.id} value={unidad.id}>
                    {unidad.denominacion}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Foto">
              <Image.PreviewGroup>
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <Image
                      src={`data:image/jpeg;base64,${image.url}`}
                      alt={image.name}
                      style={{ width: "100px", height: "100px" }}
                    />
                    <button
                      onClick={() => handleDelete(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "rgba(255, 255, 255, 0.7)",
                        border: "none",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </Image.PreviewGroup>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Denominación" name="denominacion">
              <Input />
            </Form.Item>
            <Form.Item label="Stock máximo" name="stockMaximo">
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Es para elaborar"
              name="esParaElaborar"
              valuePropName="checked"
            >
              <Switch onChange={setIsSwitchOn} />
            </Form.Item>
            <Form.Item
              label="Agregar Foto"
              name="uploadImagenes"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload listType="picture-card" beforeUpload={() => false}>
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
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

export default FormularioInsumoModificar;
