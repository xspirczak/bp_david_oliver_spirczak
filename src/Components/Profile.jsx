import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDone } from "react-icons/md";
import { IoSendOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";


export default function Profile({setUser}) {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successEmail, setSuccessEmail] = useState(null);
    const [successPassword, setSuccessPassword] = useState(null);

    const [editingField, setEditingField] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

    const [newEmail, setNewEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [showVerificationInput, setShowVerificationInput] = useState(false);


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
                body: JSON.stringify({ firstName: updatedFirstName.trim() , lastName: updatedLastName.trim() }),
            });

            if (!response.ok) throw new Error("Failed to update name");


            const updatedUser = await response.json();
            setProfileData(updatedUser.user);

            localStorage.setItem("token", updatedUser.token);

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
    };

    useEffect(() => {
        if (successPassword) {
            const timer = setTimeout(() => {
                setSuccessPassword(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [successPassword]);

    useEffect(() => {
        if (successEmail && successEmail === "Email bol úspešne zmenený.") {
            const timer = setTimeout(() => {
                setSuccessEmail(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [successEmail]);

    const changePassword = async () => {
        setSuccessPassword(null);
        setError(null);

        if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setError("Na zmenu hesla je potrebné vyplniť všetky polia.")
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Heslá sa nezhodujú')
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
            if (!response.ok) {
                setError(data.error);
            } else {
                setSuccessPassword("Heslo bolo zmenené.");
                setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setEditingField(null);
            }

       } catch (error) {
            setError(error.message);
        }
    };


    const sendVerificationEmail = async () => {
        setError(null);
        setSuccessEmail(null);

        if (!newEmail) {
            setError("Zadajte nový email");
            return;
        }

        const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (!newEmail.match(isValidEmail)) {
            setError("Email je v zlom formáte (meno@doména.sk).");
            return;
        }

        //console.log(newEmail)
        try {
            const response = await fetch("http://localhost:3000/api/auth/request-email-change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ newEmail })
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                setSuccessEmail(data.message);
                setShowVerificationInput(true);
            }
        } catch (error) {
            setError("Chyba pri odosielaní požiadavky.");
        }
    };

    const verifyCodeAndChangeEmail = async () => {
        setError(null);
        setSuccessEmail(null);

        if (!verificationCode) {
            setError("Zadajte overovací kód.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/verify-email-change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ newEmail, verificationCode })
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                setSuccessEmail("Email bol úspešne zmenený.");
                //console.log(data.token)

                // Change the token
                localStorage.setItem("token", data.token);
                setEditingField(null);
                setShowVerificationInput(false);
                setUser(newEmail);

                // Update profileData with the new email
                setProfileData((prevData) => ({
                    ...prevData,
                    email: newEmail,
                }));
            }
        } catch (error) {
            setError("Chyba pri overovaní kódu.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-cyan-200">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }
   return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200 min-h-screen">

            <div className="flex items-center justify-center">
                <div className="bg-white lg:rounded-91 rounded-3xl shadow lg:w-3/5 w-5/6 lg:px-20 px-6 lg:py-10 py-6 my-10">
                    <div className="sm:flex grid sm:gap-10 gap-2 border border-gray-200 rounded-3xl sm:p-6 p-3">
                        <img src={"https://picsum.photos/200/200"}
                             alt="profilePhoto"
                             className="rounded-3xl md:w-[200px] md:h-[200px] w-[100px] h-[100px]"/>
                        <div className="mt-4" id="titleInfo">
                            <p className="md:text-fontSize28 text-fontSize20 font-bold text-custom-dark-blue break-after-all">
                                {profileData.firstName + " "} {profileData.lastName}
                            </p>
                            <p className="md:text-fontSize20 text-fontSize16 font-semibold text-custom-dark-blue break-all">
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
                        <hr className="h-px bg-gray-200 rounded border-0 "/>
                        <div className="flex">

                            {editingField === "email" && !showVerificationInput ?  (
                                <>
                                    <div className="sm:flex grid w-full">
                                        <div className="lg:w-1/2 w-full">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue">Zadajte nový
                                                email</p>
                                            <input
                                                type="email"
                                                name="newEmail"
                                                className="font-semibold text-fontSize16 text-custom-dark-blue border border-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue py-1 px-2 md:w-2/3 mb-3"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                            />
                                        </div>

                                    </div>
                                    <div className="lg:flex grid">
                                        <div className="relative group items-center flex">
                                            <button type="button" onClick={sendVerificationEmail}
                                                    className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                                <IoSendOutline/>
                                            </button>
                                            <span
                                                className="absolute right-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Poslať overovací kód
                                                </span>
                                        </div>
                                        <div className="relative group items-center flex">
                                            <button type="button" onClick={() =>  {setEditingField(null);
                                                setError(null);
                                                setNewEmail(null);
                                            }}
                                                    className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                                <IoMdClose />
                                            </button>
                                            <span
                                                className="absolute bottom-1/2 left-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Zavrieť
                                                </span>
                                        </div>
                                    </div>
                                </>
                            ) : !showVerificationInput ?
                                (
                                    <>
                                        <div className="sm:flex grid w-full">
                                            <div className="w-1/2">
                                                <p className="font-light text-fontSize16 text-custom-dark-blue">Email</p>
                                                <p className="font-semibold text-fontSize16 text-custom-dark-blue break-all">{profileData.email}</p>
                                            </div>

                                        </div>
                                        <div className="relative group items-center flex">
                                            <button type="button" onClick={() => setEditingField("email")}
                                                    className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                        <CiEdit/>
                                        </button>
                                        <span
                                            className="absolute bottom-1/2 left-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                Zmeniť email
                                            </span>
                                    </div>
                                </>
                            ) : <> </>}

                            {showVerificationInput && (
                                <>
                                    <div className="sm:flex grid w-full">
                                        <div className="lg:w-1/2 w-full">
                                            <p className="font-light text-fontSize16 text-custom-dark-blue mt-4">Zadajte
                                                overovací kód</p>
                                            <input
                                                type="text"
                                                name="verificationCode"
                                                className="font-semibold text-fontSize16 text-custom-dark-blue border border-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue py-1 px-2 md:w-1/2 w-2/3 mb-3"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="lg:flex grid">
                                    <div className="relative group items-center flex">
                                        <button type="button" onClick={verifyCodeAndChangeEmail}
                                                className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                            <MdDone/>
                                        </button>
                                        <span
                                            className="absolute right-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        Potvrdiť overovací kód
                                    </span>
                                    </div>
                                    <div className="relative group items-center flex">
                                        <button type="button" onClick={() => {
                                            setEditingField('');
                                            setShowVerificationInput(false);
                                            setVerificationCode('');
                                            setError('');
                                            setNewEmail('');
                                            setSuccessEmail('');
                                        }}
                                                className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                            <IoMdClose/>
                                        </button>
                                        <span
                                            className="absolute bottom-1/2 left-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                Zavrieť
                                            </span>
                                    </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {error && editingField === "email" ? (
                            <p className="text-center text-fontSize16 font-semibold text-red-500">{error}</p>
                        ) : successEmail ? (
                            <p className="text-center text-fontSize16 font-semibold text-green-500">{successEmail}</p>
                        ) : <></>
                        }

                        <hr className="h-px bg-gray-200 rounded border-0 "/>

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
                                    <div className="lg:flex grid gap-y-0">
                                        <div className="relative group items-center flex">
                                            <button type="button" onClick={changePassword}
                                                    className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                                <MdDone/>
                                            </button>
                                            <span
                                                className="absolute right-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Potvrdiť zmeny
                                            </span>
                                        </div>
                                        <div className="relative group items-center flex">
                                            <button type="button" onClick={() => {
                                                setEditingField('');
                                                setError('');
                                                setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
                                            }}
                                                    className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3">
                                                <IoMdClose/>
                                            </button>
                                            <span
                                                className="absolute bottom-1/2 left-full ml-2 px-2 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Zavrieť
                                                </span>
                                        </div>
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
                            {error && editingField === "password" ? (
                                <p className="text-center text-fontSize16 font-semibold text-red-500">{error}</p>
                            ) : successPassword ? (
                                <p className="text-center text-fontSize16 font-semibold text-green-500">{successPassword}</p>
                            ) : <></>
                            }
                        </div>
                    </div>
                </div>
        </section>
    )
}
