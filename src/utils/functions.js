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

// Checks if there are code duplicates in key @returns false is there are none
export const checkForDuplicates = (keyObject) => {
    if (typeof keyObject !== 'object' || keyObject === null || Array.isArray(keyObject)) {
        throw new Error('Input must be a valid object.');
    }

    const codes = new Set();
    let totalCount = 0;

    Object.values(keyObject).forEach(codeList => {
        if (!Array.isArray(codeList)) return;
        codeList.forEach(code => {
            codes.add(code);
            totalCount++;
        });
    });

    return codes.size !== totalCount;
};

export function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function togglePasswordVisibility() {
    let e = document.getElementById("password")

    if (e.type === "password") {
        e.type = "text"
        e.placeholder = "vaše heslo"
    } else {
        e.type = "password"
        e.placeholder = "••••••••"
    }
}
