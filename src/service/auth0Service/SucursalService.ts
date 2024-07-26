import axios from "axios";
import ISucursal from "./typeAuth0/ISucursal";
import BackendClient from "./BackendClient";

export default class SucursalService extends BackendClient<ISucursal> {
  async postSucursal(url: string, data: FormData): Promise<ISucursal> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: data,
    };
    return this.request(path, options);
  }

  async getById(baseURL: string, sucursalId: number) {
    const response = await axios.get(`${baseURL}/sucursal/${sucursalId}`, {
      headers: {},
    });
    return response.data;
  }
  async putSucursal(
    url: string,
    id: number,
    data: FormData
  ): Promise<ISucursal> {
    const path = `${url}/update/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
      },
      body: data,
    };
    return this.request(path, options);
  }

  async deleteSucursal(url: string, id: number): Promise<void> {
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
