import BackendClient from "./BackendClient";
import ICliente from "./typeAuth0/ICliente";

export default class ClienteService extends BackendClient<ICliente> {
  async getClienteById(
    url: string,
    id: number,
    token: string
  ): Promise<ICliente> {
    return this.get(url, id, token);
  }

  async getClienteByEmail(
    url: string,
    email: string,
    token: string
  ): Promise<ICliente | null> {
    const path = `${url}/cliente/email/${email}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const cliente = await this.request(path, options, token);
      return cliente;
    } catch (error) {
      console.error("Error al obtener el cliente por email:", error);
      return null;
    }
  }

  async postCliente(
    url: string,
    data: FormData,
    token: string
  ): Promise<ICliente> {
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

  async putCliente(
    url: string,
    id: number,
    data: FormData,
    token: string
  ): Promise<ICliente> {
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

  async deleteCliente(url: string, id: number, token: string): Promise<void> {
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
