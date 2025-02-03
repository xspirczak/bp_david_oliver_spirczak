import {Link} from "react-router-dom";

export default function TitlePageInfo () {
    return (
        <main className="bg-gradient-to-r from-blue-500 to-cyan-200 text-white text-center py-20">
            <h1 className="text-fontSize61 font-bold">Unlock the past with <span className="text-custom-dark-blue flex justify-center">Lorem</span></h1>
            <p className="mt-4 max-w-xl mx-auto text-fontSize17 p-4">
                Lorem ipsum is simply dummy text of the printing and typesetting industry.
                Lorem ipsum has been the standard dummy text ever since the 1500s.
            </p>
            <div className="grid justify-center mt-6 gap-4 sm:flex">
                <Link to="#" className="text-fontSize20 border border-custom-dark-blue bg-custom-dark-blue px-10 py-2 text-white rounded-full hover:bg-custom-dark-blue-hover hover:border-custom-dark-blue-hover">
                    Lorem
                </Link>
                <Link to="#" className="text-fontSize20 border border-custom-dark-blue px-10 py-2 rounded-full text-white ">
                    Lorem
                </Link>
            </div>
        </main>
        )
}