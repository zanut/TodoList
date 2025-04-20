import API from "./api/axios"

import { LoginForm, LoginResponse, SignupForm } from "./types/auth"
import { Todo, TodoForm } from "./types/todo"


export const login = async (data: LoginForm): Promise<LoginResponse> => {
    try {
        const response = await API.post<LoginResponse>("/login", data)
        return response.data
    } catch (error) {
        throw new Error("Login failed")
    }
}

export const signup = async (data: SignupForm): Promise<void> => {
    try {
        await API.post("/signup", data)
    } catch (error) {
        throw new Error("Signup failed")
    }
}

export const fetchTodos = async (): Promise<Todo[]> => {
    try {
        const response = await API.get<Todo[]>("/todos")
        return response.data
    } catch (error) {
        throw new Error("Failed to fetch todos")
    }
}

export const createTodo = async (todo: TodoForm): Promise<Todo> => {
    try {
        const response = await API.post<Todo>("/todos", todo)
        return response.data
    } catch (error) {
        throw new Error("Failed to create todo")
    }
}

export const updateTodo = async (id: string, todo: Todo): Promise<Todo> => {
    try {
        const response = await API.put<Todo>(`/todos/${id}`, todo)
        return response.data
    } catch (error) {
        throw new Error("Failed to update todo")
    }
}

export const deleteTodo = async (id: string): Promise<void> => {
    try {
        await API.delete(`/todos/${id}`)
    } catch (error) {
        throw new Error("Failed to delete todo")
    }
}
