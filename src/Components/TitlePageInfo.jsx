import {Link} from "react-router-dom";

export default function TitlePageInfo () {
    return (
        <main className="bg-gradient-to-r from-blue-500 to-cyan-200 text-white text-center py-5 md:py-20">
            <h1 className="text-fontSize48 md:text-fontSize61 font-bold">Odomkni minulosť s <span className="text-custom-dark-blue flex justify-center break-all">CipherMatcher</span></h1>
            <p className="mt-4 max-w-xl mx-auto text-fontSize17 p-4">
                Webová aplikácia na mapovanie substitučných šifrovacích kľúčov na šifrované texty, navrhnutá na pomoc pri dešifrovaní historických dokumentov.
                Vytvorená ako súčasť bakalárskej práce so zameraním na <span className="font-semibold">nomenklátoré šifry</span>.
            </p>
            <div className="grid justify-center mt-6 gap-4 sm:flex">
                <Link to="/about" className="text-fontSize20 border-2 border-custom-dark-blue bg-custom-dark-blue px-10 py-2 text-white rounded-full hover:bg-custom-dark-blue-hover hover:border-custom-dark-blue-hover font-semibold">
                    O projekte
                </Link>
                <Link to="/tutorial" className="text-fontSize20 border-2 border-custom-dark-blue bg-custom-dark-blue px-10 py-2 text-white rounded-full hover:bg-custom-dark-blue-hover hover:border-custom-dark-blue-hover font-semibold">
                    Vyskúšať
                </Link>
            </div>
        </main>
        )
}