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
import FormularioActualizacionPromocion from "./FormularioActualizacion";
import {
  //savePromocion,
  eliminacionLogica,
} from "../../../service/PromocionService";
import sinImagen from "../../../assets/sin-imagen.jpg";

const { Option } = Select;

const Promociones = () => {
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<number>(0);
  const [promociones, setPromociones] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [promocionDetail, setPromocionDetail] = useState<
    ArticuloManufacturado[]
  >([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number>(0);
  const [selectedPromocionId, setSelectedPromocionId] = useState<number | null>(
    null
  );
  const [isDisabled, setIsDisabled] = useState(false);

  const fetchEmpresas = async () => {
    const empresasData = await getEmpresas();
    setEmpresas(empresasData);
  };
  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchSucursales = async () => {
    if (selectedEmpresa) {
      const sucursalesData = await getSucursal(String(selectedEmpresa));
      setSucursales(sucursalesData);
    }
  };
  useEffect(() => {
    fetchSucursales();
  }, [selectedEmpresa]);

  useEffect(() => {
    const empresaId = Number(localStorage.getItem("empresa_id"));
    const sucursalId = Number(localStorage.getItem("sucursal_id"));
    if (empresaId && sucursalId) {
      setSelectedEmpresa(Number(empresaId));
      setSelectedSucursalId(Number(sucursalId));
      setIsDisabled(true);
      handleSucursalChange(sucursalId);
    }
  }, []);
  useEffect(() => {
    if (selectedSucursalId !== null || selectedSucursalId !== 0) {
      handleSucursalChange(selectedSucursalId);
    }
  }, [selectedSucursalId]);

  const handleSucursalChange = async (value: number) => {
    if (value !== null) {
      const promocionesData = await promocionesPorSucursal(value);
      setPromociones(promocionesData);
    }
  };

  const handleShowDetail = async (promocionId: number) => {
    const detalle = await PromocionDetalle(promocionId);

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
      setIsFormVisible(false);
      await handleSucursalChange(selectedSucursalId);
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
    }
  };

  const handleTogglePromotion = async (
    promocionId: number,
    checked: boolean
  ) => {
    try {
      const response = await eliminacionLogica(promocionId);
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
    setSelectedPromocionId(promocionId);
    setIsUpdateFormVisible(true);
  };

  const handleUpdatePromotion = async () => {
    try {
      setIsUpdateFormVisible(false);
      handleSucursalChange(selectedSucursalId);
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
            value={selectedEmpresa || undefined}
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
            onChange={(value) => setSelectedSucursalId(Number(value))}
            value={selectedSucursalId || undefined}
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
              width: 350,
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
                width: "100%",
                height: "200px",
                objectFit: "cover",
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
        onSubmit={handleSubmitPromocion}
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
