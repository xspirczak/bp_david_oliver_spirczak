import ForgotPassword from "../Components/ForgotPassword.jsx";

export function ForgotPasswordPage({forgotPassword, setForgotPassword}) {
    return (
        <ForgotPassword setForgotPassword={setForgotPassword} forgotPassword={forgotPassword}></ForgotPassword>
    )
}