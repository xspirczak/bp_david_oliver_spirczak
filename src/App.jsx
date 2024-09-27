import { useEffect, useState } from "react"
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

export default function App() {

  const [todos, setTodos] = useState(() => {
    // getting data from localStorage
    const localValue = localStorage.getItem("ITEM")
    // if localStorage is empty return empty array
    if (localValue == null) return []

    return JSON.parse(localValue)
  });

  useEffect(() => {
    // everytime values in todos change it calls the function - storing the todos in localStorage
    localStorage.setItem("ITEM", JSON.stringify(todos))
  }, [todos])

  function addTodo(title) {
    setTodos(currentTodos => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title, completed: false },
      ]
    })

  }

  function toggleTodo(id, completed) {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed }
        }
        return todo
      })
    })
  }

  function deleteTodo(id) {
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id)
    })
  }

  return (
    <>
      <TodoForm onSubmit={addTodo}/>
      <div className="max-w-sm mx-auto">
        <h1 className="mb-5">Todo List</h1>
        <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      </div>

    </>
  )
}


