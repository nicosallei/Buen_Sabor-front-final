export interface ArticuloInsumo {
  id: number;
  denominacion: string;
  codigo: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMaximo: number;
  stockMinimo: number;
  esParaElaborar: boolean;
  imagenes: Imagen[];
  unidadMedida: unidadMedida;
  sucursal: sucursal;
  eliminado: boolean;
}

export interface Imagen {
  id: number;
  url: string;
}
export interface unidadMedida {
  id: number;
  denominacion: string;
}
export interface sucursal {
  id: number;
  nombre: string;
  empresa: Empresa;
}
export interface Empresa {
  id: number;
  nombre: string;
  cuit: string;
}

export const getUnidadMedida = async (): Promise<unidadMedida[]> => {
  const endpoint = "http://localhost:8080/api/unidad-medida/";
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });
  console.log(response);
  return await response.json();
};

export const getArticulosInsumos = async (): Promise<ArticuloInsumo[]> => {
  const endpoint = "http://localhost:8080/api/articulos/insumos/";
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });
  console.log(response);
  return await response.json();
};

export async function crearInsumo(formData: ArticuloInsumo, token: string) {
  console.log("estoy en el crearInsumo");

  try {
    console.log("estoy en el fetch");

    console.log(formData);

    const urlServer = "http://localhost:8080/api/articulos/insumos/";
    const response = await fetch(urlServer, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
      body: JSON.stringify({
        codigo: "I-" + formData.codigo,
        denominacion: formData.denominacion,
        precioCompra: formData.precioCompra,
        precioVenta: formData.precioVenta,
        stockActual: formData.stockActual,
        stockMaximo: formData.stockMaximo,
        stockMinimo: formData.stockMinimo,
        esParaElaborar: formData.esParaElaborar,
        imagenes: formData.imagenes,
        unidadMedida: formData.unidadMedida,
        sucursal: formData.sucursal,
      }),
    });

    if (!response.ok) {
      // Si el servidor envía un mensaje de error en el cuerpo de la respuesta
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el insumo");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error al crear el insumo:", error.message);
    throw error; // Re-lanzar el error para manejarlo en otra parte de tu aplicación
  }
}

export async function modificarInsumoId(
  formData: any,
  id: number,
  token: string
) {
  try {
    console.log("estoy en el fetc");
    console.log("data" + formData);
    console.log("id:" + id);

    const urlServer = `http://localhost:8080/api/articulos/insumos/${id}`;
    const response = await fetch(urlServer, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
      body: JSON.stringify({
        id: id,
        codigo: formData.codigo,
        denominacion: formData.denominacion,

        stockMaximo: formData.stockMaximo,
        stockMinimo: formData.stockMinimo,
        esParaElaborar: formData.esParaElaborar,
        imagenes: formData.imagenes,
        unidadMedida: formData.unidadMedida,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al modificar el insumo");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error al modificar el insumo:", error.message);
    throw error; // Re-lanzar el error para manejarlo en otra parte de tu aplicación
  }
}

export async function getInsumoXId(id: string) {
  const urlServer = "http://localhost:8080/api/articulos/insumos/" + id;
  console.log(urlServer);
  const response = await fetch(urlServer, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });

  return await response.json();
}

export async function deleteInsumoXId(id: string, token: string) {
  const urlServer = "http://localhost:8080/api/articulos/insumos/" + id;
  await fetch(urlServer, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });
}
export async function activarInsumoXId(id: string, token: string) {
  const urlServer =
    "http://localhost:8080/api/articulos/insumos/reactivate/" + id;
  await fetch(urlServer, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });
}

export async function getInsumoXSucursal(id: string) {
  const urlServer =
    "http://localhost:8080/api/local/articulo/insumo/sucursal/" + id;
  console.log(urlServer);
  const response = await fetch(urlServer, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });

  return await response.json();
}

export async function agregarStockId(formData: any, id: number, token: string) {
  try {
    const urlServer = `http://localhost:8080/api/local/articulo/insumo/aumentarStock/${id}?cantidad=${formData.cantidad}&nuevoPrecioVenta=${formData.nuevoPrecioVenta}&nuevoPrecioCompra=${formData.nuevoPrecioCompra}`;

    const response = await fetch(urlServer, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*", // Puedes ajustar esto según la configuración de tu servidor
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
