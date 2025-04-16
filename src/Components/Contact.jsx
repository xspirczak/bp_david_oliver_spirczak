export default function Contact() {
    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200 min-h-screen flex items-center justify-center px-4 py-12">
            <div className="bg-white shadow-lg rounded-3xl lg:rounded-[91px] w-full max-w-4xl p-8 md:p-12 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-custom-dark-blue">Kontakt</h2>

                <p className="text-base md:text-lg font-light text-custom-dark-blue">
                    V prípade otázok alebo pripomienok nás neváhajte kontaktovať.
                </p>

                <div className="space-y-2 text-custom-dark-blue text-base md:text-lg">
                    <p className="font-semibold">Dávid Oliver Spirczak, FEI STU</p>
                    <p>
                        Školský e-mail:{" "}
                        <a
                            href="mailto:xspirczak@stuba.sk"
                            className="text-custom-dark-blue underline hover:text-custom-dark-blue-hover transition"
                        >
                            xspirczak@stuba.sk
                        </a>
                    </p>
                    <p>
                        Osobný e-mail:{" "}
                        <a
                            href="mailto:oliverspirczak@gmail.com"
                            className="text-custom-dark-blue underline hover:text-custom-dark-blue-hover transition"
                        >
                            oliverspirczak@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
