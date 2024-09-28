import { useState, useEffect } from 'react';

export function TodoItem({ completed, id, title, toggleTodo, deleteTodo, updateTodoTitle}) {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    
    // everytime value changes it calls the function and syncs the title
    useEffect(() => {
        setNewTitle(title);
    }, [title]);

    // toggle edit mode - change isEditing to true
    const handleEdit = () => {
        setIsEditing(true);
    };

    // save the title of currently edited todo and set isEdiding to false
    const handleSave = () => {
        if (newTitle.trim()) { // only save if the new title is not empty
            updateTodoTitle(id, newTitle); // call function to update title
            setIsEditing(false); 
        }
    };

    // canceling the editing mode changing isEditing to false and setting the title back how it was before editing
    const handleCancel = () => {
        setIsEditing(false);
        setNewTitle(title); 
    };

    return (
        <li className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md mb-4">
            <div className="flex items-center space-x-3">
                <input 
                    type="checkbox" 
                    checked={completed}
                    onChange={e => toggleTodo(id, e.target.checked)}  
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                {isEditing ? (
                    <input 
                        type="text" 
                        value={newTitle} 
                        onChange={e => setNewTitle(e.target.value)} 
                        className="border border-gray-300 rounded p-2 text-gray-900 dark:bg-gray-700 dark:text-gray-300 w-4/5  h-2/5"
                    />
                ) : (
                    <span className={`text-lg ${completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-300'}`}>
                        {title}
                    </span>
                )}
            </div>

            <div className="space-x-2">
                {isEditing ? (
                    <div className='flex justify-center space-x-2'>
                        <button 
                            onClick={ handleSave} 
                            className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-2 rounded transition duration-200"
                        >
                            Save
                        </button>
                        <button 
                            onClick={handleCancel} 
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={handleEdit} 
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded transition duration-200"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => deleteTodo(id)} 
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded transition duration-200"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}
