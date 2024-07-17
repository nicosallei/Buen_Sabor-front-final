import { AbstractBackendClient } from "./AbstractBackendClient";

export default abstract class BackendClient<
  T
> extends AbstractBackendClient<T> {
  protected async request(
    path: string,
    options: RequestInit,
    token: string
  ): Promise<T> {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await fetch(path, options);

      if (!response.ok) {
        console.error("Error en la solicitud:", response.statusText);
        throw new Error(response.statusText);
      }

      if (
        response.status === 204 ||
        response.headers.get("Content-Length") === "0"
      ) {
        //return undefined;
      }

      return response.json();
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return Promise.reject(error);
    }
  }

  protected async requestAll(
    path: string,
    options: RequestInit,
    token: string
  ): Promise<T[]> {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(path, options);

      if (!response.ok) {
        console.error("Error en la solicitud:", response.statusText);
        throw new Error(response.statusText);
      }

      return response.json();
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return Promise.reject(error);
    }
  }
  // @ts-ignore

  async get(url: string, id: number, token: string): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "GET",
    };
    return this.request(path, options, token);
  }
  // @ts-ignore

  async getAll(url: string, token: string): Promise<T[]> {
    const path = url;
    const options: RequestInit = {
      method: "GET",
    };
    return this.requestAll(path, options, token);
  }
  // @ts-ignore

  async post(url: string, data: T, token: string): Promise<T> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    return this.request(path, options, token);
  }
  // @ts-ignore

  async put(url: string, id: number, data: T, token: string): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options, token);
  }
  // @ts-ignore

  async delete(url: string, id: number, token: string): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    await this.request(path, options, token);
  }
}
