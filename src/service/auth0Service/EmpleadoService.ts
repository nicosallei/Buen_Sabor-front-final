import IEmpleado from "./typeAuth0/Empleado";
import BackendClient from "./BackendClient";
import { NumberFormat } from "xlsx";

export default class EmpleadoService extends BackendClient<IEmpleado> {
  async getEmpleadoById(url: string, id: number): Promise<IEmpleado> {
    return this.get(url, id);
  }

  async getEmpleadoByEmail(
    url: string,
    email: string
  ): Promise<IEmpleado | null> {
    const path = `${url}/empleado/email/${email}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    try {
      const empleado = await this.request(path, options);
      return empleado;
    } catch (error) {
      console.error("Error al obtener el empleado por email:", error);
      return null;
    }
  }

  async postEmpleado(url: string, data: FormData): Promise<IEmpleado> {
    const path = url + "/";
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: data,
    };
    return this.request(path, options);
  }

  async putEmpleado(
    url: string,
    id: number,
    data: FormData
  ): Promise<IEmpleado> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
      },
      body: data,
    };
    return this.request(path, options);
  }

  async deleteEmpleado(url: string, id: NumberFormat): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    };
    await this.request(path, options);
  }
}
