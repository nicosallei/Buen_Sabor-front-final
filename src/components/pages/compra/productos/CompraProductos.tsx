import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductosPorCategoria } from "../../../../service/Compra";
import DetalleProducto from "./DetalleProducto";
import Carrito from "../Carrito";
import { Producto } from "../../../../types/compras/interface";
import { Card, Button } from "antd";
import { addToCarrito } from "../../../../redux/slice/Carrito.slice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/Store";
import { buscarCategoriaXId } from "../../../../service/ServiceCategoria";

const CompraProductos = () => {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();
  const pedidoRealizado = useSelector(
    (state: RootState) => state.pedido.pedidoRealizado
  );
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [categorias, setCategorias] = useState<
    { id: any; denominacion: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductosPorCategoria(Number(categoriaId));
      setProductos(data);

      const uniqueCategoryIds = Array.from(
        new Set(
          data.map((producto: { categoriaId: number }) => producto.categoriaId)
        )
      );

      // Obtener los nombres de las categorías
      const categoriasConNombre = await Promise.all(
        uniqueCategoryIds.map(async (id) => {
          const categoria = await buscarCategoriaXId(Number(id));
          return { id, denominacion: categoria.denominacion };
        })
      );

      setCategorias(categoriasConNombre);
    };
    fetchData();
  }, [categoriaId]);

  const verDetalle = (producto: Producto) => {
    setSelectedProducto(producto);
  };

  const cerrarDetalle = () => {
    setSelectedProducto(null);
  };

  const agregarAlCarrito = (producto: Producto) => {
    if (pedidoRealizado) {
      toast.warning(
        "No puedes agregar más productos después de realizar un pedido."
      );
      return;
    }

    dispatch(addToCarrito({ id: producto.id, producto, cantidad: 1 }));
  };

  const volverACategorias = () => {
    navigate(-1);
  };

  const handleBusquedaChange = (e: any) => {
    setBusqueda(e.target.value);
  };

  const handleCategoriaFiltroChange = (e: any) => {
    setCategoriaFiltro(e.target.value);
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.denominacion
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaFiltro === "Todas" ||
      producto.categoriaId === Number(categoriaFiltro);
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <Button
          onClick={volverACategorias}
          style={{ margin: "10px", alignSelf: "flex-start" }}
        >
          Volver a Categorías
        </Button>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={handleBusquedaChange}
        />
        <select value={categoriaFiltro} onChange={handleCategoriaFiltroChange}>
          <option value="Todas">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.denominacion}
            </option>
          ))}
        </select>
        <h1>Productos</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {productosFiltrados.map((producto) => (
            <Card
              key={producto.id}
              style={{ width: 300, overflow: "hidden" }}
              cover={
                <img
                  alt={producto.denominacion}
                  src={
                    producto.imagenes.length > 0
                      ? `http://localhost:8080/images/${producto.imagenes[0].url}`
                      : "http://localhost:8080/images/sin-imagen.jpg"
                  }
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              }
            >
              <Card.Meta
                title={producto.denominacion}
                description={
                  <>
                    <p>{producto.descripcion}</p>
                    <p
                      style={{ fontWeight: "bold", fontSize: "larger" }}
                    >{`Precio: $${producto.precioVenta}`}</p>
                    <br />
                  </>
                }
              />
              <Button type="primary" onClick={() => verDetalle(producto)}>
                Ver detalles
              </Button>
              <Button type="primary" onClick={() => agregarAlCarrito(producto)}>
                Agregar al carrito
              </Button>
            </Card>
          ))}
        </div>
        {selectedProducto && (
          <DetalleProducto
            producto={selectedProducto}
            onClose={cerrarDetalle}
          />
        )}
      </div>
      <Carrito />
    </div>
  );
};

export default CompraProductos;
