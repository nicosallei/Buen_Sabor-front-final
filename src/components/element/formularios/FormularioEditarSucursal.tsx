import { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  TimePicker,
  notification,
  Select,
} from "antd";
import {
  Sucursal as SucursalInterface,
  actualizarSucursal,
  getSucursalXId,
} from "../../../service/ServiceSucursal";
import {
  getLocalidad,
  getLocalidadesByProvincia,
  getPais,
  getProvincia,
} from "../../../service/ServiceUbicacion";

import { Pais, Provincia, Localidad } from "../../../service/ServiceUbicacion";

import moment from "moment";

const { Option } = Select;

interface FormularioEditarSucursalProps {
  visible: boolean;
  sucursalId: number | undefined;
  onClose: () => void;
}

const FormularioEditarSucursal: React.FC<FormularioEditarSucursalProps> = ({
  sucursalId,
  onClose,
}) => {
  const [componentDisabled] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [form] = Form.useForm();

  const [paises, setPaises] = useState<Pais[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [, setSucursal] = useState<SucursalInterface | null>(null);
  const [nuevaImagenBase64, setNuevaImagenBase64] = useState<string | null>(
    null
  );
  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(
    null
  );

  useEffect(() => {
    getPais().then((data: Pais[]) => setPaises(data));
  }, []);

  useEffect(() => {
    if (selectedPais) {
      getProvincia().then((data: Provincia[]) => {
        const provinciasFiltradas = data.filter(
          (provincia) =>
            provincia.pais.id ===
            (selectedPais ? Number(selectedPais) : undefined) // Asegúrate de que ambos sean del mismo tipo
        );
        setProvincias(provinciasFiltradas);
      });
    } else {
      setProvincias([]);
    }
    setSelectedProvincia(null);
    setLocalidades([]);
  }, [selectedPais]);

  useEffect(() => {
    if (selectedProvincia) {
      getLocalidadesByProvincia(selectedProvincia).then((data: Localidad[]) =>
        setLocalidades(data)
      );
    } else {
      setLocalidades([]);
    }
  }, [selectedProvincia]);
  const handlePaisChange = (paisId: number) => {
    setSelectedPais(paisId);
    form.setFieldsValue({ provincia: undefined, localidad: undefined }); // Clear provincia and localidad fields
  };

  const handleProvinciaChange = (provinciaId: number) => {
    setSelectedProvincia(provinciaId);
    form.setFieldsValue({ localidad: undefined }); // Clear localidad field
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
  useEffect(() => {
    const fetchData = async () => {
      const [paisData, provinciaData, localidadData, sucursalData] =
        await Promise.all([
          getPais(),
          getProvincia(),
          getLocalidad(),
          getSucursalXId(String(sucursalId!)),
        ]);
      setPaises(paisData);
      setProvincias(provinciaData);
      setLocalidades(localidadData);
      setSucursal(sucursalData);

      form.setFieldsValue({
        nombre: sucursalData.nombre,
        horaApertura: moment(sucursalData.horaApertura, "HH:mm"), // Convertir a momento
        horaCierre: moment(sucursalData.horaCierre, "HH:mm"), // Convertir a momento
        pais: sucursalData.domicilio.localidad.provincia.pais.nombre,
        provincia: sucursalData.domicilio.localidad.provincia.nombre,
        localidad: sucursalData.domicilio.localidad.nombre,
        calle: sucursalData.domicilio.calle,
        numero: sucursalData.domicilio.numero,
        cp: sucursalData.domicilio.cp,
        empresaId: sucursalData.empresa.id,
        imagen: sucursalData.imagen,
      });
    };

    if (sucursalId) {
      fetchData();
    }
  }, [sucursalId, form]);

  const handleOk = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleSubmit = async (values: any) => {
    try {
      const { horaApertura, horaCierre, ...rest } = values;
      const updatedSucursal: SucursalInterface = {
        ...rest,

        horaApertura: horaApertura.format("HH:mm"),
        horaCierre: horaCierre.format("HH:mm"),
        idEmpresa: sucursalId,
        imagen: nuevaImagenBase64,
        pais: values.pais,
        provincia: values.provincia,
        localidad: values.localidad,
        calle: values.calle,
        numero: values.numero,
        cp: values.cp,
        nombre: values.nombre,
      };

      await actualizarSucursal(sucursalId!, updatedSucursal);
      notification.success({
        message: "Sucursal actualizada",
        description: "Sucursal actualizada correctamente",
      });
      handleOk();
      cargarDatos();
      setNuevaImagenBase64(null);
      //window.location.reload();
    } catch (error) {
      console.error("Error updating sucursal:", error);
      notification.error({
        message: "Error",
        description: "La sucursal no fue actualizada, revise los datos",
      });
    }
  };
  const cargarDatos = async () => {
    const paisesData = await getPais();
    setPaises(paisesData);
    const provinciasData = await getProvincia();
    setProvincias(provinciasData);
    const localidadesData = await getLocalidad();
    setLocalidades(localidadesData);
  };

  useEffect(() => {
    cargarDatos();
  }, []);
  return (
    <Modal
      title="Editar Sucursal"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={componentDisabled}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="empresaId" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label="Nombre"
              name="nombre"
              rules={[
                { required: true, message: "Por favor ingrese el nombre" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Horario de Apertura"
                  name="horaApertura"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el horario de apertura",
                    },
                  ]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Horario de Cierre"
                  name="horaCierre"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el horario de cierre",
                    },
                  ]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="País"
              name="pais"
              rules={[{ required: true, message: "Por favor ingrese el país" }]}
            >
              <Select
                showSearch
                filterOption={(input, option: any) =>
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={handlePaisChange}
              >
                {paises.map((pais) => (
                  <Option key={pais.id} value={String(pais.id)}>
                    {pais.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Provincia"
              name="provincia"
              rules={[
                { required: true, message: "Por favor ingrese la provincia" },
              ]}
            >
              <Select
                showSearch
                disabled={!selectedPais}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onChange={handleProvinciaChange}
              >
                {provincias.map((provincia) => (
                  <Option key={provincia.id} value={String(provincia.id)}>
                    {provincia.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Localidad"
              name="localidad"
              rules={[
                { required: true, message: "Por favor ingrese la localidad" },
              ]}
            >
              <Select
                showSearch
                disabled={!selectedProvincia}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {localidades.map((localidad) => (
                  <Option key={localidad.id} value={String(localidad.id)}>
                    {localidad.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Calle"
              name="calle"
              rules={[
                { required: true, message: "Por favor ingrese la calle" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item
              label="Número"
              name="numero"
              rules={[
                { required: true, message: "Por favor ingrese el número" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Código Postal"
              name="cp"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el código postal",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Col span={12}>
          <Form.Item label="Imagen:">
            {nuevaImagenBase64 && (
              <img
                src={nuevaImagenBase64}
                alt="Nueva imagen de la promoción"
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

        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Button
            type="default"
            style={{ marginRight: "10px" }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            Actualizar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormularioEditarSucursal;
