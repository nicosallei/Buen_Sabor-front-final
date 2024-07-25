const Url = "http://localhost:8080/api/estadisticas";

// types.ts
export interface ArticuloManufacturadoVendidoDto {
  denominacion: string;
  cantidadVendida: number;
}

export interface ClientePedidosDto {
  clienteId: number;
  nombre: string;
  cantidadPedidos: number;
  totalPedidos: number;
  apellido?: string;
}
type GananciasPorRangoDeMesesParams = {
  startMonth: string; // Formato "yyyy-MM"
  endMonth: string; // Formato "yyyy-MM"
  sucursalId: number;
};

type GananciasResponse = Map<string, number>;

export const fetchIngresosPorRangoDeDias = async (
  startDate: string,
  endDate: string,
  sucursalId: number
): Promise<{ [key: string]: number }> => {
  try {
    const response = await fetch(
      Url +
        `/ingresos/dias?startDate=${startDate}&endDate=${endDate}&sucursalId=${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los ingresos por rango de días");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {}; // Retorna un objeto vacío en caso de error
  }
};

export const fetchIngresosPorRangoDeMeses = async (
  startMonth: string,
  endMonth: string,
  sucursalId: number
): Promise<{ [key: string]: number }> => {
  try {
    const response = await fetch(
      `${Url}/ingresos/meses?startMonth=${startMonth}&endMonth=${endMonth}&sucursalId=${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los ingresos por rango de meses");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {}; // Retorna un objeto vacío en caso de error
  }
};

export const fetchInsumosConStock = async (
  sucursalId: number
): Promise<any[]> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/estadisticas/insumosConStock/${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los insumos con stock");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // Retorna un objeto vacío en caso de error
  }
};

export const fetchArticulosManufacturadosVendidos = async (
  sucursalId: number
): Promise<any[]> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/estadisticas/articulosManufacturadosVendidos/${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los artículos manufacturados vendidos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // Retorna un arreglo vacío en caso de error
  }
};
export const fetchArticulosManufacturados = async (
  fechaInicio: string,
  fechaFin: string,
  sucursalId: number
): Promise<ArticuloManufacturadoVendidoDto[]> => {
  const response = await fetch(
    `${Url}/articulos-manufacturados/vendidos-por-sucursal?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&sucursalId=${sucursalId}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }

  const data: ArticuloManufacturadoVendidoDto[] = await response.json();
  return data;
};

export const fetchPedidosPorClienteYRango = async (
  fechaInicio: string,
  fechaFin: string,
  sucursalId: number
): Promise<ClientePedidosDto[]> => {
  try {
    const response = await fetch(
      `${Url}/pedidos-por-cliente-y-rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&sucursalId=${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: ClientePedidosDto[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pedidos por cliente y rango:", error);
    throw error;
  }
};

export const fetchGananciasPorRangoDeMeses = async ({
  startMonth,
  endMonth,
  sucursalId,
}: GananciasPorRangoDeMesesParams): Promise<GananciasResponse> => {
  const url = `${Url}/ganancias-por-rango-de-meses?startMonth=${encodeURIComponent(
    startMonth
  )}&endMonth=${encodeURIComponent(endMonth)}&sucursalId=${sucursalId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: GananciasResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ganancias por rango de meses:", error);
    throw error;
  }
};
