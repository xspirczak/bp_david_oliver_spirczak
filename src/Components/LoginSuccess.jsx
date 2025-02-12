import { MdDone } from "react-icons/md";

export default function LoginSuccess({ navigateTo, fullName}) {

    return (
        <div className="grid justify-center p-6">
            <div className="flex justify-center mb-3">
                <div className="rounded-full bg-green-400 w-10 h-10 text-center flex items-center justify-center">
                    <MdDone />
                </div>
            </div>
            <h3 className="text-fontSize28 text-custom-dark-blue font-bold text-center">Vitajte {fullName}, úspešne ste sa prihlásili.</h3>
            <p className="text-fontSize16 text-custom-dark-blue font-semibold mb-6">Za 3 sekundy budete presmerovaní na hlavnú stránku alebo kliknite na tlačidlo presmerovať.</p>
                <div className="flex justify-center">
                    <button type="button" onClick={() => navigateTo('/')} className="md:w-1/3 w-full leading-6 font-semibold px-6 py-1.5 bg-custom-dark-blue text-white text-fontSize16 rounded-xl hover:bg-custom-dark-blue-hover focus:outline-none">Presmerovať</button>
                </div>
        </div>
    )
}