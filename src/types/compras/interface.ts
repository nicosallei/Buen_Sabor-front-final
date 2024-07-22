export interface Producto {
  id: number;
  denominacion: string;
  descripcion: string;
  codigo: string;
  precioVenta: number;
  categoria: any;
  sucursal: any;
  imagenes: Imagen[];
  cantidadMaximaCompra?: number;
  categoriaId?: number;
  // Agrega aquí las demás propiedades de un producto
}
export interface Imagen {
  id: number;
  url: string;
}

export interface PedidoDetalle {
  id?: number;
  producto: Producto;
  cantidad: number;
}

export interface Pedido {
  id?: number;
  hora?: string;
  total?: number;
  TotalCostoProduccion?: number;
  //estado: string;
  formaPago: FormaPago;
  tipoEnvio?: TipoEnvio;
  fechaPedido?: string;
  preferenceMPId?: string;
  sucursal?: Sucursal;
  domicilio?: Domicilio;
  cliente?: any;
  pedidoDetalle?: PedidoDetalle[];
  factura?: any;
  sucursalId?: number;
}
export interface Sucursal {
  id: number;
  nombre?: string;
}
export interface Domicilio {
  id?: number;
  calle?: string;
  numero?: string;
  localidad?: Localidad;
  cp?: number;
}
export interface Localidad {
  id?: number;
  nombre?: string;
  provincia?: Provincia;
}
export interface Provincia {
  id?: number;
  nombre?: string;
  pais?: Pais;
}
export interface Pais {
  id?: number;
  nombre?: string;
}
export enum TipoEnvio {
  DELIVERY = "DELIVERY",
  RETIRO_LOCAL = "RETIRO_LOCAL",
}
export enum FormaPago {
  EFECTIVO = "EFECTIVO",
  MERCADOPAGO = "MERCADOPAGO",
}
export interface DomicilioDto {
  calle: string;
  numero: string;
  localidad: number;
  cp: number;
  pais: number;
  provincia: number;
}
export interface ClienteDto {
  id?: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
}
