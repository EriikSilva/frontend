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
