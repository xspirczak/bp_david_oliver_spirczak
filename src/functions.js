export function isStrongPassword (password) {
    // Check the length of the password
    if (password.length < 6) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 6 znakov."}
    }

    // Check whether the password has at least one lower and one upper case letter
    const upper = /[A-Z]/.test(password), lower = /[a-z]/.test(password);

    if (!upper) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 1 veľké písmeno."}
    }

    if (!lower) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 1 malé písmeno."}
    }

    // Check if password contains number
    const hasNumber = /\d/.test(password)

    if (!hasNumber) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 1 číslo."}
    }

    const hasSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);

    if (!hasSpecialChar) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 1 špeciálny znak."}
    }

    return { strong: true, error: ""};
}
