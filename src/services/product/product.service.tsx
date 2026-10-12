import api from '../../utils/api'

export interface IGetProducts {
    id:       string;
    name:     string;
    price:    number;
    isActive: boolean;
}


export async function getProducts():Promise<IGetProducts[]> {
    const response = await api.get<IGetProducts[]>('/product')
    return response.data
}