export interface Todo {
    id: number
    title: string
    description: string
    status: string
    user_id: number
}

export interface TodoForm {
    title: string
    description: string
    status: string
}