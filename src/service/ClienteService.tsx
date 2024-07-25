import * as CryptoJS from "crypto-js";
export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  eliminado: boolean;
  imagen: string;
  fechaNacimiento: string;
  //domicilios: Domicilio[];
}

export const getClientes = async (): Promise<Cliente[]> => {
  const response = await fetch(`http://localhost:8080/api/cliente/listar`);
  if (!response.ok) {
    throw new Error("Error al obtener los CLIENTES");
  }
  return response.json();
};

export const actualizarPasswordCliente = async (
  clienteId: number,
  nuevaPassword: string,
  token: string
): Promise<void> => {
  try {
    const encryptedPassword = CryptoJS.SHA256(nuevaPassword);
    const response = await fetch(
      `http://localhost:8080/api/usuario/cliente/actualizarPassword/${clienteId}`,
      {
        method: "PUT", // Método HTTP
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Indica el tipo de contenido que se está enviando
        },
        body: JSON.stringify({ nuevaPassword: encryptedPassword }), // Convierte la nueva contraseña a una cadena JSON
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.text();
    console.log(data);
  } catch (error) {
    console.error("Error en actualizarPasswordCliente: ", error);
  }
};
