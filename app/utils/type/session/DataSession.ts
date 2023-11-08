export type User = {
    name: string,
    sub: string,
    email: string,
    picture: string | null,
    is_admin: boolean,
    exp: number,
    id:string,
    iat: number,
    expires: string   
}

export type DataSession = {
    user: User | null
}