import Footer from "../Components/Footer.jsx";
import DisplayAllDocuments from "../Components/DisplayAllDocuments.jsx";
import Filters from "../Components/Filters.jsx";

export function SearchPage()  {
    return (
        <>
            <h1 className="text-center sm:text-fontSize61 text-fontSize48 font-bold text-custom-dark-blue">Vyhľadávanie</h1>
            <Filters></Filters>
            <DisplayAllDocuments></DisplayAllDocuments>
            <Footer></Footer>
        </>
        )
}

