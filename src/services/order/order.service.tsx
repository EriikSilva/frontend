import api from "../../utils/api";

export interface IOrders {
    orders: Order[];
}

export interface Order {
    order:              string;
    quantity:           number;
    productCode:        string;
    productDescription: string;
    image:              string;
    cycleTime:          number;
    materials:          Material[];
}

export interface Material {
    materialCode:        string;
    materialDescription: string;
}


export async function getOrders(): Promise<IOrders> {
    const response = await api.get<IOrders>('/orders');
    return response.data;
}