import DisplayAllDocuments from "../Components/DisplayAllDocuments.jsx";

export function SearchPage()  {
    return (
        <>
            <h1 className="text-center sm:text-fontSize61 text-fontSize48 font-bold text-custom-dark-blue mt-6">Knižnica dokumentov</h1>
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow">
                    <DisplayAllDocuments></DisplayAllDocuments>
                </div>
            </div>
        </>
    )
}

