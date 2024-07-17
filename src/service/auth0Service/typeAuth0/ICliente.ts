// types/IEmpleado.ts
import { Rol } from "../../../types/usuario/Usuario";
import DataModel from "./DataModel";
import IDomicilio from "./IDomicilio";

export default interface ICliente extends DataModel<ICliente> {
  nombre: string;
  apellido: string;
  Telefono: string;
  email: string;
  rol: Rol;
  imagen?: string;
  domicilios: IDomicilio[];
}
