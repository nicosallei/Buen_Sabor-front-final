export interface Sucursal {
  id?: number;
  eliminado?: boolean;
  nombre: string;
  horaApertura: string;
  horaCierre: string;
  calle: string;
  cp: string;
  numero: string;
  localidad?: string;
  provincia: string;
  pais: string;
  imagen?: string; // Añadido opcional
  idEmpresa: string;
  empresa?: Empresa;
  file?: File;
  domicilio?: Domicilio; // Añadido para manejar el archivo
}

export interface Empresa {
  id?: number;
  eliminado?: boolean;
  nombre?: string;
  razonSocial?: string;
  cuil?: number;
}
export interface Domicilio {
  id?: number;
  eliminado?: boolean;
  calle?: string;
  numero?: string;
  cp?: number;
}
export const getSucursalId = async (id: number): Promise<Sucursal[]> => {
  const endpoint = `http://localhost:8080/api/sucursal/lista-todo-sucursal/${id}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });
  console.log(response);

  const sucursales: Sucursal[] = await response.json();
  return sucursales;
};

export async function crearSucursal(formData: Sucursal, token: string) {
  console.log("estoy en el crearSucursal");

  try {
    console.log("estoy en el fetch");

    console.log(formData);

    const urlServer = "http://localhost:8080/api/sucursal/";

    const response = await fetch(urlServer, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
      body: JSON.stringify({
        nombre: formData.nombre,
        horaApertura: formData.horaApertura,
        horaCierre: formData.horaCierre,
        imagen: formData.imagen,
        calle: formData.calle,
        cp: formData.cp,
        numero: formData.numero,
        localidad: formData.localidad,
        provincia: formData.provincia,
        pais: formData.pais,
        idEmpresa: formData.idEmpresa,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
    throw error; // Asegurarse de propagar el error para que el componente pueda manejarlo
  }
}

export async function eliminarSucursal(id: string, token: string) {
  const urlServer = "http://localhost:8080/api/sucursal/" + id;
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
export async function activarSucursal(id: string) {
  const urlServer = "http://localhost:8080/api/sucursal/reactivate" + id;
  await fetch(urlServer, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });
}
export async function getSucursalXId(id: string) {
  const urlServer = "http://localhost:8080/api/sucursal/" + id;
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
export async function actualizarSucursal(
  id: number,
  formData: Sucursal,
  token: string
) {
  console.log("estoy en el actualizarSucursal");

  try {
    console.log("estoy en el fetch");

    console.log(formData);

    const urlServer = "http://localhost:8080/api/sucursal/" + id;

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
        imagen: formData.imagen,
        nombre: formData.nombre,
        horaApertura: formData.horaApertura,
        horaCierre: formData.horaCierre,
        calle: formData.calle,
        cp: formData.cp,
        numero: formData.numero,
        localidad: formData.localidad,
        provincia: formData.provincia,
        pais: formData.pais,
        idEmpresa: formData.idEmpresa,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
    throw error; // Asegurarse de propagar el error para que el componente pueda manejarlo
  }
}

export const getSucursal = async (id: string): Promise<Sucursal[]> => {
  const endpoint = `http://localhost:8080/api/sucursal/lista-sucursal/${id}`;
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
export const getSucursalTodas = async (id: string): Promise<Sucursal[]> => {
  const endpoint = `http://localhost:8080/api/sucursal/lista-todo-sucursal/${id}`;
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
export const obtenerSucursalesActivas = async (): Promise<Sucursal[]> => {
  const endpoint = "http://localhost:8080/api/sucursal/traerSucursales/"; // Asegúrate de que la URL sea correcta
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener sucursales activas:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
};
