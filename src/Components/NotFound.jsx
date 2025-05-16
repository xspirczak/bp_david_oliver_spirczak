import {NavLink} from "react-router-dom";

export default function NotFound() {
    return (
        <section className="h-screen bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-custom-dark-blue ">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-custom-dark-blue md:text-4xl">Nastala chyba.</p>
                    <p className="mb-4 text-lg font-light text-custom-dark-blue ">Prepáčte, nemašli sme vami hľadanú stránku. Viac nájdete na domovskej stránke. </p>
                    <NavLink to={'/'}
                       className="inline-flex bg-custom-dark-blue text-white font-semibold hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-custom-dark-blue-hover text-fontSize16 rounded-3xl text-sm px-5 py-2.5 text-center dark:focus:ring-custom-dark-blue-hover my-4 hover:bg-custom-dark-blue-hover">Späť
                        na domovskú stránku</NavLink>
                </div>
            </div>
        </section>
    )
}