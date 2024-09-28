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

   // everytime values in todos array change it calls the function - storing the todos in localStorage
  useEffect(() => {
    localStorage.setItem("ITEM", JSON.stringify(todos))
  }, [todos])

  // addid todo to the todolist
  function addTodo(title) {
    setTodos(currentTodos => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title, completed: false }, // random id, title and state of completition - false
      ]
    })

  }

  // change the state of completion
  function toggleTodo(id, completed) {
    setTodos(currentTodos => {
      // mapping through the currentTodos and checking is there is a todo with the specific
      // id, if so then we are spreading the todo and creating copy of the todo with new value of completed
      return currentTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed }
        }
        return todo
      })
    })
  }

  // delete todo from currentTodos
  function deleteTodo(id) {
    setTodos(currentTodos => {
      // return new array of todos excluding todo with id passed as an argument
      return currentTodos.filter(todo => todo.id !== id)
    })
  }

  // update title of todo
  function updateTodoTitle(id, newTitle) {
    setTodos(currentTodos => 
      // mapping through the currentTodos, if we find todo with id passed as an argument
      // we spread the todo and create a new copy of the object and upadte the title to newTitle 
        currentTodos.map(todo => {
          if (todo.id === id) {
            return { ...todo, title: newTitle }
          }
          return todo
        }
        )
    );
}


  return (
    <>
      <TodoForm onSubmit={addTodo}/>
      <div className="max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-500 dark:text-gray-300 p-4">Todo List</h1>
        <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} updateTodoTitle={updateTodoTitle} />
      </div>

    </>
  )
}


