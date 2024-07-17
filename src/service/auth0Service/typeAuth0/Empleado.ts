// types/IEmpleado.ts
import { RolEmpleado } from "../../../types/usuario/Usuario";
import DataModel from "./DataModel";
import IDomicilio from "./IDomicilio";
import { sucursal } from "../../ServiceInsumos";

export default interface IEmpleado extends DataModel<IEmpleado> {
  nombre: string;
  apellido: string;
  Telefono: string;
  email: string;
  rol: RolEmpleado;
  imagen?: string;
  domicilios: IDomicilio[];
  sucursal: sucursal;
}
