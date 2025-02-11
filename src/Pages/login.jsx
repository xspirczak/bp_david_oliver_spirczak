import LoginForm from "../Components/LoginForm.jsx";

export function LoginPage({isLoggedIn, setIsLoggedIn, setUser, validateEmail }) {
    return (
        <>
            <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} validateEmail={validateEmail}></LoginForm>
        </>
    )
}