import { Link } from "react-router-dom";
import {
    HiOutlineInformationCircle,
    HiOutlineUser,
    HiOutlineAcademicCap,
    HiOutlineArrowRight
} from "react-icons/hi";
import {motion} from "framer-motion";
import ScrollLink from "./ScrollLink.jsx";

export default function About() {
    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200 min-h-screen flex justify-center px-4 py-12">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className="bg-white shadow-2xl rounded-3xl w-full md:w-2/3 lg:w-1/2 max-w-4xl p-8 md:p-12 space-y-8 h-fit">
                <h2 className="text-4xl font-bold text-custom-dark-blue flex items-center gap-3">
                    <HiOutlineInformationCircle className="text-4xl text-custom-light-blue"/>
                    O projekte
                </h2>

                <p className="text-lg text-custom-dark-blue">
                    Aplikácia vznikla ako bakalárska práca na tému:{" "}
                    <span className="font-semibold">Mapovanie šifrovaných textov na šifrovacie kľúče</span>.
                </p>

                <div className="space-y-3 text-custom-dark-blue text-base md:text-lg">
                    <div className="flex items-center gap-3">
                        <HiOutlineUser className="text-xl text-custom-light-blue"/>
                        <span><strong>Autor:</strong> Dávid Oliver Spirczak, FEI STU</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <HiOutlineAcademicCap className="text-xl text-custom-light-blue"/>
                        <span><strong>Vedúci práce:</strong> Ing. Stanislav Marochok, FEI STU</span>
                    </div>
                </div>

                <p className="text-lg text-custom-dark-blue">
                    Cieľom projektu je{" "}
                    <span className="font-semibold">zefektívniť proces dešifrovania historických dokumentov</span>,
                    konkrétne sa zameriava na{" "}
                    <span className="font-semibold">nomenklátorové šifry</span>.
                </p>

                <p className="text-lg text-custom-dark-blue flex items-start gap-2">
                    <HiOutlineArrowRight className="text-xl text-custom-light-blue mt-1"/>
                    <span>
        V prípade otázok alebo pripomienok nás neváhajte kontaktovať{" "}
                        <ScrollLink
                            to="/contact"
                            className="underline font-medium hover:text-custom-dark-blue-hover transition"
                        >
            tu
        </ScrollLink>.
    </span>
                </p>
            </motion.div>
        </section>
    );
}
