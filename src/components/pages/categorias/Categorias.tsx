import { useState, useEffect } from "react";
import { Select, Row, Button } from "antd";

import TablaCategoria from "../../element/table/TablaCategoria";
import NuevaCategoria from "../../element/botones/BotonAgregarCategoria";
import { getEmpresas } from "../../../service/ServiceEmpresa";
import { Empresas } from "../../../service/ServiceEmpresa";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export default function Categorias() {
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await getEmpresas();
      setEmpresas(empresasData);
    };

    fetchEmpresas();
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const navigate = useNavigate();

  const irACategoriasPorSucursal = (_selectedEmpresa: any) => {
    navigate(`/categorias/porSucursal`);
  };

  return (
    <div>
      <Row
        style={{
          display: "flex",
          backgroundColor: "#a5a5a5",
          borderRadius: "8px",
          padding: "20px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <h1>Categorias</h1>
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
          >
            {empresas.map((empresa) => (
              <Option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </Option>
            ))}
          </Select>
        </div>
        <NuevaCategoria
          selectedEmpresaId={String(selectedEmpresa)}
          onCategoryCreated={handleRefresh}
        />
        <Button onClick={() => irACategoriasPorSucursal(selectedEmpresa)}>
          Categorías Por Sucursal
        </Button>
      </Row>
      <br />
      {selectedEmpresa ? (
        <TablaCategoria
          key={refreshKey}
          selectedEmpresa={String(selectedEmpresa)}
        />
      ) : (
        <p>Por favor, seleccione una empresa para ver las categorías.</p>
      )}
    </div>
  );
}
