import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerSucursalesActivas,
  Sucursal,
} from "../../../../service/ServiceSucursal";
import { Card } from "antd";
// Importar useAppDispatch y limpiarCarrito
import { useAppDispatch } from "../../../../redux/hooks";
import { limpiarCarrito } from "../../../../redux/slice/Carrito.slice";
import { setPedidoRealizado } from "../../../../redux/slice/Pedido.silice";

const SeleccionSucursal = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const navigate = useNavigate();
  // Usar el hook useAppDispatch para obtener la función dispatch
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchSucursales = async () => {
      const data = await obtenerSucursalesActivas();
      setSucursales(data);
    };
    fetchSucursales();
    // Despachar la acción limpiarCarrito al montar el componente
    dispatch(limpiarCarrito());
    dispatch(setPedidoRealizado(false));
  }, [dispatch]);

  const handleSeleccionar = (idSucursal: string) => {
    const idNumerico = Number(idSucursal);
    navigate(`/compra/categorias/${idNumerico}`);
  };

  return (
    <div>
      <h1>Selecciona una sucursal</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {sucursales.map((sucursal) => (
          <Card
            key={sucursal.id}
            style={{ width: 300, cursor: "pointer" }}
            onClick={() => handleSeleccionar(String(sucursal.id))}
            bordered={false}
          >
            <img
              src={
                sucursal.imagen
                  ? sucursal.imagen.replace(
                      "src\\main\\resources\\images\\",
                      "http://localhost:8080/images/"
                    )
                  : "http://localhost:8080/images/sin-imagen-sucursal.png"
              }
              alt={`Sucursal ${sucursal.nombre}`}
              style={{ width: "100%", height: "auto" }}
            />
            <p>{sucursal.nombre}</p>
            <p>
              Hora: {sucursal.horaApertura} a {sucursal.horaCierre}
            </p>
            <p>
              Domicilio: {sucursal.domicilio?.calle} n°:{" "}
              {sucursal.domicilio?.numero}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SeleccionSucursal;
