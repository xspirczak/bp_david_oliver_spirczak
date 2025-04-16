import { Link } from "react-router-dom";

export default function About() {
    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200 min-h-screen flex items-center justify-center px-4 py-12">
            <div className="bg-white shadow-lg rounded-3xl lg:rounded-[91px] w-full max-w-4xl p-8 md:p-12 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-custom-dark-blue">O projekte</h2>

                <p className="text-base md:text-lg text-custom-dark-blue">
                    Aplikácia vznikla ako bakalárska práca na tému: <span className="font-medium">Mapovanie šifrovaných textov na šifrovacie kľúče</span>.
                </p>

                <div className="space-y-1 text-custom-dark-blue text-base md:text-lg">
                    <p>
                        <span className="font-medium">Autor:</span> Dávid Oliver Spirczak, FEI STU
                    </p>
                    <p>
                        <span className="font-medium">Vedúci práce:</span> Ing. Stanislav Marochok, FEI STU
                    </p>
                </div>

                <p className="text-base md:text-lg text-custom-dark-blue">
                    Cieľom projektu je <span className="font-semibold">zefektívniť proces dešifrovania historických dokumentov</span>, konkrétne sa zameriava na <span className="font-semibold">nomenklátorové šifry</span>.
                </p>

                <p className="text-base md:text-lg text-custom-dark-blue">
                    V prípade otázok alebo pripomienok nás neváhajte kontaktovať{" "}
                    <Link to="/contact" className="underline font-medium hover:text-custom-dark-blue-hover transition">
                        tu
                    </Link>.
                </p>
            </div>
        </section>
    );
}
