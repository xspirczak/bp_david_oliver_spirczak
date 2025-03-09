import { MdDone } from "react-icons/md";

export default function LoginSuccess({ navigateTo, fullName}) {

    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen h-screen lg:py-0">
                <div className="bg-white md:rounded-91 rounded-3xl shadow w-5/6 sm:w-2/3 flex justify-center p-6">

                    <div className="grid justify-center p-6">
                        <div className="flex justify-center mb-3">
                            <div
                                className="rounded-full bg-green-400 w-10 h-10 text-center flex items-center justify-center">
                                <MdDone/>
                            </div>
                        </div>
                        <h3 className="text-fontSize28 text-custom-dark-blue font-bold text-center">Vitajte, {fullName}!</h3>
                        <p className="text-center text-custom-dark-blue text-fontSize20 mb-6">Úspešne ste sa
                            prihlásili.</p>
                        <div className="flex justify-center">
                            <button type="button" onClick={() => navigateTo('/')}
                                    className="w-full lg:w-1/2 text-white text-fontSize16 font-semibold leading-6 hover:bg-custom-dark-blue-hover bg-custom-dark-blue focus:outline-none rounded-3xl py-1.5 text-center">Pokračovať
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
)
}