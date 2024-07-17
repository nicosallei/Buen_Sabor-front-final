import DataModel from "./DataModel";
import IPais from "./IPais";

export default interface IProvincia extends DataModel<IProvincia> {
  nombre: string;
  pais: IPais;
}
