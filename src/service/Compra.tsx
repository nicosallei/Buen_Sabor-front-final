import PreferenceMP from "../types/mercadoPago/PreferenceMp";
import { Pedido } from "../types/compras/interface";

export const getCategorias = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/categorias/traer-todo/"
    );
    if (!response.ok) {
      throw new Error("Error al obtener las categorías");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getProductosPorCategoria = async (categoriaId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/compra/productos/${categoriaId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los productos por categoría");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getProducto = async (id: number) => {
  const response = await fetch("/buscar-articulo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener el producto");
  }

  const data = await response.json();
  return data;
};

export const realizarPedido = async (pedido: Pedido) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/compra/productos/crear-pedido",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      }
    );

    if (!response.ok) {
      // Si el servidor envía un mensaje de error en el cuerpo de la respuesta
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el pedido");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al crear el pedido:", error.message);
    throw error; // Re-lanzar el error para manejarlo en otra parte de tu aplicación
  }
};

export const obtenerSubCategorias = async (id: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/categorias/subcategorias/${id}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener las subcategorías");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const obtenerCategoriasPadre = async (sucursalId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/categorias/categoriasPadre/${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener las categorías padre");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const tieneSubCategorias = async (id: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/categorias/${id}/tieneSubCategorias`
    );
    if (!response.ok) {
      throw new Error("Error al verificar si la categoría tiene subcategorías");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export async function createPreferenceMP(pedido?: Pedido) {
  let urlServer = "http://localhost:8080/api/MercadoPago/crear_preference_mp";
  let method: string = "POST";
  const response = await fetch(urlServer, {
    method: method,
    body: JSON.stringify(pedido),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await response.json()) as PreferenceMP;
}

export async function setPreferenceMPId(
  pedidoId: number,
  preferenceMPId: string
) {
  let urlServer = `http://localhost:8080/api/compra/productos/${pedidoId}/setPreferenceMPId`;
  let method: string = "POST";
  const response = await fetch(urlServer, {
    method: method,
    body: JSON.stringify(preferenceMPId),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await response.json()) as Pedido;
}
