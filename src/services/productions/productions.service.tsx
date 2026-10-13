import api from "../../utils/api"
import type { IGetProductionsByEmail, IPostProduction } from "./productions.interface"



export async function getOrdersByEmail(email: string): Promise<IGetProductionsByEmail> {
    const response = await api.get<IGetProductionsByEmail>('/orders/GetProduction', { params: { email } });
    return response.data;
}

export async function postProduction(production: IPostProduction ): Promise<IPostProduction> {
    const response = await api.post<IPostProduction>('/orders/Production', production)
    return response.data
}
