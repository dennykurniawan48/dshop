export default function(path: string): boolean{
    const exclude: Array<string> = ['/login', '/register']
    return !exclude.includes(path) || !path.startsWith('/admin')
}