import { useEffect, useState } from "react";
import TablaProductos from "../../element/tabla/TablaProductos";
import { Empresas, getEmpresas } from "../../../service/ServiceEmpresa";
import { Sucursal, getSucursal } from "../../../service/ServiceSucursal";
import { Button, Select } from "antd";
import FormularioProducto from "../../element/formularios/FormularioProducto";

const { Option } = Select;

export default function Productos() {
  const [showFormularioProducto, setShowFormularioProducto] = useState(false);
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<number>(0);
  const [selectedSucursal, setSelectedSucursal] = useState<number>(0);
  const [disableSelection, setDisableSelection] = useState(false);
  const [reloadProductos, setReloadProductos] = useState(false);
  const [reloadTable, setReloadTable] = useState(false);

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
        const sucursalesData = await getSucursal(String(selectedEmpresa));
        setSucursales(sucursalesData);
      }
    };

    fetchSucursales();
  }, [selectedEmpresa]);

  useEffect(() => {
    const empresaId = localStorage.getItem("empresa_id");
    const sucursalId = localStorage.getItem("sucursal_id");
    if (empresaId && sucursalId) {
      setSelectedEmpresa(Number(empresaId));
      setSelectedSucursal(Number(sucursalId));
      setDisableSelection(true);
    }
  }, []);

  const handleOpenFormularioProducto = () => {
    setShowFormularioProducto(true);
  };

  const closeFormularioProducto = () => {
    setReloadTable(!reloadTable);
    setShowFormularioProducto(false);
  };

  const handleFormSubmit = async (values: any) => {
    console.log(values);
    setReloadProductos(true);
    closeFormularioProducto();
  };

  useEffect(() => {
    if (reloadProductos) {
      setReloadProductos(false);
    }
  }, [reloadProductos]);

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
        <h1>Productos</h1>
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
            value={selectedEmpresa}
            onChange={(value) => setSelectedEmpresa(value)}
            disabled={disableSelection}
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
            value={selectedSucursal}
            disabled={!selectedEmpresa || disableSelection}
            onChange={(value) => setSelectedSucursal(value)}
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </Option>
            ))}
          </Select>
        </div>

        {selectedEmpresa && selectedSucursal && (
          <Button type="primary" onClick={handleOpenFormularioProducto}>
            Agregar Producto
          </Button>
        )}
      </div>

      <FormularioProducto
        visible={showFormularioProducto}
        onClose={closeFormularioProducto}
        onSubmit={handleFormSubmit}
        initialValues={null}
        sucursalId={String(selectedSucursal)}
      />

      <div>
        {selectedSucursal ? (
          <TablaProductos
            key={reloadProductos ? "reload" : "normal"}
            empresaId={String(selectedEmpresa)}
            sucursalId={String(selectedSucursal)}
            reload={reloadTable}
            onReload={() => setReloadProductos(true)}
          />
        ) : (
          <p>Por favor, seleccione la sucursal para ver los productos.</p>
        )}
      </div>
    </div>
  );
}
