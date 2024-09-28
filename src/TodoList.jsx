import { TodoItem } from "./TodoItem"

export function TodoList({todos, toggleTodo, deleteTodo}) {
    return (
    <ul>
          {/*Short Circuiting - when there is no todos it renders the text...*/}
          {todos.length === 0 &&(
            <p className="text-center text-gray-500 dark:text-gray-300 font-medium p-4">
            Nothing to do
            </p>
          )}
          {/* Mapping through the todos and rendering them */}
          {todos.map(todo => {
            return (
              <TodoItem 
                {...todo}
                key={todo.id}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                /* {...todo} or -> 
                {
                id={todo.id} 
                completed={todo.completed} 
                title={todo.title} 
                key={todo.id}}*/
                /> 
            )
          })}
        </ul>
        )
}