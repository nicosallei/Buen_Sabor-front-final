import { Modal, Button, Image, Card, List, Typography } from "antd";

const { Text, Title } = Typography;

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

  const imagenPorDefecto = "http://localhost:8080/images/sin-imagen.jpg";

  const imagenAMostrar =
    producto.imagenes && producto.imagenes.length > 0
      ? "http://localhost:8080/images/" + producto.imagenes[0].url
      : imagenPorDefecto;

  const precioFormateado = new Intl.NumberFormat("es-AR").format(
    producto.precioVenta
  );

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
        style={{ marginBottom: "20px" }}
      />
      <Card>
        <List>
          <List.Item>
            <List.Item.Meta title="Código" description={producto.codigo} />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              title="Descripción"
              description={
                <Text style={{ fontSize: "16px", color: "#555" }}>
                  {producto.descripcion}
                </Text>
              }
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              title="Precio de venta"
              description={
                <Title level={4} style={{ color: "green" }}>
                  ${precioFormateado}
                </Title>
              }
            />
          </List.Item>
        </List>
      </Card>
    </Modal>
  );
};

export default DetalleProducto;
