import DataModel from "./DataModel";

export default interface IPais extends DataModel<IPais> {
  nombre: string;
}
