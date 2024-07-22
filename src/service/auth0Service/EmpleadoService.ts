import IEmpleado from "./typeAuth0/Empleado";
import BackendClient from "./BackendClient";

export default class EmpleadoService extends BackendClient<IEmpleado> {
  async getEmpleadoById(
    url: string,
    id: number,
    token: string
  ): Promise<IEmpleado> {
    return this.get(url, id, token);
  }

  async getEmpleadoByEmail(
    url: string,
    email: string,
    token: string
  ): Promise<IEmpleado | null> {
    const path = `${url}/empleado/email/${email}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const empleado = await this.request(path, options, token);
      return empleado;
    } catch (error) {
      console.error("Error al obtener el empleado por email:", error);
      return null;
    }
  }

  async postEmpleado(
    url: string,
    data: FormData,
    token: string
  ): Promise<IEmpleado> {
    const path = url + "/";
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    };
    return this.request(path, options, token);
  }

  async putEmpleado(
    url: string,
    id: number,
    data: FormData,
    token: string
  ): Promise<IEmpleado> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    };
    return this.request(path, options, token);
  }

  async deleteEmpleado(url: string, id: number, token: string): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    await this.request(path, options, token);
  }
}
