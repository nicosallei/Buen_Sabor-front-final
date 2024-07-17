import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { Chart } from "react-google-charts";
import {
  fetchInsumosConStock,
  fetchArticulosManufacturadosVendidos,
} from "../../../service/EstadisticaService"; // Adjust the path as needed
import { getEmpresas, Empresas } from "../../../service/ServiceEmpresa";
import { getSucursal, Sucursal } from "../../../service/ServiceSucursal";
const { Option } = Select;

interface Insumo {
  denominacion: string;
  stockActual: number;
}

interface Producto {
  denominacion: string;
  cantidadVendida: number;
}

const Graficos: React.FC = () => {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [vendidos, setVendidos] = useState<Producto[]>([]);
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(
    null
  );
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
    }
  }, []);

  useEffect(() => {
    if (selectedSucursalId) {
      const fetchData = async () => {
        const insumosData = await fetchInsumosConStock(selectedSucursalId);
        const vendidosData = await fetchArticulosManufacturadosVendidos(
          selectedSucursalId
        );
        setInsumos(insumosData);
        setVendidos(vendidosData);
      };

      fetchData();
    }
  }, [selectedSucursalId]);

  const handleSucursalChange = (value: string) => {
    setSelectedSucursalId(Number(value));
  };

  const insumosData = [
    ["Insumo", "Stock Actual"],
    ...insumos.map(({ denominacion, stockActual }) => [
      denominacion,
      stockActual,
    ]),
  ];

  const vendidosData = [
    ["Producto", "Cantidad Vendida"],
    ...vendidos.map(({ denominacion, cantidadVendida }) => [
      denominacion,
      cantidadVendida,
    ]),
  ];

  console.log("Insumos Data:", insumosData);
  console.log("Vendidos Data:", vendidosData);

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
        <h1>Estadísticas de Ingresos</h1>
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
            onChange={(value) => setSelectedEmpresa(value ? value : null)}
            value={selectedEmpresa ? selectedEmpresa.toString() : undefined}
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
            value={
              selectedSucursalId ? selectedSucursalId.toString() : undefined
            }
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {selectedSucursalId && (
        <>
          <h2>Insumos con Stock</h2>
          <Chart
            chartType="BarChart"
            data={insumosData}
            width="100%"
            height="400px"
            options={{
              title: "Stock de Insumos",
              chartArea: { width: "50%" },
              hAxis: {
                title: "Cantidad",
                minValue: 0,
              },
              vAxis: {
                title: "Insumo",
              },
            }}
          />

          <h2>Artículos Manufacturados Vendidos</h2>
          <Chart
            chartType="PieChart"
            data={vendidosData}
            width="100%"
            height="400px"
            options={{ title: "Productos Vendidos" }}
          />
        </>
      )}
    </div>
  );
};

export default Graficos;
