import BackendClient from "./BackendClient";
import ICliente from "./typeAuth0/ICliente";

export default class ClienteService extends BackendClient<ICliente> {
  async getClienteById(url: string, id: number): Promise<ICliente> {
    return this.get(url, id);
  }

  async getClienteByEmail(
    url: string,
    email: string
  ): Promise<ICliente | null> {
    const path = `${url}/cliente/email/${email}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    try {
      const cliente = await this.request(path, options);
      return cliente;
    } catch (error) {
      console.error("Error al obtener el cliente por email:", error);
      return null;
    }
  }

  async postCliente(url: string, data: FormData): Promise<ICliente> {
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

  async putCliente(url: string, id: number, data: FormData): Promise<ICliente> {
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

  async deleteCliente(url: string, id: number): Promise<void> {
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
