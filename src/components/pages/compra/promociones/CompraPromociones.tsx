import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Carrito from "../Carrito";
import { Card, Button, Modal, List, Avatar, Typography } from "antd";
import { obtenerPromociones } from "../../../../service/PromocionService";
import { useAuth0 } from "@auth0/auth0-react";
import SinImagen from "../../../../assets/sin-imagen.jpg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/Store";
import { addToCarrito } from "../../../../redux/slice/Carrito.slice";
import { toast } from "react-toastify";

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

const CompraPromociones = () => {
  const navigate = useNavigate();
  const { sucursalId } = useParams();
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const { getAccessTokenSilently } = useAuth0();
  const [modalOpen, setModalOpen] = useState(false);
  const [promocionSeleccionada, setPromocionSeleccionada] =
    useState<Promocion | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const pedidoRealizado = useSelector(
    (state: RootState) => state.pedido.pedidoRealizado
  );

  useEffect(() => {
    const cargarPromociones = async () => {
      try {
        const token = await getAccessTokenSilently();
        const idNumerico = Number(sucursalId);
        if (!isNaN(idNumerico)) {
          const data = await obtenerPromociones(idNumerico, token);

          const promocionesObtenidas = data.map((promocion: any) => {
            // Adjust the image URL
            const imagen = promocion.imagen
              ? `http://localhost:8080/images/${promocion.imagen
                  .split("\\")
                  .pop()}`
              : SinImagen;

            // Map through the promotion details
            const promocionDetallesDto = promocion.promocionDetallesDto.map(
              (detalle: any) => {
                // Find the corresponding articuloManufacturadoCantidad
                const articuloCantidad =
                  promocion.articulosManufacturadosCantidad.find(
                    (item: any) =>
                      item.articuloManufacturadoId ===
                      detalle.articuloManufacturadoDto.id
                  );

                // Set cantidadMaximaDisponible
                return {
                  ...detalle,
                  articuloManufacturadoDto: {
                    ...detalle.articuloManufacturadoDto,
                    cantidadMaximaCompra: articuloCantidad
                      ? articuloCantidad.cantidadMaximaDisponible
                      : 0,
                  },
                };
              }
            );

            return {
              ...promocion,
              imagen,
              promocionDetallesDto,
            };
          });

          setPromociones(promocionesObtenidas);
        }
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      }
    };

    cargarPromociones();
  }, [sucursalId, getAccessTokenSilently]);

  const handleOpenModal = (promocion: Promocion) => {
    setPromocionSeleccionada(promocion);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const volverACategorias = () => {
    navigate(-1);
  };

  const agregarPromocionAlCarrito = (promocion: Promocion) => {
    if (pedidoRealizado) {
      toast.warning(
        "No puedes agregar más productos después de realizar un pedido."
      );
      return;
    }

    const productoSinStock = promocion.promocionDetallesDto.find(
      (detalle) =>
        detalle.cantidad >
        (detalle.articuloManufacturadoDto.cantidadMaximaCompra || 0)
    );

    if (productoSinStock) {
      toast.error(
        "No se puede agregar la promoción al carrito. Uno de los productos no tiene stock suficiente."
      );
      return;
    }

    promocion.promocionDetallesDto.forEach((detalle) => {
      const producto = detalle.articuloManufacturadoDto;
      dispatch(
        addToCarrito({
          id: producto.id,
          producto,
          cantidad: detalle.cantidad,
        })
      );
    });
    toast.success("Promoción agregada al carrito");
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <Button
          onClick={volverACategorias}
          style={{ margin: "10px", alignSelf: "flex-start" }}
        >
          Volver a Categorías
        </Button>
        <h1>Promociones</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {promociones.map((promocion) => (
            <Card
              key={promocion.id}
              title={promocion.denominacion}
              style={{ width: 300, minHeight: "400px" }}
              cover={
                <img
                  alt={promocion.denominacion}
                  src={promocion.imagen || SinImagen}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              }
            >
              <p>{promocion.descripcionDescuento}</p>
              <p>Precio Promocional: ${promocion.precioPromocional}</p>
              <Button
                onClick={() => handleOpenModal(promocion)}
                style={{ marginTop: "10px" }}
              >
                Ver Detalle
              </Button>
              <Button
                onClick={() => agregarPromocionAlCarrito(promocion)}
                style={{ marginTop: "10px" }}
              >
                Agregar al Carrito
              </Button>
            </Card>
          ))}
        </div>
      </div>
      <Carrito />
      <Modal
        title="Detalle de Promoción"
        visible={modalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Cerrar
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={() => agregarPromocionAlCarrito(promocionSeleccionada!)}
          >
            Agregar al Carrito
          </Button>,
        ]}
      >
        {promocionSeleccionada && (
          <>
            <Avatar
              alt="Imagen de la Promoción"
              src={promocionSeleccionada.imagen || SinImagen}
              style={{ width: 128, height: 128, margin: "auto" }}
            />
            <Typography.Title level={4}>
              {promocionSeleccionada.denominacion}
            </Typography.Title>
            <Typography.Paragraph>
              <strong>Descripción:</strong>{" "}
              {promocionSeleccionada.descripcionDescuento}
              <br />
              <span style={{ color: "green", fontSize: "1.1rem" }}>
                <strong>Precio:</strong> $
                {promocionSeleccionada.precioPromocional}
              </span>
            </Typography.Paragraph>
            <Typography.Paragraph>Productos:</Typography.Paragraph>
            <List>
              {promocionSeleccionada.promocionDetallesDto.map(
                (detalle, index) => {
                  const procesarUrlImagen = (url: any) => {
                    if (!url) {
                      return SinImagen;
                    }
                    return `http://localhost:8080/images/${url
                      .split("\\")
                      .pop()}`;
                  };
                  return (
                    <List.Item key={index}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            alt="Artículo"
                            src={procesarUrlImagen(
                              detalle.articuloManufacturadoDto.imagenes[0]?.url
                            )}
                          />
                        }
                        title={detalle.articuloManufacturadoDto.denominacion}
                        description={`Cantidad: ${detalle.cantidad}`}
                      />
                    </List.Item>
                  );
                }
              )}
            </List>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CompraPromociones;
