const Url = "http://localhost:8080/api/estadisticas";

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
