import DataModel from "./DataModel";

import ISucursal from "./ISucursal";

export default interface IEmpresa extends DataModel<IEmpresa> {
  nombre: string;
  razonSocial: string;
  cuil: number;
  url_imagen?: string;

  sucursales: ISucursal[];
}
