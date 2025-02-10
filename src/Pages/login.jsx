import LoginForm from "../Components/LoginForm.jsx";

export function LoginPage({setIsLoggedIn, setUser}) {
    return (
        <>
            <LoginForm setIsLoggedIn={setIsLoggedIn} setUser={setUser}></LoginForm>
        </>
    )
}