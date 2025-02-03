export default function LoginForm() {
    function togglePasswordVisibility() {
        let e = document.getElementById("password")
        if (e.type === "password") {
            e.type = "text"
        } else {
            e.type = "password"
        }
    }

    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-fontSize61 font-bold leading-tight tracking-tight text-custom-dark-blue text-center">
                            Prihlásiť sa
                        </h1>
                        <p className="text-font font-light text-gray-500 text-center m-0">
                            Nemáte učet? <a href="#" className="font-medium text-primary-600 hover:underline">Zaregistrujte sa</a>
                        </p>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-fontSize16 text-custom-dark-blue">Email</label>
                                <input type="email" name="email" id="email" className="border border-custom-dark-blue text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required=""/>
                            </div>
                            <div>
                                <div className="flex justify-between">
                                    <label htmlFor="password"
                                           className="block mb-2 text-fontSize16 text-custom-dark-blue text-center">Heslo</label>
                                    <button type="button" className="flex items-center" onClick={togglePasswordVisibility}>
                                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M13.0617 0.65257L12.4952 0.100466C12.3351 -0.0555688 12.0395 -0.0315556 11.8547 0.184461L9.88396 2.09294C8.99712 1.72089 8.02422 1.54084 7.00191 1.54084C3.95966 1.55279 1.32412 3.28123 0.0554398 5.76605C-0.0184799 5.92208 -0.0184799 6.11408 0.0554398 6.24611C0.646576 7.42244 1.53341 8.39472 2.64189 9.12687L1.02845 10.7233C0.843701 10.9033 0.819061 11.1914 0.94226 11.3474L1.50877 11.8995C1.66888 12.0556 1.96446 12.0316 2.14921 11.8155L12.963 1.27682C13.197 1.09687 13.2218 0.80862 13.0617 0.65257ZM7.65467 4.27745C7.44529 4.22942 7.22363 4.16944 7.01424 4.16944C5.9673 4.16944 5.12987 4.98567 5.12987 6.00588C5.12987 6.20994 5.17915 6.42596 5.2407 6.63003L4.41541 7.42226C4.16912 7.00219 4.03365 6.53398 4.03365 6.0059C4.03365 4.4095 5.35152 3.12514 6.98959 3.12514C7.53156 3.12514 8.01187 3.25716 8.44291 3.49719L7.65467 4.27745Z"
                                                fill="black" fillOpacity="0.8"/>
                                            <path
                                                d="M13.9485 5.76601C13.5174 4.92575 12.9508 4.1696 12.2488 3.55741L9.95796 5.76601V6.00604C9.95796 7.60244 8.64008 8.8868 7.00201 8.8868H6.75572L5.30239 10.3032C5.84436 10.4112 6.41087 10.4832 6.96511 10.4832C10.0074 10.4832 12.6429 8.75477 13.9116 6.258C14.0224 6.08991 14.0224 5.92206 13.9485 5.76601Z"
                                                fill="black" fillOpacity="0.8"/>
                                        </svg>
                                        <span className="ml-1">Zobraziť</span>
                                    </button>
                                </div>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                       className="border border-custom-dark-blue text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                       required=""/>
                            </div>
                            <div className="flex items-center justify-end">
                                <a href="#"
                                   className="text-fontSize16 font-medium text-primary-600 hover:underline dark:text-primary-500">Zabudli
                                    ste heslo?</a>
                            </div>
                            <button type="submit"
                                    className="w-full text-white text-fontSize24 hover:bg-custom-dark-blue-hover bg-custom-dark-blue hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Prihlásiť
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}