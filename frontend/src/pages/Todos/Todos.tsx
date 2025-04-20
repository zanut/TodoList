"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Todo, TodoForm } from "../../types/todo"
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "../../actions"
import "./todos.css"


export default function Todos() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
    const [newTodo, setNewTodo] = useState<TodoForm>({
        title: "",
        description: "",
        status: "To Do",
    })
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    // Status options
    const statusOptions = ["To Do", "In Progress", "Done"]

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }

        // Fetch todos
        const fetchTodosData = async () => {
        setIsLoading(true)
        try {
            const response = await fetchTodos()
            setTodos(response)
        } catch (err) {
            console.error("Failed to fetch todos:", err)
            setError(err instanceof Error ? err.message : "Failed to load todos. Please try again.")
        } finally {
            setIsLoading(false)
        }
        }

        fetchTodosData()
    }, [navigate])

    // Handle adding a new todo
    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await createTodo(newTodo)
            setTodos([...todos, response])
            setNewTodo({
                title: "",
                description: "",
                status: "To Do",
            })
            setShowAddForm(false)
        } catch (err) {
            console.error("Failed to add todo:", err)
            setError(err instanceof Error ? err.message : "Failed to add todo. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Handle updating a todo
    const handleUpdateTodo = async (e: React.FormEvent) => {
        // Prevent default form submission behavior
        e.preventDefault()

        // Check if editingTodo is not null
        if (!editingTodo) return

        setIsLoading(true)

        // Update the todo with the new data
        try {
            const response = await updateTodo(editingTodo.id.toString(), editingTodo)

            setTodos(todos.map((todo) => (todo.id === response.id ? response : todo)))
            setEditingTodo(null)
        } catch (err) {
            console.error("Failed to update todo:", err)
            setError(err instanceof Error ? err.message : "Failed to update todo. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteTodo = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this todo?")) {
            setIsLoading(true)

            // Handle the deletion of the todo
            try {
                await deleteTodo(id.toString())
                setTodos(todos.filter((todo) => todo.id !== id))
            } catch (err) {
                console.error("Failed to delete todo:", err)
                setError(err instanceof Error ? err.message : "Failed to delete todo. Please try again.")
            } finally {
                setIsLoading(false)
            }

        }
    }

    const handleStatusChange = async (id: number, newStatus: string) => {
        setIsLoading(true)
        try {
            // Find the current todo to preserve other fields
            const todoToUpdate = todos.find((todo) => todo.id === id)
            if (!todoToUpdate) return

            // Update the status of the todo
            const response = await updateTodo(id.toString(), { ...todoToUpdate, status: newStatus })

            // Update the state with the new todo data
            setTodos(todos.map((todo) => (todo.id === response.id ? response : todo)))
        } catch (err) {
            console.error("Failed to update todo status:", err)
            setError(err instanceof Error ? err.message : "Failed to update status. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusClass = (status: string) => {
        switch (status) {
        case "To Do":
            return "status-todo"
        case "In Progress":
            return "status-in-progress"
        case "Done":
            return "status-done"
        default:
            return ""
        }
    }

    if (isLoading && todos.length === 0) {
        return (
        <div className="todos-container">
            <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        </div>
        )
    }

    return (
        <div className="todos-container">
        {error && (
            <div
            className="error-message"
            style={{
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                marginBottom: "1rem",
            }}
            >
            {error}
            <button
                onClick={() => setError(null)}
                style={{ marginLeft: "0.5rem", fontWeight: "bold" }}
                aria-label="Dismiss error"
            >
                ✕
            </button>
            </div>
        )}

        <div className="todos-header">
            <h1 className="todos-title">My Todos</h1>
            <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)} disabled={isLoading}>
            {showAddForm ? "Cancel" : "Add Todo"}
            </button>
        </div>

        {showAddForm && (
            <form className="add-todo-form" onSubmit={handleAddTodo}>
            <div className="form-group">
                <label htmlFor="title" className="form-label">
                Title
                </label>
                <input
                type="text"
                id="title"
                className="form-input"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="description" className="form-label">
                Description
                </label>
                <textarea
                id="description"
                className="form-textarea"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                ></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="status" className="form-label">
                Status
                </label>
                <select
                id="status"
                className="form-select"
                value={newTodo.status}
                onChange={(e) => setNewTodo({ ...newTodo, status: e.target.value })}
                >
                {statusOptions.map((status) => (
                    <option key={status} value={status}>
                    {status}
                    </option>
                ))}
                </select>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Todo"}
                </button>
            </div>
            </form>
        )}

        {todos.length === 0 ? (
            <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h2 className="empty-state-title">No todos yet</h2>
            <p className="empty-state-description">Create your first todo to get started</p>
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)} disabled={isLoading}>
                Create Todo
            </button>
            </div>
        ) : (
            <div className="todos-list">
            {todos.map((todo) => (
                <div key={todo.id} className="todo-card">
                <div className="todo-content">
                    <h3 className="todo-title">{todo.title}</h3>
                    <p className="todo-description">{todo.description}</p>
                    <StatusDropdown
                    currentStatus={todo.status}
                    options={statusOptions}
                    onStatusChange={(status) => handleStatusChange(todo.id, status)}
                    getStatusClass={getStatusClass}
                    disabled={isLoading}
                    />
                </div>
                <div className="todo-actions">
                    <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => setEditingTodo(todo)}
                    aria-label="Edit"
                    disabled={isLoading}
                    >
                    ✏️
                    </button>
                    <button
                    className="btn btn-danger btn-icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                    aria-label="Delete"
                    disabled={isLoading}
                    >
                    🗑️
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Edit Todo Modal */}
        {editingTodo && (
            <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                <h2 className="modal-title">Edit Todo</h2>
                <button className="modal-close" onClick={() => setEditingTodo(null)} disabled={isLoading}>
                    ✕
                </button>
                </div>
                <form onSubmit={handleUpdateTodo}>
                <div className="modal-body">
                    <div className="form-group">
                    <label htmlFor="edit-title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        id="edit-title"
                        className="form-input"
                        value={editingTodo.title}
                        onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                        required
                    />
                    </div>
                    <div className="form-group">
                    <label htmlFor="edit-description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="edit-description"
                        className="form-textarea"
                        value={editingTodo.description}
                        onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                    ></textarea>
                    </div>
                    <div className="form-group">
                    <label htmlFor="edit-status" className="form-label">
                        Status
                    </label>
                    <select
                        id="edit-status"
                        className="form-select"
                        value={editingTodo.status}
                        onChange={(e) => setEditingTodo({ ...editingTodo, status: e.target.value })}
                    >
                        {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingTodo(null)}
                    disabled={isLoading}
                    >
                    Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    )
}

// Status dropdown component
function StatusDropdown({
    currentStatus,
    options,
    onStatusChange,
    getStatusClass,
    disabled = false,
}: {
    currentStatus: string
    options: string[]
    onStatusChange: (status: string) => void
    getStatusClass: (status: string) => string
    disabled?: boolean
}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="status-dropdown">
        <div
            className={`todo-status ${getStatusClass(currentStatus)} status-dropdown-button`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            style={{ cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.7 : 1 }}
        >
            {currentStatus} {!disabled && "▼"}
        </div>
        {isOpen && !disabled && (
            <div className="status-dropdown-menu">
            {options.map((status) => (
                <div
                key={status}
                className="status-dropdown-item"
                onClick={() => {
                    onStatusChange(status)
                    setIsOpen(false)
                }}
                >
                {status}
                </div>
            ))}
            </div>
        )}
        </div>
    )
}
