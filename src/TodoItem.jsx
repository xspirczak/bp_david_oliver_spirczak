export function TodoItem({completed, id, title, toggleTodo, deleteTodo}) {
    return (
        <li className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md mb-4">
            <label className="flex items-center space-x-3">
                <input 
                    type="checkbox" 
                    checked={completed}
                    onChange={e => toggleTodo(id, e.target.checked)}  
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className={`text-lg font-bold ${completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-300'}`}>
                    {title}
                </span>
            </label>
            <button 
                onClick={() => deleteTodo(id)} 
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition duration-200">
                Delete
            </button>
        </li>
    )}