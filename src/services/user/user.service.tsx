import api from '../../utils/api'
import type { IGetUserByEmail, IPostUser, IResponseCreateUser } from './user.interface'

export async function getUserByEmail(email: string): Promise<IGetUserByEmail> {
    const response = await api.get<IGetUserByEmail>(`/users/${email}`)
    return response.data
}

export async function postUser(user: IPostUser): Promise<IResponseCreateUser> {
    const response = await api.post<IResponseCreateUser>('/users', user)
    return response.data
}

