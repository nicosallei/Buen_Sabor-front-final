export class UsuarioEnvio {
  id?: number;
  username: string = "";
  password: string = "";
}
export class UsuarioRecibo {
  id?: number;
  username: string = "";
  rol: string = "";
}
export class Usuario {
  id?: number;
  username: string = "";
  password: string = "";
  rol: Rol = Rol.DEFAULT;
}
export enum Rol {
  DEFAULT = "DEFAULT",
  ADMINISTRADOR = "ADMINISTRADOR",
  CLIENTE = "CLIENTE",
  EMPLEADO_COCINA = "EMPLEADO_COCINA",
  EMPLEADO_REPARTIDOR = "EMPLEADO_REPARTIDOR",
  EMPLEADO_CAJA = "EMPLEADO_CAJA",
}
export enum RolEmpleado {
  ADMINISTRADOR = "ADMINISTRADOR",
  EMPLEADO_COCINA = "EMPLEADO_COCINA",
  EMPLEADO_REPARTIDOR = "EMPLEADO_REPARTIDOR",
  EMPLEADO_CAJA = "EMPLEADO_CAJA",
}
