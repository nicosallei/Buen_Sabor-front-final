import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Modal } from "antd"; // Paso 1: Importa Modal
import { obtenerCategoriasPadre } from "../../../../service/Compra";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/Store";
import ImagenPromocion from "../../../../assets/promocion.png";

const CompraCategoria = () => {
  const { sucursalId } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const carritoItems = useSelector((state: RootState) => state.cartReducer);
  const [isModalVisible, setIsModalVisible] = useState(false); // Paso 2: Estado para controlar la visibilidad del modal

  useEffect(() => {
    const fetchData = async () => {
      const idNumerico = Number(sucursalId);
      if (!isNaN(idNumerico)) {
        const data = await obtenerCategoriasPadre(idNumerico);
        setCategorias(data);
      }
    };
    fetchData();
  }, [sucursalId]);

  const handleCategoriaClick = async (id: number) => {
    navigate(`/compra/productos/${id}`);
  };

  const mostrarModalSalir = () => {
    setIsModalVisible(true); // Muestra el modal
  };

  const confirmarSalida = () => {
    navigate(-1);
    setIsModalVisible(false); // Oculta el modal después de confirmar
  };

  const cancelarSalida = () => {
    setIsModalVisible(false); // Oculta el modal si el usuario cancela
  };
  const irAPromociones = () => {
    const idNumerico = Number(sucursalId);
    navigate(`/compra/promociones/${idNumerico}`);
  };

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: "16px" }}
        onClick={() => {
          if (carritoItems.length > 0) {
            mostrarModalSalir(); // Paso 3: Usa el modal en lugar de window.confirm
          } else {
            navigate(-1);
          }
        }}
      >
        Salir de la sucursal
      </Button>
      <Modal
        title="Confirmar salida" // Aquí puedes personalizar el título
        visible={isModalVisible}
        onOk={confirmarSalida}
        onCancel={cancelarSalida}
      >
        <p>
          Tienes artículos en tu carrito. ¿Estás seguro de que quieres salir?
          Perderás todos los artículos en tu carrito.
        </p>
      </Modal>
      <h1>Elige una categoría o mira las promociones</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {categorias.map(
          (categoria: {
            id: number;
            denominacion: string;
            urlIcono: string;
          }) => (
            <Card
              key={categoria.id}
              onClick={() => handleCategoriaClick(categoria.id)}
              style={{ width: 300, height: 300 }} // Asegúrate de que el tamaño de la Card sea el deseado
              cover={
                <img
                  alt="example"
                  src={`http://localhost:8080/images/${categoria.urlIcono.replace(
                    "src\\main\\resources\\images\\",
                    ""
                  )}`}
                  onError={(e) => {
                    e.currentTarget.src =
                      "http://localhost:8080/images/sin-imagen-categoria.jpeg"; // Ruta de la imagen por defecto
                  }}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }} // Ajusta el height según necesites
                />
              }
            >
              <Card.Meta title={categoria.denominacion} />
            </Card>
          )
        )}
        <Card
          onClick={irAPromociones}
          style={{ width: 300, height: 300, cursor: "pointer" }} // Asegúrate de que el tamaño de la Card sea el deseado
          cover={
            <img
              alt="Promociones"
              src={ImagenPromocion} // Reemplaza con la URL de tu imagen para promociones
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
          }
        >
          <Card.Meta title="Ver Promociones" />
        </Card>
      </div>
    </div>
  );
};
export default CompraCategoria;
