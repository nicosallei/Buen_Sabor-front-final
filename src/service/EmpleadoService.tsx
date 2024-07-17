export interface Empleado {
    id: number;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    telefono: string;
    rol: string;
    imagen: string;
    email:string;
    sucursales: Sucursal[];
    eliminado: boolean;
  }
  export interface Sucursal {
    id?: number;
    nombre?: string;
    eliminado?: boolean;
  }
  export const getEmpleados = async (sucursalId: string): Promise<Empleado[]> => {
    const response = await fetch(`http://localhost:8080/api/empleado/sucursal/${sucursalId}`);
    if (!response.ok) {
        throw new Error('Error al obtener los empleados');
    }
    return response.json();
};