import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDone } from "react-icons/md";

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingField, setEditingField] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Get user ID from localStorage or authentication context
                const token = localStorage.getItem("token"); // Assuming you store a token after login

                if (!token) {
                    throw new Error("User not logged in");
                }

                // Fetch user data
                const response = await fetch("http://localhost:3000/api/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // If your API requires authentication
                    },
                });

                console.log(response)

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const updateName = async () => {

        // Ensure we always send both firstName and lastName
        const updatedFirstName = firstName || profileData.firstName;
        const updatedLastName = lastName || profileData.lastName;

        // If user does not change values
        if (updatedFirstName === profileData.firstName && updatedLastName === profileData.lastName) {
            setEditingField(null);
            return;
        }

        try {

            const response = await fetch("http://localhost:3000/api/users/update-name", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ firstName: updatedFirstName , lastName: updatedLastName }),
            });

            if (!response.ok) throw new Error("Failed to update name");

            const updatedUser = await response.json();
            setProfileData(updatedUser.user);
            setEditingField(null);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswords(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

        console.log("PASSWORDS:", passwords)
    };

    const changePassword = async () => {
        if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setEditingField(null);
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/users/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            alert("Password changed successfully!");
        } catch (error) {
            alert(error.message);
        }
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="flex items-center justify-center h-screen">
                <div className="bg-white lg:rounded-91 rounded-3xl shadow lg:w-3/5 w-5/6 lg:px-20 px-6 lg:py-10 py-6">
                    <div className="sm:flex grid sm:gap-10 gap-2 border border-gray-200 rounded-3xl sm:p-6 p-3">
                        <img src={"https://picsum.photos/200/200"}
                             alt="profilePhoto"
                             className="rounded-3xl md:w-[200px] md:h-[200px] w-[100px] h-[100px]"/>
                        <div className="mt-4" id="titleInfo">
                            <p className="md:text-fontSize28 text-fontSize20 font-bold text-custom-dark-blue">
                                {profileData.firstName} {profileData.lastName}
                            </p>
                            <p className="md:text-fontSize20 text-fontSize16 font-semibold text-custom-dark-blue">
                                {profileData.email}
                            </p>
                            <p className="md:text-fontSize16 text-fontSize12 font-light text-custom-dark-blue">
                                {profileData.role === 'user' ? ('používateľ') : ('administrátor')}
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-6 border border-gray-200 rounded-3xl sm:p-6 p-3 mt-6">
                        <h3 className="text-fontSize20 font-bold text-custom-dark-blue">Osobné informácie</h3>
                        <div className="flex">
                            {editingField === "name" ? (
                                <>
                                    <div className="sm:flex grid w-full">
                                        <div className="lg:w-1/2 w-full mb-2 md:mb-0">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue">Krstné
                                                meno</p>
                                            <input type="text"
                                                   className="font-semibold text-fontSize16 text-custom-dark-blue  border border-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue py-1 px-2 md:w-1/2 w-2/3 "
                                                   value={firstName !== null ? firstName : profileData.firstName}
                                                   onChange={(e) => setFirstName(e.target.value)}></input>
                                        </div>
                                        <div className="lg:w-1/2 w-full">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue">Priezvisko</p>
                                            <input type="text"
                                                   className="font-semibold text-fontSize16 text-custom-dark-blue border border-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue py-1 px-2 md:w-1/2 w-2/3 mb-3"
                                                   value={lastName !== null ? lastName : profileData.lastName}
                                                   onChange={(e) => setLastName(e.target.value)}></input>
                                        </div>
                                    </div>
                                    <div className="relative group items-center flex">
                                        <button type="button" onClick={updateName}
                                                className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                            <MdDone/>
                                        </button>
                                        <span
                                            className="absolute bottom-1/2 left-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                Potvrdiť zmeny
                                            </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="sm:flex grid w-full">
                                        <div className="w-1/2">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue">Krstné
                                                meno</p>
                                            <p className="font-semibold text-fontSize16 text-custom-dark-blue">{profileData.firstName}</p>
                                        </div>
                                        <div className="w-1/2">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue">Priezvisko</p>
                                            <p className="font-semibold text-fontSize16 text-custom-dark-blue">{profileData.lastName}</p>
                                        </div>

                                    </div>
                                    <div className="relative group items-center flex">
                                        <button type="button" onClick={() => setEditingField("name")}
                                                className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                            <CiEdit/>
                                        </button>
                                        <span
                                            className="absolute bottom-1/2 left-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                Upraviť meno
                                            </span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex">
                            {editingField === "password" ? (
                                <>
                                    <div className="sm:flex grid w-full">
                                        <div className="lg:w-1/2 w-full">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue">Staré
                                                heslo</p>
                                            <input type="password"
                                                   name="oldPassword"
                                                   className="font-semibold text-fontSize16 text-custom-dark-blue border border-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue py-1 px-2 md:w-1/2 w-2/3 mb-3"
                                                   value={passwords.oldPassword}
                                                   onChange={handlePasswordChange}></input>
                                        </div>
                                        <div className="lg:w-1/2 w-full">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue">Nové
                                                heslo</p>
                                            <input type="password"
                                                   name="newPassword"
                                                   className="font-semibold text-fontSize16 text-custom-dark-blue border border-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue py-1 px-2 md:w-1/2 w-2/3 mb-3"
                                                   value={passwords.newPassword}
                                                   onChange={handlePasswordChange}></input>
                                        </div>
                                        <div className="lg:w-1/2 w-full">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue">Opakované
                                                heslo</p>
                                            <input type="password"
                                                   name="confirmPassword"
                                                   className="font-semibold text-fontSize16 text-custom-dark-blue border border-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue py-1 px-2 md:w-1/2 w-2/3 mb-3"
                                                   value={passwords.confirmPassword}
                                                   onChange={handlePasswordChange}></input>
                                        </div>

                                    </div>
                                    <div className="relative group items-center flex">
                                        <button type="button" onClick={changePassword}
                                                className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                            <MdDone/>
                                        </button>
                                        <span
                                            className="absolute bottom-1/2 left-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Potvrdiť zmeny
                                                </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="sm:flex grid w-full">
                                        <div className="w-1/2">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue">Vašé
                                                heslo</p>
                                            <p className="font-semibold text-fontSize16 text-custom-dark-blue">••••••••</p>
                                        </div>

                                    </div>
                                    <div className="relative group items-center flex">
                                        <button type="button" onClick={() => setEditingField("password")}
                                                className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                            <CiEdit/>
                                        </button>
                                        <span
                                            className="absolute bottom-1/2 left-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                Zmeniť heslo
                                            </span>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
