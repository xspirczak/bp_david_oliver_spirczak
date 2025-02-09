import { CiEdit } from "react-icons/ci";

export default function Profile() {
    const profileData = {
        firstName: "Dávid Oliver",
        lastName: "Spirczak",
        role: "administrator",
        email : "oliverspirczak@gmail.com",
        password : "myPasswrod123"
    }

    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="flex items-center justify-center h-screen">
                <div className="bg-white lg:rounded-91 rounded-3xl shadow lg:w-3/5 w-5/6 lg:px-20 px-6 lg:py-10 py-6">
                    <div className="sm:flex grid sm:gap-10 gap-2 border border-gray-200 rounded-3xl sm:p-6 p-3">
                        <img src="https://picsum.photos/200/200" alt="profilePhoto" className="rounded-3xl md:w-[200px] md:h-[200px] w-[100px] h-[100px]"></img>
                        <div className="mt-4" id="titleInfo">
                            <p className="md:text-fontSize28 text-fontSize20 font-bold text-custom-dark-blue">{profileData.firstName + " " + profileData.lastName}</p>
                            <p className="md:text-fontSize20 text-fontSize16 font-semibold text-custom-dark-blue">{profileData.email}</p>
                            <p className="md:text-fontSize16 text-fontSize12 font-light text-custom-dark-blue">{profileData.role}</p>
                        </div>
                    </div>
                    <div className="grid gap-6 border border-gray-200 rounded-3xl sm:p-6 p-3 mt-6">
                        <div className="flex justify-between">
                            <h3 className="text-fontSize20 font-bold text-custom-dark-blue">Osobné informácie</h3>
                            <div className="relative group">
                                <button type="button"
                                        className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                    <CiEdit/></button>
                                <span
                                    className="absolute bottom-1/2 left-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    id="tooltipBtnEdit">
                            Upraviť
                            </span>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                            <div>
                                <p className="font-light text-fontSize16 text-custom-dark-blue">Krstné meno</p>
                                <p className="font-semibold text-fontSize16 text-custom-dark-blue">{profileData.firstName}</p>
                            </div>
                            <div>
                                <p className="font-light text-fontSize16 text-custom-dark-blue">Emailová adresa</p>
                                <p className="font-semibold text-fontSize16 text-custom-dark-blue">{profileData.email}</p>
                            </div>

                            <div>
                                <p className="font-light text-fontSize16 text-custom-dark-blue">Priezvisko</p>
                                <p className="font-semibold text-fontSize16 text-custom-dark-blue">{profileData.lastName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}