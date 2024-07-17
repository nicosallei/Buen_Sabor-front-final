import { useState, useEffect } from "react";
import { Select, Button, Table, Form } from "antd";
import { Empresas, getEmpresas } from "../../../service/ServiceEmpresa";
import { getSucursal, Sucursal } from "../../../service/ServiceSucursal";
import {
  fetchIngresosPorRangoDeDias,
  fetchIngresosPorRangoDeMeses,
} from "../../../service/EstadisticaService";
import { Chart } from "react-google-charts";

const { Option } = Select;

type IngresoMes = {
  fecha: string; // "YYYY-MM" format
  ingreso: number;
};
type IngresoDia = {
  fecha: string;
  ingreso: number;
};

const generateYears = (startYear: number, endYear: number): number[] => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

const Estadistica = () => {
  const [startDateDias, setStartDateDias] = useState("");
  const [endDateDias, setEndDateDias] = useState("");
  const [selectedStartYear, setSelectedStartYear] = useState<number | null>(
    null
  );
  const [selectedStartMonth, setSelectedStartMonth] = useState<string | null>(
    null
  );
  const [selectedEndYear, setSelectedEndYear] = useState<number | null>(null);
  const [selectedEndMonth, setSelectedEndMonth] = useState<string | null>(null);
  const [ingresosDias, setIngresosDias] = useState<IngresoDia[]>([]);
  const [ingresosMeses, setIngresosMeses] = useState<IngresoMes[]>([]);
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(
    null
  );
  const [isDisabled, setIsDisabled] = useState(false);

  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const years = generateYears(2000, new Date().getFullYear());

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

  const handleSucursalChange = async (value: string) => {
    setSelectedSucursalId(Number(value));
  };

  const handleFetchDias = async () => {
    if (selectedSucursalId) {
      const data = await fetchIngresosPorRangoDeDias(
        startDateDias,
        endDateDias,
        selectedSucursalId
      );
      setIngresosDias(
        Object.entries(data).map(([fecha, ingreso]) => ({ fecha, ingreso }))
      );
    }
  };

  const handleFetchMeses = async () => {
    if (
      selectedSucursalId &&
      selectedStartYear &&
      selectedStartMonth &&
      selectedEndYear &&
      selectedEndMonth
    ) {
      const startDateMes = `${selectedStartYear}-${selectedStartMonth}`;
      const endDateMes = `${selectedEndYear}-${selectedEndMonth}`;
      const data = await fetchIngresosPorRangoDeMeses(
        startDateMes,
        endDateMes,
        selectedSucursalId
      );
      setIngresosMeses(
        Object.entries(data).map(([fecha, ingreso]) => ({ fecha, ingreso }))
      );
    }
  };

  const columnsDias = [
    { title: "Fecha", dataIndex: "fecha", key: "fecha" },
    { title: "Ingreso", dataIndex: "ingreso", key: "ingreso" },
  ];

  const columnsMeses = [
    { title: "Mes", dataIndex: "fecha", key: "fecha" },
    { title: "Ingreso", dataIndex: "ingreso", key: "ingreso" },
  ];

  const isMesesFormValid =
    selectedStartYear &&
    selectedStartMonth &&
    selectedEndYear &&
    selectedEndMonth;

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
            onChange={(value) =>
              setSelectedEmpresa(value ? value.toString() : null)
            }
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

      <div>
        <h2>Ingresos por Día</h2>
        <Form layout="inline" onFinish={handleFetchDias}>
          <Form.Item label="Fecha de Inicio">
            <input
              type="date"
              value={startDateDias}
              onChange={(e) => setStartDateDias(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Fecha de Fin">
            <input
              type="date"
              value={endDateDias}
              onChange={(e) => setEndDateDias(e.target.value)}
              min={startDateDias}
              required
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Obtener Ingresos
            </Button>
          </Form.Item>
        </Form>
        <Table dataSource={ingresosDias} columns={columnsDias} rowKey="fecha" />
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Fecha", "Ingreso"],
            ...ingresosDias.map((ingreso) => [ingreso.fecha, ingreso.ingreso]),
          ]}
          options={{
            hAxis: {
              title: "Fecha",
            },
            vAxis: {
              title: "Ingreso",
            },
            legend: { position: "none" },
          }}
        />
      </div>

      <div>
        <h2>Ingresos por Mes</h2>
        <Form layout="inline" onFinish={handleFetchMeses}>
          <Form.Item label="Año de Inicio">
            <Select
              value={selectedStartYear}
              onChange={setSelectedStartYear}
              style={{ width: 120 }}
            >
              {years.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Mes de Inicio">
            <Select
              value={selectedStartMonth}
              onChange={setSelectedStartMonth}
              style={{ width: 120 }}
            >
              {months.map((month) => (
                <Option key={month} value={month}>
                  {month}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Año de Fin">
            <Select
              value={selectedEndYear}
              onChange={setSelectedEndYear}
              style={{ width: 120 }}
              disabled={!selectedStartYear}
            >
              {years.map((year) => (
                <Option
                  key={year}
                  value={year}
                  disabled={year < selectedStartYear!}
                >
                  {year}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Mes de Fin">
            <Select
              value={selectedEndMonth}
              onChange={setSelectedEndMonth}
              style={{ width: 120 }}
              disabled={!selectedStartMonth}
            >
              {months.map((month) => (
                <Option
                  key={month}
                  value={month}
                  disabled={
                    selectedEndYear === selectedStartYear &&
                    month < selectedStartMonth!
                  }
                >
                  {month}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isMesesFormValid}
            >
              Obtener Ingresos
            </Button>
          </Form.Item>
        </Form>
        <Table
          dataSource={ingresosMeses}
          columns={columnsMeses}
          rowKey="fecha"
        />
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Mes", "Ingreso"],
            ...ingresosMeses.map((ingreso) => [ingreso.fecha, ingreso.ingreso]),
          ]}
          options={{
            hAxis: {
              title: "Mes",
            },
            vAxis: {
              title: "Ingreso",
            },
            legend: { position: "none" },
          }}
        />
      </div>
    </div>
  );
};

export default Estadistica;
