import api from "../../utils/api";
import type { IOrders } from "./order.interface";

export async function getOrders(): Promise<IOrders> {
    const response = await api.get<IOrders>('/orders');
    return response.data;
}