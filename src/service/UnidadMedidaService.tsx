// Para cargar una nueva unidad de medida
export interface UnidadMedida {
  id: number;
  denominacion: string;
  eliminado: boolean; // Asumiendo que tienes un campo 'eliminado' en tus datos
}

export const cargarUnidadMedida = async (
  unidadMedida: UnidadMedida,
  token: string
) => {
  const response = await fetch("http://localhost:8080/api/unidad-medida/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(unidadMedida),
  });

  if (!response.ok) {
    throw new Error("Error al cargar la unidad de medida");
  }

  return response.json();
};

// Para actualizar una unidad de medida
export const actualizarUnidadMedida = async (
  id: number,
  unidadMedida: UnidadMedida,
  token: string
) => {
  const response = await fetch(
    `http://localhost:8080/api/unidad-medida/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(unidadMedida),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return response.json();
};

// Para cambiar el estado de una unidad de medida
// En tu servicio de unidad de medida

export const toggleActiveUnidadMedida = async (id: number, token: string) => {
  const url = `http://localhost:8080/api/unidad-medida/toggle-active/${id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Añade el token de autenticación
    },
  });

  if (!response.ok) {
    throw new Error("Error al cambiar el estado de la unidad de medida");
  }

  return response.json();
};

// Para obtener todas las unidades de medida
export const traerTodoUnidadMedida = async () => {
  const response = await fetch(
    "http://localhost:8080/api/unidad-medida/traerTodo/"
  );

  if (!response.ok) {
    throw new Error("Error al obtener las unidades de medida");
  }

  return response.json();
};
