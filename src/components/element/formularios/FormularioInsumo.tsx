import React, { useState, useEffect } from "react";
import { PlusOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  Upload,
  message,
  notification,
} from "antd";
import { UploadFile } from "antd/es/upload/interface";
import {
  crearInsumo,
  getUnidadMedida,
  unidadMedida,
} from "../../../service/ServiceInsumos";
import { getSucursal, Sucursal } from "../../../service/ServiceSucursal";
import { crearManufacturado } from "../../../service/ServiceProducto";
import { getCategoria } from "../../../service/ServiceProducto";

interface FormularioInsumoProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  empresaId: string;
  sucursalId: string;
}

const FormularioInsumo: React.FC<FormularioInsumoProps> = ({
  onClose,
  empresaId,
  sucursalId,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [isModalVisible] = useState(true);
  const [isParaElaborar, setIsParaElaborar] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState<unidadMedida[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    const fetchSucursales = async () => {
      if (empresaId) {
        try {
          const sucursalesData = await getSucursal(empresaId);
          setSucursales(sucursalesData);
        } catch (error) {
          console.error("Error al obtener las sucursales:", error);
        }
      }
    };
    fetchSucursales();
  }, [empresaId]);

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
    const fetchCategorias = async () => {
      if (!isParaElaborar && sucursalId) {
        try {
          const categoriasData = await getCategoria(Number(sucursalId));
          setCategorias(categoriasData);
        } catch (error) {
          console.error("Error al obtener las categorías:", error);
        }
      }
    };
    fetchCategorias();
  }, [isParaElaborar, sucursalId]);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    const formattedValues = { ...values };
    let promises: Promise<{ url: string }>[] = [];

    formattedValues.unidadMedida = {
      id: values.unidadMedida,
      denominacion: values.denominacionUnidadMedida,
    };
    formattedValues.sucursal = {
      id: values.sucursal,
      denominacion: values.nombreSucursal,
    };
    formattedValues.categoria = {
      id: values.categoria,
      denominacion: "",
    };
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
      if (isParaElaborar) {
        formattedValues.precioVenta = 0;
      }

      let response;
      if (values.esParaElaborar) {
        response = await crearInsumo(formattedValues);
      } else {
        response = await crearInsumo(formattedValues);
        formattedValues.articuloManufacturadoDetalles = [
          {
            cantidad: 1,
            articuloInsumo: {
              id: response.id,
            },
          },
        ];
        response = await crearManufacturado(formattedValues);
      }
      console.log("Response: ", response);
      onSubmit(values);
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

  const handleSwitchChange = (checked: boolean) => {
    setIsParaElaborar(checked);
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

  return (
    <Modal
      title="Agregar Insumo"
      visible={isModalVisible}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 800, justifyContent: "center" }}
        onFinish={onFinish}
        initialValues={{
          codigo: "",
          denominacion: "",
          stockActual: 0,
          stockMaximo: 0,
          stockMinimo: 0,
          precioCompra: 0,
          precioVenta: isParaElaborar ? 0 : undefined,
          unidadMedida: "",
          sucursal: sucursalId,
          esParaElaborar: false,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Sucursal" name="sucursal">
              <Select disabled>
                {sucursales.map((sucursal) => (
                  <Select.Option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Código"
              name="codigo"
              rules={[
                { required: true, message: "El código no puede estar vacío" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Denominación"
              name="denominacion"
              rules={[
                {
                  required: true,
                  message: "La denominación no puede estar vacía",
                },
              ]}
            >
              <Input />
            </Form.Item>
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
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Foto</div>
                </button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Stock mínimo"
                  name="stockMinimo"
                  rules={[
                    {
                      required: true,
                      message: "El stock mínimo es obligatorio",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "El stock mínimo no puede ser negativo",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Stock máximo"
                  name="stockMaximo"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingresa el stock máximo",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const stockMinimo = getFieldValue("stockMinimo");
                        if (value >= stockMinimo) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "El stock máximo no puede ser menor que el stock mínimo"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Stock actual"
              name="stockActual"
              rules={[
                {
                  required: true,
                  message: "El stock actual no puede estar vacío",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value >= getFieldValue("stockMinimo")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "El stock actual no puede ser menor que el stock mínimo"
                      )
                    );
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Precio de compra"
                  name="precioCompra"
                  rules={[
                    {
                      required: true,
                      message: "El precio de compra no puede ser negativo",
                      type: "number",
                      min: 0,
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Precio de venta"
                  name="precioVenta"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue("esParaElaborar")) {
                          return Promise.resolve();
                        }
                        if (!value) {
                          return Promise.reject(
                            new Error("Por favor ingresa el precio de venta")
                          );
                        }
                        if (value <= getFieldValue("precioCompra")) {
                          return Promise.reject(
                            new Error(
                              "El precio de venta debe ser mayor al precio de compra"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    disabled={isParaElaborar}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Es para elaborar"
              name="esParaElaborar"
              valuePropName="checked"
            >
              <Switch onChange={handleSwitchChange} />
            </Form.Item>
            {!isParaElaborar && (
              <Form.Item
                label="Categoría"
                name="categoria"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona una categoría",
                  },
                ]}
              >
                <Select>
                  {categorias.map((categoria) => (
                    <Select.Option key={categoria.id} value={categoria.id}>
                      {categoria.denominacion}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Form.Item style={{ textAlign: "right" }}>
          <Button
            type="default"
            style={{ marginRight: "10px" }}
            onClick={onClose}
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

export default FormularioInsumo;
