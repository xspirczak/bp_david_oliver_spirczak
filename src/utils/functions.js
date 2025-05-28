export function isStrongPassword (password) {
    // Skontroluje dĺžku hesla
    if (password.length < 6) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 6 znakov."}
    }

    // Skontroluje, či heslo obsahuje aspoň jedno malé a jedno veľké písmeno
    const upper = /[A-Z]/.test(password), lower = /[a-z]/.test(password);

    if (!upper) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 1 veľké písmeno."}
    }

    if (!lower) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 1 malé písmeno."}
    }

    // Skontroluje, či heslo obsahuje číslo
    const hasNumber = /\d/.test(password)

    if (!hasNumber) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 1 číslo."}
    }

    // Skontroluje, či heslo obsahuje špeciálny znak
    const hasSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);

    if (!hasSpecialChar) {
        return {strong: false, error: "Heslo musí obsahovať aspoň 1 špeciálny znak."}
    }

    return { strong: true, error: ""};
}

// Skontroluje, či existujú duplicitné kódy v objekte @returns false, ak žiadne neexistujú
export const checkForDuplicates = (keyObject) => {
    if (typeof keyObject !== 'object' || keyObject === null || Array.isArray(keyObject)) {
        throw new Error('Vstup musí byť validný objekt.');
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

// Normalizuje reťazec odstránením diakritiky
export function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Prepína viditeľnosť hesla
export function togglePasswordVisibility(id) {
    let e = document.getElementById(id)

    if (e.type === "password") {
        e.type = "text"
        e.placeholder = "vaše heslo"
    } else {
        e.type = "password"
        e.placeholder = "••••••••"
    }
}
