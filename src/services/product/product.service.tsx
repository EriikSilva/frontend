import api from '../../utils/api'
import type { IGetProducts, IPostProduct, IPutProduct } from './product.interface'

export async function getProducts():Promise<IGetProducts[]> {
    const response = await api.get<IGetProducts[]>('/product')
    return response.data
}

export async function getActiveProducts():Promise<IGetProducts[]> {
    const response = await api.get<IGetProducts[]>('/product/active')
    return response.data
}

export async function getProductById(id: string): Promise<IGetProducts> {
    const response = await api.get<IGetProducts>(`/product/${id}`)
    return response.data
}

export async function postProduct(product: IPostProduct): Promise<IGetProducts> {
    const response = await api.post<IGetProducts>('/product', product)
    return response.data
}

export async function putProduct(id: string, product: IPutProduct): Promise<IGetProducts> {
    const response = await api.put<IGetProducts>(`/product/${id}`, product)
    return response.data
}

export async function deleteProduct(id: string): Promise<void> {
    await api.delete(`/product/${id}`)
}

export async function toggleProductStatus(id: string, isActive: boolean): Promise<IGetProducts> {
    const response = await api.patch<IGetProducts>(`/product/${id}/status`, { isActive })
    return response.data
}