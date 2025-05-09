import { FaShieldAlt, FaUser, FaDatabase } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import {Link} from "react-router-dom";

export default function Privacy() {
    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200 min-h-screen flex justify-center px-4 py-12">
            <div className="bg-white shadow-xl rounded-3xl w-full md:w-3/4 max-w-5xl p-8 md:p-14 space-y-8 h-fit">
            <div className="flex items-center space-x-4">
                    <FaShieldAlt className="text-custom-light-blue w-8 h-8" />
                    <h2 className="text-3xl md:text-4xl font-bold text-custom-dark-blue">
                        Zásady ochrany osobných údajov
                    </h2>
                </div>

                <div className="space-y-4 text-lg text-gray-800">
                    <div className="flex items-start gap-3">
                        <FaUser className="text-custom-light-blue mt-1 w-6 h-6" />
                        <p>
                            Aplikácia zhromažďuje vaše osobné údaje ako <strong>meno a email</strong> výhradne na účely autentifikácie a personalizácie.
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <FaDatabase className="text-custom-light-blue mt-1 w-6 h-6" />
                        <p>
                            Tieto údaje sú uložené iba <strong>lokálne vo vašom prehliadači</strong> pomocou <code>localStorage</code> a nie sú zdieľané s tretími stranami.
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <MdInfoOutline className="text-custom-light-blue mt-1 w-6 h-6" />
                        <p>
                            Používaním tejto aplikácie <strong>vyjadrujete súhlas</strong> s týmto spôsobom spracovania údajov.
                        </p>
                    </div>
                </div>

                <p className="text-sm text-gray-500 pt-4 border-t">
                    V prípade otázok ohľadom súkromia nás môžete kontaktovať <Link to="/contact" className="underline font-medium hover:text-custom-dark-blue-hover transition">tu </Link>.
                </p>
            </div>
        </section>
    );
}
