import { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Card, Switch, Modal, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import TarjetaAgregar from "../../element/tarjeta/TarjetaAgregar";
import {
  eliminarSucursal,
  getSucursalId,
  Sucursal as sucursalInterface,
} from "../../../service/ServiceSucursal";
import imagenSucursal from "../../../util/sucursal.jpg";
import { useSelector, useDispatch } from "react-redux";
import { EmpresaSlice } from "../../../redux/slice/EmpresaRedux";
import FormularioEditarSucursal from "../../element/formularios/FormularioEditarSucursal"; // Import your modal component
import { useAuth0 } from "@auth0/auth0-react";

const { Meta } = Card;
const { info } = Modal;

const Sucursal = () => {
  const empresa = useSelector((state) => state);
  const dispatch = useDispatch();
  console.log(empresa);
  const { getAccessTokenSilently } = useAuth0();
  const [sucursales, setSucursales] = useState<sucursalInterface[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSucursal, setCurrentSucursal] =
    useState<sucursalInterface | null>(null);

  const cargarDatosSucursal = async () => {
    try {
      const response = await getSucursalId(Number(id));
      setSucursales(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setSucursales([]);
    }
  };
  useEffect(() => {
    cargarDatosSucursal();
  }, [id]);

  const handleSwitchChange = async (
    checked: boolean,
    sucursalId: string | number | undefined
  ) => {
    const token = await getAccessTokenSilently();
    if (checked) {
      await eliminarSucursal(sucursalId as string, token);
      info({
        title: "Sucursal habilitada",
        content: "La sucursal ha sido habilitada.",
        okText: "Aceptar",
        onOk() {},
      });
    } else {
      await eliminarSucursal(sucursalId as string, token);
      info({
        title: "Sucursal deshabilitada",
        content: "La sucursal ha sido deshabilitada.",
        okText: "Aceptar",
        onOk() {},
      });
    }
    setSucursales((prevSucursales) =>
      prevSucursales.map((sucursal) =>
        sucursal.id === sucursalId
          ? { ...sucursal, eliminado: !checked }
          : sucursal
      )
    );
  };

  useEffect(() => {
    getSucursalId(Number(id))
      .then((response) => {
        console.log(response);
        setSucursales(response);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setSucursales([]);
      });
  }, [id]);

  const showInfo = () => {
    info({
      title: "Sucursal deshabilitada",
      content: "Para ingresar a la sucursal, primero debes habilitarla.",
      okText: "Aceptar",
      onOk() {},
    });
  };

  const handleCardClick = (sucursal: sucursalInterface) => {
    if (sucursal.eliminado) {
      showInfo();
    } else {
      dispatch(EmpresaSlice.actions.setIdSucursal(sucursal.id || null));
      navigate("/productos");
    }
  };

  const handleEditClick = (
    e: React.MouseEvent,
    sucursal: sucursalInterface
  ) => {
    e.stopPropagation();
    if (!sucursal.eliminado) {
      setCurrentSucursal(sucursal);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = async () => {
    setIsModalVisible(false);
    setCurrentSucursal(null);
    await cargarDatosSucursal(); // Recargar los datos después de cerrar el modal de edición
  };
  useEffect(() => {
    const cargarDatosSucursal = async () => {
      try {
        const response = await getSucursalId(Number(id));
        console.log(response);
        setSucursales(response);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setSucursales([]);
      }
    };

    cargarDatosSucursal();
  }, [id]);

  const imageStyle = {
    width: "100%", // Ajusta el ancho al 100% del contenedor
    height: "200px", // Altura fija para todas las imágenes
    objectFit: "cover", // Asegura que la imagen cubra el espacio sin distorsionarse
  };

  return (
    <div>
      <h1>Sucursales</h1>
      <Row gutter={16}>
        {Array.isArray(sucursales) &&
          sucursales.map((sucursal) => (
            <Col key={sucursal.id} span={5}>
              <Card
                style={{
                  marginBottom: 10,
                  backgroundColor: sucursal.eliminado ? "#ff3d3d" : "white",
                }}
                cover={
                  <img
                    alt={sucursal.nombre}
                    src={
                      sucursal.imagen
                        ? sucursal.imagen
                            .replace(
                              /src\\main\\resources\\images\\/g,
                              "http://localhost:8080/images/"
                            )
                            .replace(/\\/g, "/")
                        : imagenSucursal
                    }
                    style={imageStyle as React.CSSProperties} // Apply the defined style to the image
                    onClick={() => handleCardClick(sucursal)}
                  />
                }
                actions={[
                  <Switch
                    checked={!sucursal.eliminado}
                    onChange={(checked) =>
                      handleSwitchChange(checked, sucursal.id)
                    }
                  />,
                  <EditOutlined
                    key="edit"
                    disabled={sucursal.eliminado}
                    onClick={(e) => handleEditClick(e, sucursal)}
                  />,
                ]}
              >
                <Meta
                  title={sucursal.nombre}
                  description={`Hora: ${
                    sucursal?.horaApertura || "No disponible"
                  } a ${sucursal?.horaCierre || "No disponible"}, Domicilio: ${
                    sucursal?.domicilio?.calle || "No disponible"
                  } n°: ${sucursal?.domicilio?.numero || ""}`}
                />
              </Card>
            </Col>
          ))}
      </Row>
      <TarjetaAgregar onSucursalAdded={cargarDatosSucursal} />

      {isModalVisible && currentSucursal && (
        <FormularioEditarSucursal
          visible={isModalVisible}
          sucursalId={currentSucursal.id}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Sucursal;
