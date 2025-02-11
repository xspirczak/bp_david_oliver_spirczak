import {useNavigate} from "react-router-dom";
import { MdDone } from "react-icons/md";

export default function LoginSuccess({email}) {
    const navigate = useNavigate();

    const navigateToMainPage = () => {
        navigate("/");
    }
    return (
        <div className="grid justify-center p-6">
            <div className="flex justify-center mb-3">
                <div className="rounded-full bg-green-400 w-10 h-10 text-center flex items-center justify-center">
                    <MdDone />
                </div>
            </div>
            <h3 className="text-fontSize28 text-custom-dark-blue font-bold">Vitajte {email.split("@")[0]}, úspešne ste sa prihlásili.</h3>
            <p className="text-fontSize16 text-custom-dark-blue font-semibold mb-6">Za 3 sekundy budete presmerovaní na hlavnú stránku alebo kliknite na tlačidlo presmerovať.</p>
                <div className="flex justify-center">
                    <button type="button" onClick={navigateToMainPage} className="w-1/3 px-6 py-2 ml-3 bg-custom-dark-blue text-white text-fontSize16 font-medium rounded-xl hover:bg-custom-dark-blue-hover focus:outline-none">Presmerovať</button>
                </div>
        </div>
    )
}