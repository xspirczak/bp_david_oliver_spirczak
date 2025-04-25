import {Link} from "react-router-dom";

export default function Footer() {
    return (

        <footer className="bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <span
                            className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">CipherMatcher</span>
                    </Link>

                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white">
                        <li>
                            <Link to="/about" className="hover:underline me-4 md:me-6">O projekte</Link>
                        </li>
                        <li>
                            <Link to="/tutorial" className="hover:underline me-4 md:me-6">Tutoriál</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:underline me-4 md:me-6">Kontakt</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-white sm:mx-auto lg:my-8"/>

                <span className="block text-sm text-white sm:text-center">© 2025  <Link to="/" className="hover:underline">CipherMatcher
                </Link>. All Rights Reserved.</span>

            </div>
        </footer>


    )
}