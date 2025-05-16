import { motion } from "framer-motion";
import ScrollLink from "./ScrollLink.jsx";

export default function TitlePageInfo() {
    return (
        <main className="bg-gradient-to-r from-blue-500 to-cyan-200 text-white text-center py-5 md:py-20 px-4">
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-fontSize48 md:text-fontSize61 font-bold"
            >
                Odomkni minulosť s{" "}
                <span className="text-custom-dark-blue flex justify-center break-all">
                    CipherMatcher
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="mt-4 max-w-xl mx-auto text-fontSize17 sm:px-4 px-10 p-4 text-center"
            >
                Webová aplikácia na mapovanie substitučných šifrovacích kľúčov na šifrované texty,
                navrhnutá na pomoc pri dešifrovaní historických dokumentov.
                Vytvorená ako súčasť bakalárskej práce so zameraním na{" "}
                <span className="font-semibold">nomenklátorové šifry</span>.
            </motion.p>

            <motion.div
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.7, delay: 0.4, ease: "easeOut"}}
                className="grid justify-center mt-6 gap-4 sm:flex"
            >
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}>
                    <ScrollLink
                        to="/about"
                        className="w-full sm:w-1/3 md:w-1/4 xl:w-1/6 text-fontSize20 border-2 border-custom-dark-blue bg-custom-dark-blue px-10 py-2 text-white rounded-full hover:bg-custom-dark-blue-hover hover:border-custom-dark-blue-hover font-semibold transition-all duration-300"
                    >

                        O projekte
                    </ScrollLink>
                </motion.button>
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}>
                    <ScrollLink
                        to="/Tutorial"
                        className="w-full sm:w-1/3 md:w-1/4 xl:w-1/6 text-fontSize20 border-2 border-custom-dark-blue bg-custom-dark-blue px-10 py-2 text-white rounded-full hover:bg-custom-dark-blue-hover hover:border-custom-dark-blue-hover font-semibold transition-all duration-300"
                    >
                        Tutoriál
                    </ScrollLink>
                </motion.button>

            </motion.div>
        </main>
    );
}
