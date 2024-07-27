import { useState, useEffect } from "react";
import { Modal, Input, Form } from "antd";
import { agregarStockId, getInsumoXId } from "../../../service/ServiceInsumos";

interface FormularioStockProps {
  onClose: () => void;
  id: number;
  visible: boolean;
  precioVentaInicial?: number;
  precioCompraInicial?: number;
  esParaElaborar?: boolean;
  insumo?: {
    precioVenta: number;
    precioCompra: number;
    esParaElaborar: boolean;
  };
}

const FormularioStock: React.FC<FormularioStockProps> = ({
  onClose,
  id,
  visible,
  precioVentaInicial = 0,
  precioCompraInicial = 0,
}) => {
  const [cantidad, setCantidad] = useState<number>(0);
  const [nuevoPrecioVenta, setNuevoPrecioVenta] =
    useState<number>(precioVentaInicial);
  const [nuevoPrecioCompra, setNuevoPrecioCompra] =
    useState<number>(precioCompraInicial);

  const [insumo, setInsumo] = useState<any>(null);
  const [esParaElaborar, setEsParaElaborar] = useState<boolean>(false);
  console.log(insumo);
  useEffect(() => {
    if (esParaElaborar) {
      setNuevoPrecioVenta(precioVentaInicial);
    }
  }, [esParaElaborar, precioVentaInicial]);

  useEffect(() => {
    const obtenerDatosInsumo = async () => {
      try {
        const datosInsumo = await getInsumoXId(id.toString());
        setInsumo(datosInsumo);

        setNuevoPrecioVenta(datosInsumo.precioVenta || 0);
        setNuevoPrecioCompra(datosInsumo.precioCompra);
        setEsParaElaborar(datosInsumo.esParaElaborar);
      } catch (error) {
        console.error("Error al obtener el insumo:", error);
      }
    };

    if (id) {
      obtenerDatosInsumo();
    }
  }, [id]);

  useEffect(() => {
    if (esParaElaborar) {
      setNuevoPrecioVenta(precioVentaInicial);
    }
  }, [esParaElaborar, precioVentaInicial]);

  const handleOk = async () => {
    try {
      const formData = {
        cantidad,
        nuevoPrecioVenta,
        nuevoPrecioCompra,
      };

      await agregarStockId(formData, id);
      onClose();
    } catch (error) {
      console.error("Error al agregar stock:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Agregar Stock"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form layout="vertical">
        <Form.Item label="Cantidad">
          <Input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
        </Form.Item>
        <Form.Item label="Nuevo Precio de Venta">
          <Input
            type="number"
            value={nuevoPrecioVenta}
            onChange={(e) => setNuevoPrecioVenta(Number(e.target.value))}
            disabled={esParaElaborar}
          />
        </Form.Item>

        <Form.Item label="Nuevo Precio de Compra">
          <Input
            type="number"
            value={nuevoPrecioCompra}
            onChange={(e) => setNuevoPrecioCompra(Number(e.target.value))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormularioStock;
