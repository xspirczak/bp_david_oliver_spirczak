export function TodoItem({completed, id, title, toggleTodo, deleteTodo}) {
    return (
        <li>
            <label>
                <input type="checkbox" checked={completed}
                    onChange={e => toggleTodo(id, e.target.checked)}  />
                {title}
            </label>
            {/* Passing FUNCTION deleteTodo!!
              not the result of the calling deleteTodo function deleteTodo(id)*/}

            <button onClick={() => deleteTodo(id)} className="bg-red-900 hover:bg-red-700 text-gray-900 dark:text-white font-bold py-2 px-4 rounded">Delete</button>
        </li>

    )
}