import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Table,
  InputNumber,
  Button,
  Row,
  Col,
  Upload,
  UploadFile,
  notification,
  message,
} from "antd";

import { PlusOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  getInsumoXSucursal,
  getUnidadMedida,
  unidadMedida,
} from "../../../service/ServiceInsumos";
import TextArea from "antd/es/input/TextArea";
import {
  crearManufacturado,
  getCategoria,
} from "../../../service/ServiceProducto";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
  sucursalId?: string;
}

const FormularioProducto: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  sucursalId,
}) => {
  const [searchArticulos, setSearchArticulos] = useState("");
  const [searchSelectedArticulos, setSearchSelectedArticulos] = useState("");
  const [selectedInsumos, setSelectedInsumos] = useState<string[]>([]);
  const [selectedInsumosData, setSelectedInsumosData] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  const { getAccessTokenSilently } = useAuth0();
  const [categoria, setCategoria] = useState<any[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<unidadMedida[]>([]);
  useEffect(() => {
    const fetchUnidadesMedida = async () => {
      try {
        const data = await getUnidadMedida();
        setUnidadesMedida(data);
      } catch (error) {
        console.error("Error al obtener las unidades de medida:", error);
      }
    };
    fetchUnidadesMedida();
  }, []);

  useEffect(() => {
    const fetchCategoriaSucursal = async () => {
      try {
        console.log("Fetching categorias for sucursalId:", sucursalId);
        const data = await getCategoria(Number(sucursalId));
        console.log("Categorias recibidas:", data);
        setCategoria(data);
      } catch (error) {
        console.error("Error al obtener las categorias:", error);
      }
    };
    if (sucursalId) {
      fetchCategoriaSucursal();
    }
  }, [sucursalId]);

  const handleCantidadChange = (id: string, cantidad: number) => {
    setSelectedInsumosData((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  useEffect(() => {
    if (sucursalId) {
      getInsumoXSucursal(sucursalId).then(setInsumos).catch(console.error);
    }
  }, [sucursalId]);

  const handleButtonClick = async (values: any) => {
    if (selectedInsumosData.length === 0) {
      alert("Debe haber al menos un artículo en la tabla");
      return;
    }
    const allRecordsHaveQuantity = selectedInsumosData.every(
      (record) => record.cantidad > 0
    );

    if (!allRecordsHaveQuantity) {
      alert("Todos los artículos deben tener una cantidad");
      return;
    }

    console.log("Received values of form: ", values);
    const formattedValues = { ...values };
    let promises: Promise<{ url: string }>[] = [];

    formattedValues.unidadMedida = {
      id: values.unidadMedida,
      denominacion: unidadesMedida.find((u) => u.id === values.unidadMedida)
        ?.denominacion,
    };
    formattedValues.sucursal = {
      id: sucursalId,
      denominacion: "", // You might want to fill this with actual data if available
    };
    formattedValues.categoria = {
      id: values.categoria,
      denominacion: "", // You might want to fill this with actual data if available
    };
    formattedValues.articuloManufacturadoDetalles = selectedInsumosData.map(
      (insumo) => ({
        cantidad: insumo.cantidad,
        articuloInsumo: {
          id: insumo.id,
        },
      })
    );

    if (values.imagenes) {
      const files: UploadFile[] = values.imagenes;

      promises = files.map((file) => {
        return new Promise<{ url: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = (reader.result as string).replace(
              /^data:image\/\w+;base64,/,
              ""
            );
            resolve({ url: base64String });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file.originFileObj as File);
        });
      });
    }

    try {
      const imagenes = await Promise.all(promises);
      formattedValues.imagenes = imagenes;
      const token = await getAccessTokenSilently();
      const response = await crearManufacturado(formattedValues, token);
      onSubmit(response);
      form.resetFields();
      onClose();
      notification.open({
        message: (
          <span>
            <CheckCircleOutlined style={{ color: "green" }} /> Agregado
            correctamente
          </span>
        ),
      });
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return (
      e &&
      e.fileList.map((file: any) => {
        if (file.originFileObj) {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onloadend = () => {
            file.url = reader.result as string;
          };
        }
        return file;
      })
    );
  };

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Denominación",
      dataIndex: "denominacion",
      key: "denominacion",
    },
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
    },
    {
      title: "Precio Venta",
      dataIndex: "precioVenta",
      key: "precioVenta",
    },
    {
      title: "Acción",
      key: "accion",
      render: (_text: string, record: any) => (
        <Button
          type="link"
          onClick={() => handleAddArticulo(record)}
          disabled={selectedInsumos.includes(record.id)}
        >
          Agregar
        </Button>
      ),
    },
  ];

  const handleAddArticulo = (articulo: any) => {
    setSelectedInsumosData((prevData) => [...prevData, articulo]);
    setSelectedInsumos((prevKeys) => [...prevKeys, articulo.id]);
  };
  const handleRemoveArticulo = (articulo: any) => {
    setSelectedInsumosData((prevData) =>
      prevData.filter((item) => item.id !== articulo.id)
    );
    setSelectedInsumos((prevKeys) =>
      prevKeys.filter((key) => key !== articulo.id)
    );
  };

  return (
    <Modal
      visible={visible}
      title="Crear Promoción"
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Codigo:"
                name="codigo"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa el codigo",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Denominación:"
                name="denominacion"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la denominación",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Descripción:"
                name="descripcion"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la descripción",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Preparación:"
                name="preparacion"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la preparacion",
                  },
                ]}
              >
                <TextArea rows={3} style={{ width: "100%" }} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Tiempo estimado en minutos:"
                    name="tiempoEstimadoMinutos"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingresa el tiempo de preparacion",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Unidad de Medida"
                    name="unidadMedida"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, selecciona una unidad de medida",
                      },
                    ]}
                  >
                    <Select>
                      {unidadesMedida.map((unidad) => (
                        <Select.Option key={unidad.id} value={unidad.id}>
                          {unidad.denominacion}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Precio de venta:"
                name="precioVenta"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa el precio de venta",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Categoria"
                name="categoria"
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecciona una categoria",
                  },
                ]}
              >
                <Select>
                  {categoria.map((categoria) => (
                    <Select.Option key={categoria.id} value={categoria.id}>
                      {categoria.denominacion}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Foto"
                name="imagenes"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  action="/upload.do"
                  listType="picture-card"
                  beforeUpload={() => false}
                >
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Foto</div>
                  </button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Artículos Manufacturados:"
                style={{ width: "100%" }}
              >
                <Input.Search
                  placeholder="Buscar por denominación"
                  onChange={(e) => setSearchArticulos(e.target.value)}
                />
                <Table
                  rowKey="id"
                  columns={columns}
                  dataSource={insumos.filter((articulo) =>
                    articulo.denominacion
                      .toLowerCase()
                      .includes(searchArticulos)
                  )}
                  pagination={{ pageSize: 3 }}
                />
                <Input.Search
                  placeholder="Buscar por denominación"
                  onChange={(e) =>
                    setSearchSelectedArticulos(e.target.value.toLowerCase())
                  }
                />
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: "Artículo",
                      dataIndex: "denominacion",
                      key: "denominacion",
                    },
                    {
                      title: "Cantidad",
                      key: "cantidad",
                      render: (_text: string, record: any) => (
                        <InputNumber
                          min={1}
                          value={record.cantidad}
                          onChange={(value) => {
                            if (!value) {
                              alert("El campo Cantidad es requerido");
                              return;
                            }
                            handleCantidadChange(record.id, value);
                          }}
                        />
                      ),
                    },
                    {
                      title: "Acción",
                      key: "accion",
                      render: (_text: string, record: any) => (
                        <Button
                          type="primary"
                          danger
                          onClick={() => handleRemoveArticulo(record)}
                        >
                          Eliminar
                        </Button>
                      ),
                    },
                  ]}
                  dataSource={selectedInsumosData.filter((articulo) =>
                    articulo.denominacion
                      .toLowerCase()
                      .includes(searchSelectedArticulos)
                  )}
                  pagination={{ pageSize: 3 }}
                />
              </Form.Item>
            </Col>
          </Row>
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

export default FormularioProducto;
