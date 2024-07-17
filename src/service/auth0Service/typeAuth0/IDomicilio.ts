import DataModel from "./DataModel";
import ILocalidad from "./ILocalidad";

export default interface IDomicilio extends DataModel<IDomicilio> {
  calle: string;
  numero: number;
  cp: number;
  piso: number;
  nroDpto: number;
  localidad: ILocalidad;
}
