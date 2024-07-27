import { useState, useEffect } from "react";
import { Button, Select } from "antd";
import FormularioInsumo from "../../element/formularios/FormularioInsumo";
import TablaInsumo from "../../element/tabla/TablaInsumo";
import { getSucursal } from "../../../service/ServiceSucursal";
import { getEmpresas } from "../../../service/ServiceEmpresa";
import { Sucursal } from "../../../service/ServiceSucursal";
import { Empresas } from "../../../service/ServiceEmpresa";

const { Option } = Select;

const Insumos = () => {
  const [showFormularioInsumo, setShowFormularioInsumo] = useState(false);
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<number>(0);
  const [selectedSucursal, setSelectedSucursal] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateTabla, setUpdateTabla] = useState(false);
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
      setIsDisabled(true);
    }
  }, []);

  const handleOpenFormularioInsumo = () => {
    setShowFormularioInsumo(true);
  };

  const closeFormularioInsumo = () => {
    setShowFormularioInsumo(false);
    setUpdateTabla(true);
  };
  const handleFormSubmit = () => {
    setReloadTable(!reloadTable);
  };

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
        <h1>Insumos</h1>
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
            onChange={(value) => setSelectedSucursal(value)}
            value={selectedSucursal}
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </Option>
            ))}
          </Select>
        </div>
        {selectedEmpresa && selectedSucursal && (
          <Button
            type="primary"
            onClick={handleOpenFormularioInsumo}
            id={`empresa-${selectedEmpresa}-sucursal-${selectedSucursal}`}
          >
            Agregar Insumo
          </Button>
        )}
      </div>
      {showFormularioInsumo && (
        <FormularioInsumo
          onClose={closeFormularioInsumo}
          empresaId={String(selectedEmpresa)}
          sucursalId={String(selectedSucursal)}
          onSubmit={handleFormSubmit}
        />
      )}
      <div>
        {selectedSucursal ? (
          <TablaInsumo
            empresaId={String(selectedEmpresa)}
            sucursalId={String(selectedSucursal)}
            updateTabla={updateTabla}
            reload={reloadTable}
          />
        ) : (
          <p>Por favor, seleccione la sucursal para ver los insumos.</p>
        )}
      </div>
    </div>
  );
};

export default Insumos;
