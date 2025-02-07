import DisplayAllDocuments from "../Components/DisplayAllDocuments.jsx";
import Filters from "../Components/Filters.jsx";
import Footer from "../Components/Footer.jsx";

export function SearchPage()  {
    return (
        <>
            <h1 className="text-center sm:text-fontSize61 text-fontSize48 font-bold text-custom-dark-blue mt-6">Vyhľadávanie</h1>
            <Filters></Filters>
                <div className="flex flex-col min-h-screen">
                    <div className="flex-grow">
                        <DisplayAllDocuments></DisplayAllDocuments>
                    </div>
                    <Footer/>
                </div>
        </>
        )
}

