import { useEffect, useState } from "react";
import { Select, Card, Button, Modal, Table, Switch } from "antd";
import { getSucursal } from "../../../service/ServiceSucursal";
import { getEmpresas } from "../../../service/ServiceEmpresa";
import { Sucursal } from "../../../service/ServiceSucursal";
import { Empresas } from "../../../service/ServiceEmpresa";
import {
  promocionesPorSucursal,
  Promocion,
  PromocionDetalle,
  ArticuloManufacturado,
} from "../../../service/PromocionService";
import FormularioPromocion from "./FormularioPromocion";
import FormularioActualizacionPromocion from "./FormularioActualizacion"; // Importar el formulario de actualización
import {
  //savePromocion,
  eliminacionLogica,
} from "../../../service/PromocionService";
import { useAuth0 } from "@auth0/auth0-react";
import sinImagen from "../../../assets/sin-imagen.jpg";

const { Option } = Select;

const Promociones = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
  const [promociones, setPromociones] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [promocionDetail, setPromocionDetail] = useState<
    ArticuloManufacturado[]
  >([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false); // Estado para la visibilidad del formulario de actualización
  const [selectedSucursalId, setSelectedSucursalId] = useState<number>(0);
  const [selectedPromocionId, setSelectedPromocionId] = useState<number | null>(
    null
  ); // Estado para el ID de la promoción seleccionada
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await getEmpresas();
      setEmpresas(empresasData);
    };

    fetchEmpresas();
  }, []);

  useEffect(() => {
    const fetchSucursales = async () => {
      if (selectedEmpresa) {
        const sucursalesData = await getSucursal(selectedEmpresa);
        setSucursales(sucursalesData);
      }
    };

    fetchSucursales();
  }, [selectedEmpresa]);

  useEffect(() => {
    const empresaId = localStorage.getItem("empresa_id");
    const sucursalId = localStorage.getItem("sucursal_id");
    if (empresaId && sucursalId) {
      setSelectedEmpresa(empresaId);
      setSelectedSucursalId(Number(sucursalId));
      setIsDisabled(true);
      handleSucursalChange(sucursalId);
    }
  }, []);

  const handleSucursalChange = async (value: string) => {
    const selectedId = Number(value);
    setSelectedSucursalId(selectedId);
    if (selectedId !== null) {
      const promocionesData = await promocionesPorSucursal(selectedId);
      setPromociones(promocionesData);
    }
  };

  const handleShowDetail = async (promocionId: number) => {
    const detalle = await PromocionDetalle(promocionId);
    // Manipular la URL para obtener solo el nombre del archivo y agregar la ruta base
    detalle.forEach((item: any) => {
      if (
        item.articuloManufacturadoDto.imagenes &&
        item.articuloManufacturadoDto.imagenes.length > 0
      ) {
        const url = item.articuloManufacturadoDto.imagenes[0].url;
        const parts = url.split("\\");
        const fileName = parts[parts.length - 1];
        item.articuloManufacturadoDto.imagenes[0].url = `http://localhost:8080/images/${fileName}`;
      }
    });
    setPromocionDetail(detalle);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleCreatePromotion = async () => {
    if (selectedSucursalId !== null) {
      try {
        setIsFormVisible(true);
      } catch (error) {
        console.error("Error fetching articulos manufacturados:", error);
      }
    } else {
      console.error("No se seleccionó ninguna sucursal");
    }
  };

  const handleSubmitPromocion = async () => {
    try {
      //const token = await getAccessTokenSilently();
      //const response = await savePromocion(values, token);
      //console.log("Promoción guardada con éxito:", response);
      setIsFormVisible(false); // Cierra el formulario si se guarda con éxito
      await handleSucursalChange(selectedSucursalId.toString()); // Recarga las promociones
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
    }
  };

  const handleTogglePromotion = async (
    promocionId: number,
    checked: boolean
  ) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await eliminacionLogica(promocionId, token);
      if (response) {
        console.log(
          `Promoción ID: ${promocionId}, Estado: ${
            checked ? "Habilitado" : "Deshabilitado"
          }`
        );
        const promocionesData = await promocionesPorSucursal(
          selectedSucursalId
        );
        setPromociones(promocionesData);
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la promoción:", error);
    }
  };

  const handleEditPromotion = (promocionId: number) => {
    setSelectedPromocionId(promocionId); // Establece el ID de la promoción seleccionada
    setIsUpdateFormVisible(true); // Muestra el formulario de actualización
  };

  const handleUpdatePromotion = async () => {
    try {
      setIsUpdateFormVisible(false); // Cierra el formulario si se actualiza con éxito
      handleSucursalChange(selectedSucursalId.toString()); // Recarga las promociones
    } catch (error) {
      console.error("Error al actualizar la promoción:", error);
    }
  };

  const columns = [
    {
      title: "Imagen",
      dataIndex: "articuloManufacturadoDto",
      key: "imagen",
      render: (articuloManufacturadoDto: any) =>
        articuloManufacturadoDto.imagenes &&
        articuloManufacturadoDto.imagenes.length > 0 ? (
          <img
            src={articuloManufacturadoDto.imagenes[0].url}
            alt={articuloManufacturadoDto.denominacion}
            style={{ width: "50px" }}
          />
        ) : (
          <img src={sinImagen} alt="Sin imagen" style={{ width: "50px" }} />
        ),
    },
    {
      title: "Denominación",
      dataIndex: "articuloManufacturadoDto",
      key: "denominacion",
      render: (articuloManufacturadoDto: any) =>
        articuloManufacturadoDto.denominacion,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h1>PROMOCIONES</h1>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            margin: "10px 0",
          }}
        >
          <Select
            placeholder="Seleccione una empresa"
            style={{ width: 200 }}
            onChange={(value) => setSelectedEmpresa(value)}
            value={selectedEmpresa}
            disabled={isDisabled}
          >
            {empresas.map((empresa) => (
              <Option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Seleccione una sucursal"
            style={{ width: 200 }}
            disabled={!selectedEmpresa || isDisabled}
            onChange={handleSucursalChange}
            value={selectedSucursalId?.toString()}
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          type="primary"
          onClick={handleCreatePromotion}
          style={{ marginBottom: "10px" }}
        >
          Crear Promoción
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {promociones.map((promocion: Promocion) => (
          <Card
            key={promocion.id}
            style={{
              width: 350, // Aumenta el ancho de la tarjeta según tus necesidades
              marginBottom: "10px",
              backgroundColor: promocion.eliminado ? "lightgray" : "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.8em",
                color: "gray",
              }}
            >
              <p>Inicio: {promocion.fechaDesde}</p>
              <p>Fin: {promocion.fechaHasta}</p>
            </div>
            <h2
              style={{
                overflowWrap: "break-word",
                wordWrap: "break-word",
                hyphens: "auto",
              }}
            >
              {promocion.denominacion}
            </h2>
            <img
              src={"http://localhost:8080/images/" + promocion.imagen}
              alt={"sin imagen"}
              style={{
                width: "100%", // Esto asegura que la imagen no sea más ancha que la tarjeta
                height: "200px", // Esto establece una altura fija para la imagen
                objectFit: "cover", // Esto asegura que la imagen cubra el espacio disponible sin distorsionarse
              }}
            />
            <p>{promocion.descripcionDescuento}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.8em",
                color: "gray",
              }}
            >
              <p>Desde: {promocion.horaDesde}</p>
              <p>Hasta: {promocion.horaHasta}</p>
            </div>
            <p style={{ fontSize: "1.5em", fontWeight: "bold" }}>
              Precio: ${promocion.precioPromocional}
            </p>
            <div style={{ marginTop: "auto", padding: "10px 0" }}>
              <Button
                onClick={() => handleShowDetail(promocion.id)}
                style={{ marginRight: "10px" }}
              >
                Detalle
              </Button>
              <Button
                onClick={() => handleEditPromotion(promocion.id)}
                style={{ marginRight: "10px" }}
              >
                Modificar
              </Button>
              <Switch
                defaultChecked={!promocion.eliminado}
                onChange={(checked) =>
                  handleTogglePromotion(promocion.id, checked)
                }
              />
            </div>
          </Card>
        ))}
      </div>
      <Modal
        title="Detalles de la promoción"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Table dataSource={promocionDetail} columns={columns} />
      </Modal>
      <FormularioPromocion
        visible={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        onSubmit={handleSubmitPromocion} // Aquí pasamos la función handleSubmitPromocion
        initialValues={undefined}
        tiposPromocion={[]}
        selectedSucursalId={selectedSucursalId}
      />
      {selectedPromocionId !== null && (
        <FormularioActualizacionPromocion
          visible={isUpdateFormVisible}
          onCancel={() => setIsUpdateFormVisible(false)}
          promocionId={selectedPromocionId}
          onSubmit={handleUpdatePromotion}
          selectedSucursalId={selectedSucursalId}
          tiposPromocion={[]}
        />
      )}
    </div>
  );
};

export default Promociones;
