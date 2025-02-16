import ResetPassword from "../Components/ResetPassword.jsx";

export function ResetPasswordPage({ forgotPassword, setForgotPassword}) {
    return (
        <ResetPassword forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}></ResetPassword>
    )
}