import { HiOutlineMail, HiOutlineUser, HiOutlineAcademicCap } from 'react-icons/hi';
import {motion} from "framer-motion";

export default function Contact() {
    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200 min-h-screen flex justify-center px-4 py-12">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className="bg-white shadow-2xl rounded-3xl w-full md:w-2/3 lg:w-1/2 max-w-4xl p-8 md:p-12 space-y-8 h-fit">
                <h2 className="text-4xl font-bold text-custom-dark-blue flex items-center gap-3 item">
                    <HiOutlineMail className="text-4xl text-custom-light-blue" />
                    Kontakt
                </h2>

                <p className="text-lg font-light text-custom-dark-blue">
                    V prípade otázok alebo pripomienok nás neváhajte kontaktovať.
                </p>

                <div className="space-y-4 text-custom-dark-blue text-base md:text-lg">
                    <div className="flex items-center gap-3">
                        <HiOutlineUser className="text-xl text-custom-light-blue" />
                        <span className="font-semibold">Dávid Oliver Spirczak</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <HiOutlineAcademicCap className="text-xl text-custom-light-blue" />
                        <span>FEI STU</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <HiOutlineMail className="text-xl text-custom-light-blue" />
                        <a
                            href="mailto:xspirczak@stuba.sk"
                            className="underline hover:text-custom-dark-blue-hover transition"
                        >
                            xspirczak@stuba.sk
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <HiOutlineMail className="text-xl text-custom-light-blue" />
                        <a
                            href="mailto:oliverspirczak@gmail.com"
                            className="underline hover:text-custom-dark-blue-hover transition"
                        >
                            oliverspirczak@gmail.com
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
