import DataModel from "./DataModel";
import IProvincia from "./IProvincia";

export default interface ILocalidad extends DataModel<ILocalidad> {
  nombre: string;
  provincia: IProvincia;
}
