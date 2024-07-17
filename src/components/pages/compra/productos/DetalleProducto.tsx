import { Modal, Button, Image } from "antd";

interface DetalleProductoProps {
  producto: any;
  onClose: () => void;
}

const DetalleProducto: React.FC<DetalleProductoProps> = ({
  producto,
  onClose,
}) => {
  if (!producto) {
    return <div>Cargando...</div>;
  }
  // URL de imagen por defecto
  const imagenPorDefecto = "http://localhost:8080/images/sin-imagen.jpg";
  // Determina la imagen a mostrar
  const imagenAMostrar =
    producto.imagenes && producto.imagenes.length > 0
      ? "http://localhost:8080/images/" + producto.imagenes[0].url
      : imagenPorDefecto;

  return (
    <Modal
      title={producto.denominacion}
      visible={true}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cerrar
        </Button>,
      ]}
    >
      <Image
        src={imagenAMostrar}
        alt="Imagen del producto"
        style={{ marginBottom: "20px" }} // Ajusta el estilo según sea necesario
      />
      <p>{producto.descripcion}</p>
      <p>Código: {producto.codigo}</p>
      <p>Precio de venta: {producto.precioVenta}</p>
      <p>Categoría: {producto.categoriaId}</p>
      <p>Sucursal: {producto.sucursalId}</p>
      {/* Aquí puedes agregar más detalles del producto según sea necesario */}
    </Modal>
  );
};

export default DetalleProducto;
