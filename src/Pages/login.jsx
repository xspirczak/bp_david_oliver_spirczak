import LoginForm from "../Components/LoginForm.jsx";

export function LoginPage({isLoggedIn, setIsLoggedIn, setUser, validateEmail, decodeJWT}) {
    return (
        <>
            <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} validateEmail={validateEmail} decodeJWT={decodeJWT} ></LoginForm>
        </>
    )
}