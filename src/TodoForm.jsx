import { useState } from "react"

export function TodoForm({onSubmit}) {

    const [newItem, setNewItem] = useState("")

    // handling of adding new todo item
    function handleSubmit(e) {
        e.preventDefault() // prevents the page from refreshing

        // checking if the new item is empty string
        if (newItem === "")
            return 


        onSubmit(newItem)        

        setNewItem("") // after adding new item to the todo list the input field clears 
      }
    
    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
            <div className="mb-5">
                <div className="flex justify-center">
                    <label htmlFor="item" className="text-2xl font-bold block mb-2 text-gray-900 dark:text-white">New item</label>
                </div>
                <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" id="item" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div className="flex justify-center">
                <button className="bg-gray-900 hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 px-4 rounded">
                    Add task
                </button>
            </div>
        </form>
    )
}