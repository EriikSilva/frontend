export interface IGetUserByEmail {
    email:       string;
    name:        string;
    initialDate: Date;
    endDate:     Date | null;
}


export interface IPostUser {
    email: string;
    name:  string;
}


export interface IResponseCreateUser {
    email:       string;
    name:        string;
    initialDate: Date;
    endDate:     Date | null;
}