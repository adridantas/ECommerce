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
    data?: object
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
    id: string; 
    name: string;
}

export interface OrderItem {
    id?: string; 
    product: Product; 
    quantity: number; 
    preco: number;
}

export interface Order {
    id: string; 
    data: string; 
    addressId: string; 
    totalAmount: number; 
    status?: string; 
    items?: OrderItem[];
}
