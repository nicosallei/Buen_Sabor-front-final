import { useEffect, useState } from "react";
import { Card, Button, InputNumber, Avatar, Radio, Modal } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  removeToCarrito,
  incrementarCantidad,
  decrementarCantidad,
  limpiarCarrito,
  enviarPedido,
  cambiarCantidad,
  enviarPedidoDomicilio,
} from "../../../redux/slice/Carrito.slice";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import CheckoutMP from "../../mercadoPago/CheckoutMP";
import {
  TipoEnvio,
  DomicilioDto,
  ClienteDto,
  FormaPago,
} from "../../../types/compras/interface";
import DireccionForm from "./formulario/DireccionForm";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { setPedidoRealizado } from "../../../redux/slice/Pedido.silice";
import { obtenerPromociones } from "../../../service/PromocionService";
import { useAuth0 } from "@auth0/auth0-react";

interface Promocion {
  id: number;
  eliminado: boolean;
  denominacion: string;
  fechaDesde: string;
  fechaHasta: string;
  horaDesde: string;
  horaHasta: string;
  descripcionDescuento: string;
  precioPromocional: number;
  imagen: string;
  promocionDetallesDto: IPromocionDetallesDto[];
  cantidadMaximaDisponible: number;
  sucursal: any;
}

interface IPromocionDetallesDto {
  id: number;
  eliminado: boolean;
  cantidad: number;
  articuloManufacturadoDto: IArticuloPromocionDto;
}

interface IArticuloPromocionDto {
  id: number;
  eliminado: boolean;
  denominacion: string;
  descripcion: string;
  precioVenta: number;
  tiempoEstimadoMinutos: number;
  preparacion: string;
  codigo: string;
  imagenes: ImagenArticulo[];
  sucursal: any;
  categoria: any;
  cantidadMaximaCompra?: number;
}

interface ImagenArticulo {
  id: number;
  url: string;
}

