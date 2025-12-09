export interface IUserRegister {
  displayName: string;
  username: string;
  password: string;
  email: string;
}

export interface IResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: object;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  id: number;
  displayName: string;
  username: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface ICategory {
  id?: number;
  name: string;
}

export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: ICategory;
  imageName?: string;
  contentType?: string;
  image?: string;
}

export interface Product {
  id: string | number;
  name: string;
}

export type OrderStatus =
  | "AGUARDANDO_PAGAMENTO"
  | "PAGO"
  | "EM_TRANSPORTE"
  | "ENTREGUE"
  | "CANCELADO";

export interface OrderItem {
  id: number;
  productId: number;
  preco: number;
  quantidade: number;
}

export interface Order {
  id: number;
  data: string;

  userId?: number;        
  addressId?: number;     
  enderecoManual?: any;

  items: OrderItem[];
  status: OrderStatus;
}

export interface OrderDashboard {
  aguardandoPagamento: number;
  pago: number;
  emTransporte: number;
  entregue: number;
  cancelado: number;
}
