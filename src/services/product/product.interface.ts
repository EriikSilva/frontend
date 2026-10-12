export interface IGetProducts {
    id:       string;
    name:     string;
    price:    number;
    isActive: boolean;
}

export interface IPostProduct {
    name:  string;
    price: number;
}

export interface IPutProduct {
    name?:  string;
    price?: number;
    isActive?: boolean;
}