import  { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { DomicilioDto } from "../../../../types/compras/interface";
import {
  getPais,
  getProvincia,
  getLocalidad,
  Pais,
  Provincia,
  Localidad,
} from "../../../../service/ServiceUbicacion";

interface DireccionFormProps {
  initialValues: DomicilioDto;
  onSubmit: (values: DomicilioDto) => void;
  onCancel: () => void;
}

const DireccionForm: React.FC<DireccionFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState<string | undefined>(
    undefined
  );
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const cargarPaises = async () => {
      const paises = await getPais();
      setPaises(paises);
    };
    cargarPaises();
  }, []);

  useEffect(() => {
    const cargarProvincias = async () => {
      if (!paisSeleccionado) return;
      const provincias = await getProvincia(); // Aquí deberías filtrar por país seleccionado si tu API lo soporta
      setProvincias(provincias);
    };
    cargarProvincias();
  }, [paisSeleccionado]);

  useEffect(() => {
    const cargarLocalidades = async () => {
      if (!provinciaSeleccionada) return;
      const localidades = await getLocalidad(); // Aquí deberías filtrar por provincia seleccionada si tu API lo soporta
      setLocalidades(localidades);
    };
    cargarLocalidades();
  }, [provinciaSeleccionada]);

  return (
    <Form layout="vertical" initialValues={initialValues} onFinish={onSubmit}>
      {/* Select para País */}
      <Form.Item name="pais" label="País" rules={[{ required: true }]}>
        <Select onChange={(value) => setPaisSeleccionado(value)}>
          {paises.map((pais) => (
            <Select.Option key={pais.id} value={pais.id}>
              {pais.nombre}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Select para Provincia */}
      <Form.Item
        name="provincia"
        label="Provincia"
        rules={[{ required: true }]}
      >
        <Select
          onChange={(value) => setProvinciaSeleccionada(value)}
          disabled={!paisSeleccionado}
        >
          {provincias.map((provincia) => (
            <Select.Option key={provincia.id} value={provincia.id}>
              {provincia.nombre}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Select para Localidad */}
      <Form.Item
        name="localidad"
        label="Localidad"
        rules={[{ required: true }]}
      >
        <Select disabled={!provinciaSeleccionada}>
          {localidades.map((localidad) => (
            <Select.Option key={localidad.id} value={localidad.id}>
              {localidad.nombre}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="calle"
        label="Calle"
        rules={[{ required: true, message: "Por favor, ingresa la calle" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="numero"
        label="Número"
        rules={[
          { required: true, message: "Por favor, ingresa el número" },
          {
            pattern: /^[0-9]+$/,
            message: "Solo se permiten números positivos",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="cp"
        label="Código Postal"
        rules={[
          { required: true, message: "Por favor, ingresa el código postal" },
          {
            pattern: /^[0-9]+$/,
            message: "Solo se permiten números positivos",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={onCancel}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DireccionForm;
