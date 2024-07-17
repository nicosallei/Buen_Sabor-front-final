import DataModel from "./DataModel";
import IDomicilio from "./IDomicilio";
import IEmpresa from "./IEmpresa";

export default interface ISucursal extends DataModel<ISucursal> {
  nombre: string;
  horarioApertura: string;
  horarioCierre: string;
  domicilio: IDomicilio;
  empresa: IEmpresa;
  url_imagen: string;
  esCasaMatriz?: boolean; // Nuevo campo para indicar si es la casa matriz
}