const Carrito = () => {
  const imagenPorDefecto = "http://localhost:8080/images/sin-imagen.jpg";
  const dispatch = useAppDispatch();
  const carrito = useAppSelector((state) => state.cartReducer);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  //const [pedidoRealizado, setPedidoRealizado] = useState(false);
  const [metodoEntrega, setMetodoEntrega] = useState<TipoEnvio>(
    TipoEnvio.RETIRO_LOCAL
  );
  const [direccionEnvio, setDireccionEnvio] = useState<DomicilioDto | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [metodoPago, setMetodoPago] = useState<FormaPago | null>(null);
  const pedidoRealizado = useSelector(
    (state: RootState) => state.pedido.pedidoRealizado
  );
  const [promociones, setPromociones] = useState([]);
  const [totalDescuento, setTotalDescuento] = useState<number>(0);
  const { getAccessTokenSilently } = useAuth0();
  const quitarDelCarrito = (productoId: number) => {
    dispatch(removeToCarrito({ id: productoId }));
  };

  const incrementar = (productoId: number) => {
    const producto = carrito.find((item) => item.id === productoId)?.producto;
    if (!producto) return;

    const { cantidadMaximaCompra } = producto;

    // Verifica si la cantidad actual más 1 supera la cantidad máxima permitida
    const foundItem = carrito.find((item) => item.id === productoId);
    if (foundItem && foundItem.cantidad + 1 > (cantidadMaximaCompra ?? 0)) {
      toast.warning(
        `No puedes agregar más de ${cantidadMaximaCompra} unidades de ${producto.denominacion}.`
      );
      return;
    }

    dispatch(incrementarCantidad({ id: productoId }));
  };

  const decrementar = (productoId: number) => {
    dispatch(decrementarCantidad({ id: productoId }));
  };

  const limpiar = () => {
    dispatch(limpiarCarrito());
  };

  const total = carrito.reduce(
    (sum, item) => sum + item.producto.precioVenta * item.cantidad,
    0
  );

  const handleEnviarPedido = async () => {
    if (!metodoPago) {
      toast.error("Por favor, selecciona un método de pago.");
      return;
    }
    if (metodoEntrega === TipoEnvio.DELIVERY && !direccionEnvio) {
      toast.error("Por favor, ingresa una dirección de envío.");
      return;
    }
    try {
      let resultAction;
      const rol = localStorage.getItem("rol");
      let clienteId = 1; // ID por defecto

      if (rol === "CLIENTE") {
        const idAlmacenado = localStorage.getItem("clienteId");
        if (idAlmacenado) {
          clienteId = parseInt(idAlmacenado, 10); // Asegúrate de convertir el ID a número
        }
      }

      const ClienteDto: ClienteDto = {
        id: clienteId,
      };
      if (metodoEntrega === TipoEnvio.DELIVERY) {
        resultAction = await dispatch(
          enviarPedidoDomicilio({
            direccionEnvio,
            tipoEnvio: metodoEntrega,
            formaPago: metodoPago,
            cliente: ClienteDto,
            descuento: totalDescuento,
          })
        );
      } else {
        resultAction = await dispatch(
          enviarPedido({
            tipoEnvio: metodoEntrega,
            cliente: ClienteDto,
            formaPago: metodoPago,
            descuento: totalDescuento,
          })
        );
      }
      const preferenceId = unwrapResult(resultAction);

      setPreferenceId(preferenceId);
      dispatch(setPedidoRealizado(true));
      toast.success("Pedido realizado con éxito. Ahora realiza el pago.");
    } catch (err) {
      console.error("Error al realizar el pedido", err);
      toast.error("Error al realizar el pedido.");
    }
  };

  useEffect(() => {
    if (pedidoRealizado) {
      console.log("pedidoRealizado actualizado:", pedidoRealizado);
      // Aquí puedes poner cualquier otra lógica que dependa de la actualización de pedidoRealizado
    }
  }, [pedidoRealizado]);

  const cambiarCantidadProducto = (productoId: number, cantidad: number) => {
    dispatch(cambiarCantidad({ id: productoId, cantidad }));
  };

  const handleMetodoEntregaChange = (e: any) => {
    if (pedidoRealizado) {
      return; // Evita cambiar el método de entrega si ya se realizó el pedido
    }

    const metodo = e.target.value;
    setMetodoEntrega(metodo);

    if (metodo === TipoEnvio.DELIVERY) {
      setModalVisible(true);
      setMetodoPago(FormaPago.MERCADOPAGO); // Solo permite MercadoPago para envío a domicilio
    } else {
      setMetodoPago(null); // Resetea el método de pago si cambia a retiro en local
      setModalVisible(false);
    }
  };

  const handleModalOk = (values: DomicilioDto) => {
    setDireccionEnvio(values);
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setMetodoEntrega(TipoEnvio.RETIRO_LOCAL);
    setModalVisible(false);
  };

  const handleMetodoPagoChange = (e: any) => {
    setMetodoPago(e.target.value);
  };
  const traerPromociones = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await obtenerPromociones(1, token);
      setPromociones(response);
    } catch (error) {
      console.error("Error al obtener promociones:", error);
    }
  };

  useEffect(() => {
    traerPromociones();
  }, []);

  useEffect(() => {
    const descuentoTotal = calcularDescuentoTotal();
    setTotalDescuento(descuentoTotal);
  }, [carrito, promociones]);

  const calcularDescuentoTotal = () => {
    let descuentoTotal = 0;

    // Suponiendo que `carrito` es una lista de productos en el carrito de compras.
    // Crea un registro para rastrear la cantidad comprometida de cada producto.
    let cantidadComprometida: { [key: number]: number } = {};

    promociones.forEach((promocion: Promocion) => {
      const { promocionDetallesDto, precioPromocional } = promocion;
      let maxPromociones = Infinity;
      let valorProductosEnPromocion = 0;

      promocionDetallesDto.forEach((detalle) => {
        const { articuloManufacturadoDto, cantidad } = detalle;
        const carritoItem = carrito.find(
          (item) => item.producto.id === articuloManufacturadoDto.id
        );

        if (carritoItem) {
          // Ajusta la cantidad disponible del producto basándose en la cantidad ya comprometida.
          const cantidadDisponible =
            carritoItem.cantidad -
            (cantidadComprometida[carritoItem.producto.id] || 0);
          const maxPromosPorItem = Math.floor(cantidadDisponible / cantidad);
          maxPromociones = Math.min(maxPromociones, maxPromosPorItem);
          valorProductosEnPromocion +=
            carritoItem.producto.precioVenta * cantidad;
        } else {
          maxPromociones = 0;
        }
      });

      if (maxPromociones > 0) {
        const descuentoPorPromocion =
          (valorProductosEnPromocion - precioPromocional) * maxPromociones;
        descuentoTotal += descuentoPorPromocion;

        // Actualiza la cantidad comprometida para los productos involucrados en esta promoción.
        promocionDetallesDto.forEach((detalle) => {
          const { articuloManufacturadoDto, cantidad } = detalle;
          const carritoItem = carrito.find(
            (item) => item.producto.id === articuloManufacturadoDto.id
          );

          if (carritoItem) {
            cantidadComprometida[carritoItem.producto.id] =
              (cantidadComprometida[carritoItem.producto.id] || 0) +
              cantidad * maxPromociones;
          }
        });
      }
    });

    return descuentoTotal;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Carrito</h1>
      {carrito.map((item) => {
        const subtotal = item.producto.precioVenta * item.cantidad;
        const imagenAMostrar =
          item.producto.imagenes.length > 0
            ? "http://localhost:8080/images/" + item.producto.imagenes[0].url
            : imagenPorDefecto;
        return (
          <Card key={item.id} style={{ width: 330, marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Card.Meta
                avatar={<Avatar src={imagenAMostrar} />}
                title={
                  <div
                    style={{
                      maxWidth: "250px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.producto.denominacion}
                  </div>
                }
                description={
                  <>
                    Precio: ${item.producto.precioVenta}
                    <br />
                    Cantidad:
                    <InputNumber
                      min={1}
                      max={item.producto.cantidadMaximaCompra}
                      value={item.cantidad}
                      onChange={(value) =>
                        cambiarCantidadProducto(item.id, value ?? 0)
                      }
                      disabled={pedidoRealizado}
                    />
                    <br />
                    Subtotal: {subtotal}
                  </>
                }
              />
            </div>
            {!pedidoRealizado && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  <Button
                    type="primary"
                    icon={<MinusOutlined />}
                    onClick={() => decrementar(item.id)}
                    style={{ marginRight: "5px" }}
                  />

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => incrementar(item.id)}
                  />
                </div>
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => quitarDelCarrito(item.id)}
                />
              </div>
            )}
          </Card>
        );
      })}
      {carrito.length > 0 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <Radio.Group
              onChange={handleMetodoEntregaChange}
              value={metodoEntrega}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }} // Estilos agregados para mejorar el diseño
              disabled={pedidoRealizado} // Evita que se cambie el valor si el pedido está realizado
            >
              <Radio value={TipoEnvio.RETIRO_LOCAL}>Retiro en Local</Radio>
              <Radio value={TipoEnvio.DELIVERY}>Envío a Domicilio</Radio>
            </Radio.Group>
          </div>

          {direccionEnvio && metodoEntrega === TipoEnvio.DELIVERY && (
            <div style={{ marginBottom: "20px" }}>
              <h3>Dirección de Envío:</h3>
              <p>
                calle: {direccionEnvio.calle}, Numero: {direccionEnvio.numero},
                codigo postal: {direccionEnvio.cp}
              </p>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            {metodoEntrega && (
              <Radio.Group
                onChange={handleMetodoPagoChange}
                value={metodoPago}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }} // Estilos agregados para mejorar el diseño
                disabled={pedidoRealizado} // Evita que se cambie el valor si el pedido está realizado
              >
                <Radio value={FormaPago.MERCADOPAGO}>MercadoPago</Radio>
                {metodoEntrega === TipoEnvio.RETIRO_LOCAL && (
                  <Radio value={FormaPago.EFECTIVO}>Efectivo</Radio>
                )}
              </Radio.Group>
            )}
          </div>
        </>
      )}
      <h2 style={{ textAlign: "center", fontSize: "16px", color: "green" }}>
        Descuento: ${totalDescuento}
      </h2>
      <h2 style={{ textAlign: "center", fontSize: "16px", color: "#808080" }}>
        Total Sin descuento: ${total}
      </h2>
      <h2 style={{ textAlign: "center" }}>Total: ${total - totalDescuento} </h2>
      {!pedidoRealizado && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={limpiar}
          >
            Limpiar carrito
          </Button>
          <Button type="primary" onClick={handleEnviarPedido}>
            Realizar pedido
          </Button>
        </div>
      )}

      {preferenceId && metodoPago !== FormaPago.EFECTIVO && (
        <CheckoutMP preferenceId={preferenceId} />
      )}

      <Modal
        title="Ingresar dirección de envío"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <DireccionForm
          initialValues={{
            calle: "",
            numero: "",
            localidad: 0, // Asegúrate de que este valor sea válido según los datos de tu aplicación
            cp: 0,
            pais: 0, // Asegúrate de que este valor sea válido según los datos de tu aplicación
            provincia: 0, // Asegúrate de que este valor sea válido según los datos de tu aplicación
          }}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
};

export default Carrito;
