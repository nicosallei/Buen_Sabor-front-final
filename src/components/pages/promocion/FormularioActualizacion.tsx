import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  // Select,
  Table,
  InputNumber,
  Button,
  Row,
  Col,
  Space,
} from "antd";
import dayjs from "dayjs";
import {
  fetchArticulosManufacturados,
  fetchPromocionById,
  actualizarPromocion,
  Promocion,
  //eliminarDetallesPromocion,
} from "../../../service/PromocionService";
import { useAuth0 } from "@auth0/auth0-react";

//const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  promocionId: number | null;
  tiposPromocion: { value: string; label: string }[];
  selectedSucursalId?: number;
}

const FormularioActualizacionPromocion: React.FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  promocionId,
  //tiposPromocion,
  selectedSucursalId,
}) => {
  const [form] = Form.useForm();
  const [selectedArticulos, setSelectedArticulos] = useState<string[]>([]);
  const [selectedArticulosData, setSelectedArticulosData] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [searchArticulos, setSearchArticulos] = useState("");
  const [nuevaImagenBase64, setNuevaImagenBase64] = useState<string | null>(
    null
  );
  const { getAccessTokenSilently } = useAuth0();
  const [reloadKey, setReloadKey] = useState(0);

  const forceReload = () => setReloadKey((prevKey) => prevKey + 1);

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

  const [searchSelectedArticulos, setSearchSelectedArticulos] = useState("");

  useEffect(() => {
    if (selectedSucursalId) {
      fetchArticulosManufacturados(selectedSucursalId)
        .then(setArticulos)
        .catch(console.error);
    }
  }, [selectedSucursalId]);

  useEffect(() => {
    if (promocionId) {
      setNuevaImagenBase64(null);
      fetchPromocionById(promocionId).then((data) => {
        form.setFieldsValue({
          denominacion: data.denominacion,
          fechaDesde: dayjs(data.fechaDesde),
          fechaHasta: dayjs(data.fechaHasta),
          horaDesde: dayjs(data.horaDesde, "HH:mm"),
          horaHasta: dayjs(data.horaHasta, "HH:mm"),
          descripcionDescuento: data.descripcionDescuento,
          precioPromocional: data.precioPromocional,
          imagen: data.imagen,
        });
        setSelectedArticulosData(
          data.promocionDetallesDto.map((detalle: any) => ({
            ...detalle.articuloManufacturadoDto,
            cantidad: detalle.cantidad,
          }))
        );
        setSelectedArticulos(
          data.promocionDetallesDto.map(
            (detalle: any) => detalle.articuloManufacturadoDto.id
          )
        );
      });
    } else {
      form.resetFields();
    }
  }, [promocionId, reloadKey]); // Paso 3: Agregar reloadKey a las dependencias

  const handleCantidadChange = (id: string, cantidad: number) => {
    setSelectedArticulosData((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

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
        id: promocionId!,
        denominacion: formValues.denominacion,
        fechaDesde: formValues.fechaDesde.format("YYYY-MM-DD"),
        fechaHasta: formValues.fechaHasta.format("YYYY-MM-DD"),
        horaDesde: formValues.horaDesde.format("HH:mm"),
        horaHasta: formValues.horaHasta.format("HH:mm"),
        descripcionDescuento: formValues.descripcionDescuento,
        precioPromocional: formValues.precioPromocional,
        imagen: nuevaImagenBase64 || undefined, // Usar la nueva imagen si se cargó, de lo contrario la actual
        sucursales: [{ id: selectedSucursalId }],
        promocionDetalles: selectedArticulosData.map((articulo) => ({
          cantidad: articulo.cantidad,
          articuloManufacturado: { id: articulo.id },
        })),
      };
      const token = await getAccessTokenSilently();
      //await eliminarDetallesPromocion(promocionId!, token);
      await actualizarPromocion(promocionId!, promocionData, token);
      form.resetFields(); // Limpia los campos del formulario
      forceReload();
      onCancel();
      onSubmit(promocionData); // Asegúrate de llamar a onSubmit aquí
    } catch (error) {
      console.error("Error al actualizar la promoción:", error);
    }
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
  const handleRemoveArticulo = (articulo: any) => {
    setSelectedArticulosData((prevData) =>
      prevData.filter((item) => item.id !== articulo.id)
    );
    setSelectedArticulos((prevKeys) =>
      prevKeys.filter((key) => key !== articulo.id)
    );
  };

  const handleCancel = () => {
    form.resetFields(); // Limpia los campos del formulario
    forceReload();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title="Actualizar Promoción"
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
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
              <DatePicker style={{ width: "100%" }} />
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
              <DatePicker style={{ width: "100%" }} />
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
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
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
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
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
                          new Error("El precio promocional debe ser mayor a 0")
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
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
                        if (value === null || isNaN(value)) {
                          alert("El campo Cantidad debe ser un número");
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
          </Col>
        </Row>

        <Row gutter={16} justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Space>
              <Button onClick={onCancel}>Cancelar</Button>
              <Button type="primary" onClick={handleButtonClick}>
                Guardar
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default FormularioActualizacionPromocion;
