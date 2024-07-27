import { useEffect, useState } from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";
import { DomicilioDto } from "../../../../types/compras/interface";
import {
  getPais,
  getProvincia,
  Pais,
  Provincia,
  Localidad,
  getLocalidadesByProvincia,
} from "../../../../service/ServiceUbicacion";
const { Option } = Select;
interface DireccionFormProps {
  onSubmit: (values: DomicilioDto) => void;
  onCancel: () => void;
}

const DireccionForm: React.FC<DireccionFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(
    null
  );
  const [form] = Form.useForm();

  useEffect(() => {
    getPais().then((data: Pais[]) => setPaises(data));
  }, []);

  useEffect(() => {
    if (selectedPais) {
      getProvincia().then((data: Provincia[]) => {
        const provinciasFiltradas = data.filter(
          (provincia) =>
            provincia.pais.id ===
            (selectedPais ? Number(selectedPais) : undefined)
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
    form.setFieldsValue({ provincia: undefined, localidad: undefined });
  };

  const handleProvinciaChange = (provinciaId: number) => {
    setSelectedProvincia(provinciaId);
    form.setFieldsValue({ localidad: undefined });
  };
  const cargarDatos = async () => {
    const paisesData = await getPais();
    setPaises(paisesData);
    const provinciasData = await getProvincia();
    setProvincias(provinciasData);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      {/* Select para País */}
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
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
            rules={[{ required: true, message: "Por favor ingrese la calle" }]}
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
            rules={[{ required: true, message: "Por favor ingrese el número" }]}
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={handleCancel}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DireccionForm;
