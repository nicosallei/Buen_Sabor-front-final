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
  Image,
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
  getCategoria,
  getProductoXIdBase,
  modificarProductoId,
} from "../../../service/ServiceProducto";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
  sucursalId?: string;
  productoId: string;
}
interface ImageData {
  id: string;
  name: string;
  status: string;
  url: string;
}

const FormularioActualizarProducto: React.FC<Props> = ({
  visible,
  onClose,
  productoId,
  initialValues,
  sucursalId,
}) => {
  const [, setIsModalVisible] = useState(false);
  const [searchArticulos, setSearchArticulos] = useState("");
  const [searchSelectedArticulos, setSearchSelectedArticulos] = useState("");
  const [selectedInsumos, setSelectedInsumos] = useState<string[]>([]);
  const [selectedInsumosData, setSelectedInsumosData] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [images, setImages] = useState<ImageData[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<unidadMedida[]>([]);

  const [categoria, setCategoria] = useState<any[]>([]);

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
    if (sucursalId) {
      getInsumoXSucursal(sucursalId).then(setInsumos).catch(console.error);
    }
  }, [sucursalId]);

  useEffect(() => {
    if (productoId) {
      getProductoXIdBase(productoId).then((data) => {
        form.setFieldsValue({
          codigo: data.codigo,
          denominacion: data.denominacion,
          descripcion: data.descripcion,
          preparacion: data.preparacion,
          tiempoEstimadoMinutos: data.tiempoEstimadoCocina,
          unidadMedida: data.unidadMedida.id,
          precioVenta: data.precioVenta,
          categoria: data.categoria.id,
          imagen: data.imagen,
        });
        setSelectedInsumosData(
          data.articuloManufacturadoDetallesDto.map((detalle: any) => ({
            ...detalle.articuloInsumoDto,
            cantidad: detalle.cantidad,
          }))
        );
        setSelectedInsumos(
          data.articuloManufacturadoDetallesDto.map(
            (detalle: any) => detalle.articuloInsumoDto.id
          )
        );
        const imagesData = data.imagenes.map(
          (img: { id: string; url: string }) => ({
            id: img.id,
            name: `image-${img.id}.jpeg`,
            status: "done",
            url: img.url,
          })
        );
        setImages(imagesData);
      });
    }
  }, [productoId, form]);

  const handleCantidadChange = (id: string, cantidad: number) => {
    setSelectedInsumosData((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

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
    let formattedValues = { ...values };

    formattedValues.unidadMedida = {
      id: values.unidadMedida,
      denominacion: unidadesMedida.find((u) => u.id === values.unidadMedida)
        ?.denominacion,
    };
    formattedValues.sucursal = {
      id: sucursalId,
      denominacion: "", // Consider filling this with actual data if available
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

    try {
      let uploadedImages = [];
      if (values.imagenes) {
        uploadedImages = await Promise.all(
          values.imagenes.map(async (file: any) => {
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

      const existingImages = images.map((image) => ({
        url: image.url,
      }));

      formattedValues.imagenes = [...uploadedImages, ...existingImages];

      console.log("Formatted values for submission:", formattedValues);

      await modificarProductoId(formattedValues, parseInt(productoId, 10));
      notification.success({
        message: "Producto actualizado correctamente",
        icon: <CheckCircleOutlined style={{ color: "#108ee9" }} />,
      });
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

  const handleDelete = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

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
      title="Actualizar Producto"
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
                    name="tiempoEstimadoCocina"
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
              <Form.Item label="Foto">
                <Image.PreviewGroup>
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
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

export default FormularioActualizarProducto;
