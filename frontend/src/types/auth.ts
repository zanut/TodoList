export interface LoginForm {
    username: string
    password: string
}
  
export interface LoginResponse {
    token: string
}

export interface SignupForm {
    username: string
    password: string
    confirmPassword?: string
}