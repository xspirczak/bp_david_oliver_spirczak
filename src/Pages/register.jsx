import RegisterForm from "../Components/RegisterForm.jsx";

export function RegisterPage({validateEmail, validEmail}) {
    return (
        <>
            <RegisterForm validateEmail={validateEmail} validEmail={validEmail}></RegisterForm>
        </>
    )
}