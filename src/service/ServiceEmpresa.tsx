import { Empresa } from "./ServiceSucursal";

export interface Empresas {
  id?: number;
  nombre: string;
  razonSocial: string;
  cuil: number;
  eliminado?: boolean;
  imagen?: string;
}

export const getEmpresas = async (): Promise<Empresas[]> => {
  const endpoint = "http://localhost:8080/api/empresa/traer-todo/";
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
export const getTodasEmpresas = async (): Promise<Empresas[]> => {
  const endpoint = "http://localhost:8080/api/empresa/traer-todo/eliminado/";
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

export async function crearEmpresa(formData: Empresas, token: string) {
  console.log("estoy en el crearEmpresa");

  try {
    console.log("estoy en el fetch");

    console.log(formData);

    const urlServer = "http://localhost:8080/api/empresa/";
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
        razonSocial: formData.razonSocial,
        cuil: formData.cuil,
        imagen: formData.imagen,
      }),
    });

    if (!response.ok) {
      // throw new Error(HTTP error! status: ${response.status});
    }
    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
  }
}

export const actualizarEmpresa = async (
  id: number,
  empresa: Empresa,
  token: string
): Promise<Response> => {
  const endpoint = `http://localhost:8080/api/empresa/${id}`;
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(empresa),
  });

  return response;
};
export const eliminarEmpresa = async (id: number): Promise<Response> => {
  const endpoint = `http://localhost:8080/api/empresa/${id}`;
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",

      "Access-Control-Allow-Origin": "*",
    },
  });

  return response;
};
