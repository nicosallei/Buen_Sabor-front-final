export interface Promocion {
  id: number;
  denominacion?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  horaDesde?: string;
  horaHasta?: string;
  descripcionDescuento?: string;
  precioPromocional?: number;
  tipoPromocion?: string;
  promocionDetalles?: PromocionDetalle[];
  imagen?: string;
  sucursales?: Sucursal[];
  eliminado?: boolean;
}
export interface ImagenPromocion {
  id?: number;
  url?: string;
  eliminado?: boolean;
}
export interface Sucursal {
  id?: number;
  nombre?: string;
  eliminado?: boolean;
}
export interface PromocionDetalle {
  id?: number;
  cantidad?: number;
  articuloManufacturado?: ArticuloManufacturado;
  eliminado?: boolean;
}
export interface ArticuloManufacturado {
  id?: number;
  denominacion?: string;
  descripcion?: string;
  precioVenta?: number;
  imagenes?: string[];
  codigo?: string;
  eliminado?: boolean;
  // Añade aquí cualquier otra propiedad que tenga un artículo
}

export const promocionesPorSucursal = async (sucursalId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/local/promocion/sucursal/${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const PromocionDetalle = async (promocionId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/local/promocion/detalle/${promocionId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los detalles de la promoción");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchArticulosManufacturados = async (sucursalId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/local/articulo/manufacturado/sucursal/${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los artículos manufacturados");
    }
    const articulosManufacturados = await response.json();
    return articulosManufacturados;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const savePromocion = async (promocion: Promocion, token: string) => {
  try {
    const response = await fetch("http://localhost:8080/api/promociones/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(promocion),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const togglePromocion = async (id: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/promociones/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
export const eliminacionLogica = async (id: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/promociones/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Verificar si la operación fue exitosa basado en el código de estado HTTP 204
    if (response.status === 204) {
      return true; // La operación de eliminación fue exitosa
    } else {
      // Si el código de estado no es 204, manejar como error o devolver false
      console.error("Respuesta inesperada del servidor:", response.status);
      return false; // O manejar de otra manera según tu lógica de negocio
    }
  } catch (error) {
    console.error("Error:", error);
    return false; // Indicar que la operación no fue exitosa
  }
};

export const fetchPromocionById = async (promocionId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/promociones/base64/${promocionId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los detalles de la promoción");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const actualizarPromocion = async (
  id: number,
  promocion: Promocion,
  token: string
) => {
  const response = await fetch(`http://localhost:8080/api/promociones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(promocion),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const eliminarDetallesPromocion = async (id: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/promociones/eliminar-detalles/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Detalles de la promoción eliminados con éxito");
  } catch (error) {
    console.error("Error al eliminar los detalles de la promoción:", error);
  }
};
