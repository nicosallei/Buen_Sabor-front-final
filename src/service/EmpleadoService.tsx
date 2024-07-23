import * as CryptoJS from "crypto-js";
export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  rol: string;
  imagen: string;
  email: string;
  sucursales: Sucursal[];
  eliminado: boolean;
}
export interface Sucursal {
  id?: number;
  nombre?: string;
  eliminado?: boolean;
}
export const getEmpleados = async (sucursalId: string): Promise<Empleado[]> => {
  const response = await fetch(
    `http://localhost:8080/api/empleado/sucursal/${sucursalId}`
  );
  if (!response.ok) {
    throw new Error("Error al obtener los empleados");
  }
  return response.json();
};

export const cambiarPasswordEmpleado = async (
  cambioPasswordDto: {
    username: string;
    passwordActual: string;
    nuevaPassword: string;
    id: number;
  },
  token: string
): Promise<void> => {
  try {
    const encryptedPasswordActual = CryptoJS.SHA256(
      cambioPasswordDto.passwordActual
    ).toString();
    const encryptedPasswordNueva = CryptoJS.SHA256(
      cambioPasswordDto.nuevaPassword
    ).toString();
    const body = JSON.stringify({
      id: cambioPasswordDto.id,
      username: cambioPasswordDto.username,
      passwordActual: encryptedPasswordActual,
      nuevaPassword: encryptedPasswordNueva,
    });

    const response = await fetch(
      `http://localhost:8080/api/usuario/cambiar-password-empleado`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body,
      }
    );

    if (!response.ok) {
      // Si el servidor envía un mensaje de error en el cuerpo de la respuesta
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al cambiar la contraseña");
    }
  } catch (error: any) {
    console.error("Error al cambiar la contraseña:", error.message);
    throw error; // Re-lanzar el error para manejarlo en otra parte de tu aplicación
  }
};

export const actualizarPasswordEmpleado = async (
  cambioPasswordDto: { id: number; nuevaPassword: string; username: string },
  token: string
): Promise<void> => {
  try {
    const encryptedPasswordNueva = CryptoJS.SHA256(
      cambioPasswordDto.nuevaPassword
    ).toString();
    const body = JSON.stringify({
      id: cambioPasswordDto.id,
      nuevaPassword: encryptedPasswordNueva,
      username: cambioPasswordDto.username,
    });

    const response = await fetch(
      `http://localhost:8080/api/usuario/actualizar-password-empleado`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body,
      }
    );

    if (!response.ok) {
      // Si el servidor envía un mensaje de error en el cuerpo de la respuesta
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al cambiar el estado del pedido"
      );
    }
  } catch (error: any) {
    console.error("Error al cambiar el estado del pedido:", error.message);
    throw error; // Re-lanzar el error para manejarlo en otra parte de tu aplicación
  }
};
