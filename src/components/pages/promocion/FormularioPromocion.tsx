import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  //Select,
  Table,
  InputNumber,
  Button,
  Row,
  Col,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  fetchArticulosManufacturados,
  savePromocion,
  Promocion,
} from "../../../service/PromocionService";

//const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
  tiposPromocion: { value: string; label: string }[];
  selectedSucursalId?: number;
}

const FormularioPromocion: React.FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  //tiposPromocion,
  selectedSucursalId,
}) => {
  const [searchArticulos, setSearchArticulos] = useState("");
  const [searchSelectedArticulos, setSearchSelectedArticulos] = useState("");
  const [selectedArticulos, setSelectedArticulos] = useState<string[]>([]);
  const [selectedArticulosData, setSelectedArticulosData] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [imagenBase64, setImagenBase64] = useState<string | undefined>(
    undefined
  );

  const setFieldValue = (_arg0: string, value: string | Dayjs): void => {
    if (typeof value === "string") {
      value = dayjs(value);
    }
    // Add logic as needed
  };

  const handleCantidadChange = (id: string, cantidad: number) => {
    setSelectedArticulosData((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
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

  useEffect(() => {
    if (selectedSucursalId) {
      fetchArticulosManufacturados(selectedSucursalId)
        .then(setArticulos)
        .catch(console.error);
    }
  }, [selectedSucursalId]);

  const handleButtonClick = async () => {
    try {
      const formValues = await form.validateFields();
      if (selectedArticulosData.length === 0) {
        alert("Debe haber al menos un artículo en la tabla");
        return;
      }
      const allRecordsHaveQuantity = selectedArticulosData.every(
        (record) => record.cantidad > 0
      );

      if (!allRecordsHaveQuantity) {
        alert("Todos los artículos deben tener una cantidad");
        return;
      }
      const promocionData: Promocion = {
        id: 0,
        denominacion: formValues.denominacion,
        fechaDesde: formValues.fechaDesde.format("YYYY-MM-DD"),
        fechaHasta: formValues.fechaHasta.format("YYYY-MM-DD"),
        horaDesde: formValues.horaDesde.format("HH:mm"),
        horaHasta: formValues.horaHasta.format("HH:mm"),
        descripcionDescuento: formValues.descripcionDescuento,
        precioPromocional: formValues.precioPromocional,
        imagen: imagenBase64, // Aquí se envía la imagen en base64
        sucursales: [{ id: selectedSucursalId }],
        promocionDetalles: selectedArticulosData.map((articulo) => ({
          cantidad: articulo.cantidad,
          articuloManufacturado: { id: articulo.id },
        })),
      };

      await savePromocion(promocionData);
      form.resetFields(); // Limpia los campos del formulario
      setImagenBase64(undefined);
      onCancel();
      setSelectedArticulos([]);
      setSelectedArticulosData([]);
      form.resetFields();
      onSubmit(promocionData);
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
    }
  };
  const handleRemoveArticulo = (articulo: any) => {
    setSelectedArticulosData((prevData) =>
      prevData.filter((item) => item.id !== articulo.id)
    );
    setSelectedArticulos((prevKeys) =>
      prevKeys.filter((key) => key !== articulo.id)
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
          disabled={selectedArticulos.includes(record.id)}
        >
          Agregar
        </Button>
      ),
    },
  ];

  const handleAddArticulo = (articulo: any) => {
    setSelectedArticulosData((prevData) => [...prevData, articulo]);
    setSelectedArticulos((prevKeys) => [...prevKeys, articulo.id]);
  };

  return (
    <Modal
      visible={visible}
      title="Crear Promoción"
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
        layout="vertical"
      >
        <div>
          <Row gutter={16}>
            <Col span={12}>
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
                label="Fecha Desde:"
                name="fechaDesde"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la fecha desde",
                  },
                ]}
              >
                <DatePicker
                  onChange={(value) => setFieldValue("fechaDesde", value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Fecha Hasta:"
                name="fechaHasta"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la fecha hasta",
                  },
                ]}
              >
                <DatePicker
                  onChange={(value) => setFieldValue("fechaHasta", value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Hora Desde:"
                name="horaDesde"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la hora desde",
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  onChange={(value) =>
                    setFieldValue("horaDesde", value.format("HH:mm"))
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Hora Hasta:"
                name="horaHasta"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la hora hasta",
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  onChange={(value) =>
                    setFieldValue("horaHasta", value.format("HH:mm"))
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Descripción Descuento:"
                name="descripcionDescuento"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la descripción del descuento",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Precio Promocional:"
                name="precioPromocional"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa el precio promocional",
                  },
                  {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "El precio promocional debe ser mayor a 0"
                            )
                          ),
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>

              {/* <Form.Item label="Tipo Promoción:" name="tipoPromocion">
                <Select style={{ width: "100%" }}>
                  {tiposPromocion.map((tipo) => (
                    <Option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}

              <Form.Item label="Imagen:" name="imagen">
                <Input
                  type="file"
                  onChange={handleImagenChange}
                  accept="image/*"
                />
              </Form.Item>

              {imagenBase64 && (
                <div style={{ marginTop: 20 }}>
                  <img
                    src={imagenBase64}
                    alt="Preview"
                    style={{ maxWidth: 200 }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </div>

        <Form.Item label="Artículos Manufacturados:" style={{ width: "100%" }}>
          <Input.Search
            placeholder="Buscar por denominación"
            onChange={(e) => setSearchArticulos(e.target.value)}
          />
          <Table
            rowKey="id"
            columns={columns}
            dataSource={articulos.filter((articulo) =>
              articulo.denominacion.toLowerCase().includes(searchArticulos)
            )}
            pagination={{ pageSize: 5 }}
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
            dataSource={selectedArticulosData.filter((articulo) =>
              articulo.denominacion
                .toLowerCase()
                .includes(searchSelectedArticulos)
            )}
            pagination={{ pageSize: 5 }}
          />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={handleButtonClick}>
            Cargar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormularioPromocion;
