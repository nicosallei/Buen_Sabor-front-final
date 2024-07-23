import React, { useEffect, useState } from "react";
import { DatePicker, Select, Button } from "antd";
import { Chart } from "react-google-charts";
import * as XLSX from "xlsx";
import {
  fetchInsumosConStock,
  fetchArticulosManufacturadosVendidos,
  fetchArticulosManufacturados,
  fetchPedidosPorClienteYRango,
  ClientePedidosDto,
} from "../../../service/EstadisticaService";
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
  const [topVendidos, setTopVendidos] = useState<Producto[]>([]);
  const [pedidosPorCliente, setPedidosPorCliente] = useState<
    ClientePedidosDto[]
  >([]);
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(
    null
  );
  const [isDisabled, setIsDisabled] = useState(false);
  const [fechaInicio, setFechaInicio] = useState<string | null>(null);
  const [fechaFin, setFechaFin] = useState<string | null>(null);

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
    const fetchData = async () => {
      if (selectedSucursalId) {
        const insumosData = await fetchInsumosConStock(selectedSucursalId);
        const vendidosData = await fetchArticulosManufacturadosVendidos(
          selectedSucursalId
        );
        setInsumos(insumosData);
        setVendidos(vendidosData);
      }
    };

    fetchData();
  }, [selectedSucursalId]);

  useEffect(() => {
    if (selectedSucursalId && fechaInicio && fechaFin) {
      const fetchData = async () => {
        const insumosData = await fetchInsumosConStock(selectedSucursalId);
        const vendidosData = await fetchArticulosManufacturadosVendidos(
          selectedSucursalId
        );
        const topVendidosData = await fetchArticulosManufacturados(
          fechaInicio,
          fechaFin,
          selectedSucursalId
        );
        const pedidosData = await fetchPedidosPorClienteYRango(
          fechaInicio,
          fechaFin,
          selectedSucursalId
        );
        setInsumos(insumosData);
        setVendidos(vendidosData);
        setTopVendidos(topVendidosData.slice(0, 5)); // Mostrar solo los 5 productos más vendidos
        setPedidosPorCliente(pedidosData);
      };

      fetchData();
    }
  }, [selectedSucursalId, fechaInicio, fechaFin]);

  // const handleSucursalChange = (value: string) => {
  //   setSelectedSucursalId(Number(value));
  // };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Insumos
    const insumosSheet = XLSX.utils.json_to_sheet(
      insumos.map(({ denominacion, stockActual }) => ({
        Insumo: denominacion,
        "Stock Actual": stockActual,
      }))
    );
    XLSX.utils.book_append_sheet(wb, insumosSheet, "Insumos");

    // Vendidos
    const vendidosSheet = XLSX.utils.json_to_sheet(
      vendidos.map(({ denominacion, cantidadVendida }) => ({
        Producto: denominacion,
        "Cantidad Vendida": cantidadVendida,
      }))
    );
    XLSX.utils.book_append_sheet(wb, vendidosSheet, "Artículos Vendidos");

    // Top Vendidos
    const topVendidosSheet = XLSX.utils.json_to_sheet(
      topVendidos.map(({ denominacion, cantidadVendida }) => ({
        Producto: denominacion,
        "Cantidad Vendida": cantidadVendida,
      }))
    );
    XLSX.utils.book_append_sheet(wb, topVendidosSheet, "Top 5 Productos");

    // Pedidos por Cliente
    const pedidosSheet = XLSX.utils.json_to_sheet(
      pedidosPorCliente.map(({ nombre, apellido, cantidadPedidos }) => ({
        Cliente: `${nombre} ${apellido}`,
        "Cantidad de Pedidos": cantidadPedidos,
      }))
    );
    XLSX.utils.book_append_sheet(wb, pedidosSheet, "Pedidos por Cliente");

    XLSX.writeFile(wb, "estadisticas.xlsx");
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

  const topVendidosData = [
    ["Producto", "Cantidad Vendida"],
    ...topVendidos.map(({ denominacion, cantidadVendida }) => [
      denominacion,
      cantidadVendida,
    ]),
  ];

  const pedidosPorClienteData = [
    ["Cliente", "Cantidad de Pedidos"],
    ...pedidosPorCliente.map(({ nombre, apellido, cantidadPedidos }) => [
      `${nombre} ${apellido}`,
      cantidadPedidos,
    ]),
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
        <h1>Estadísticas de Productos y pedidos</h1>
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
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Button onClick={exportToExcel} type="primary">
          Descargar Excel
        </Button>
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

          <div style={{ margin: "10px 0" }}>
            <DatePicker
              placeholder="Fecha de inicio"
              onChange={(_date, dateString) =>
                setFechaInicio(dateString as string)
              }
            />
            <DatePicker
              placeholder="Fecha de fin"
              style={{ marginLeft: 20 }}
              onChange={(_date, dateString) =>
                setFechaFin(dateString as string)
              }
            />
          </div>

          <h2>Top 5 Productos Más Vendidos</h2>
          <Chart
            chartType="BarChart"
            data={topVendidosData}
            width="100%"
            height="400px"
            options={{
              title: "Top 5 Productos Más Vendidos",
              chartArea: { width: "50%" },
              hAxis: {
                title: "Cantidad Vendida",
                minValue: 0,
              },
              vAxis: {
                title: "Producto",
              },
              bars: "horizontal",
              legend: { position: "none" },
            }}
          />

          <h2>Pedidos por Cliente</h2>
          <Chart
            chartType="BarChart"
            data={pedidosPorClienteData}
            width="100%"
            height="400px"
            options={{
              title: "Cantidad de Pedidos por Cliente",
              chartArea: { width: "50%" },
              hAxis: {
                title: "Cantidad de Pedidos",
                minValue: 0,
              },
              vAxis: {
                title: "Cliente",
              },
              bars: "horizontal",
              legend: { position: "none" },
            }}
          />
        </>
      )}
    </div>
  );
};

export default Graficos;
