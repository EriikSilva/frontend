import api from '../../utils/api'
import type { IGetProducts } from './product.interface'




export async function getProducts():Promise<IGetProducts[]> {
    const response = await api.get<IGetProducts[]>('/product')
    return response.data
}