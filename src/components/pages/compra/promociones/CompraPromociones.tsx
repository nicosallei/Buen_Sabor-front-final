import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Carrito from "../Carrito";
import { Producto } from "../../../../types/compras/interface";
import { Card, Button, Modal, List, Avatar, Typography } from "antd";
import { addToCarrito } from "../../../../redux/slice/Carrito.slice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/Store";
import { obtenerPromociones } from "../../../../service/PromocionService";
import { useAuth0 } from "@auth0/auth0-react";
import SinImagen from "../../../../assets/sin-imagen.jpg";

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
  imagen: ImagenArticulo;
}
interface ImagenArticulo {
  url: string;
}

const CompraPromociones = () => {
  const navigate = useNavigate();
  const { sucursalId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const pedidoRealizado = useSelector(
    (state: RootState) => state.pedido.pedidoRealizado
  );
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const { getAccessTokenSilently } = useAuth0();
  const [modalOpen, setModalOpen] = useState(false);
  const [promocionSeleccionada, setPromocionSeleccionada] =
    useState<Promocion | null>(null);

  useEffect(() => {
    const cargarPromociones = async () => {
      try {
        const token = await getAccessTokenSilently();
        const idNumerico = Number(sucursalId);
        if (!isNaN(idNumerico)) {
          const data = await obtenerPromociones(idNumerico, token);

          const promocionesObtenidas = data.map((promocion: any) => ({
            ...promocion,
            imagen: promocion.imagen
              ? `http://localhost:8080/images/${promocion.imagen
                  .split("\\")
                  .pop()}`
              : SinImagen,
          }));

          setPromociones(promocionesObtenidas);
        }
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      }
    };

    cargarPromociones();
  }, [sucursalId]);

  const agregarAlCarrito = (producto: Producto) => {
    if (pedidoRealizado) {
      toast.warning(
        "No puedes agregar más productos después de realizar un pedido."
      );
      return;
    }

    dispatch(addToCarrito({ id: producto.id, producto, cantidad: 1 }));
  };

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
              {promocionSeleccionada.promocionDetallesDto &&
                promocionSeleccionada.promocionDetallesDto.map(
                  (detalle: any, index: any) => {
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
                                detalle.articuloManufacturadoDto.imagenes[0]
                                  ?.url
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
