/**
 * @jest-environment jsdom
 */

/* global describe, it, expect, beforeEach */

import {isStrongPassword, checkForDuplicates, normalizeString, togglePasswordVisibility} from '../functions.js';

describe('isStrongPassword', () => {
    it('should fail if password is too short', () => {
        const result = isStrongPassword('Ab1!');
        expect(result.strong).toBe(false);
        expect(result.error).toBe("Heslo musí obsahovať aspoň 6 znakov.");
    });

    it('should fail if no uppercase letter', () => {
        const result = isStrongPassword('ab1!cd');
        expect(result.strong).toBe(false);
        expect(result.error).toBe("Heslo musí obsahovať aspoň 1 veľké písmeno.");
    });

    it('should fail if no lowercase letter', () => {
        const result = isStrongPassword('AB1!CD');
        expect(result.strong).toBe(false);
        expect(result.error).toBe("Heslo musí obsahovať aspoň 1 malé písmeno.");
    });

    it('should fail if no number', () => {
        const result = isStrongPassword('Abc!de');
        expect(result.strong).toBe(false);
        expect(result.error).toBe("Heslo musí obsahovať aspoň 1 číslo.");
    });

    it('should fail if no special character', () => {
        const result = isStrongPassword('Abc123');
        expect(result.strong).toBe(false);
        expect(result.error).toBe("Heslo musí obsahovať aspoň 1 špeciálny znak.");
    });

    it('should pass with a strong password', () => {
        const result = isStrongPassword('Abc123!');
        expect(result.strong).toBe(true);
        expect(result.error).toBe("");
    });

    it('should accept a long strong password with symbols', () => {
        const result = isStrongPassword('A1b2c3!@#');
        expect(result.strong).toBe(true);
        expect(result.error).toBe("");
    });

    it('should fail if password is empty', () => {
        const result = isStrongPassword('');
        expect(result.strong).toBe(false);
        expect(result.error).toBe("Heslo musí obsahovať aspoň 6 znakov.");
    });
});

describe('checkForDuplicates', () => {
    it('should return false for unique codes', () => {
        const key = { A: [1, 2], B: [3, 4] };
        expect(checkForDuplicates(key)).toBe(false);
    });

    it('should return true for duplicate codes', () => {
        const key = { A: [1, 2], B: [2, 3] };
        expect(checkForDuplicates(key)).toBe(true);
    });

    it('should return true for duplicate codes in same code block', () => {
        const key = { A: [1, 1], B: [2, 3] };
        expect(checkForDuplicates(key)).toBe(true);
    });

    it('should handle empty object', () => {
        const key = {};
        expect(checkForDuplicates(key)).toBe(false);
    });

    it('should throw error if input is not object', () => {
        expect(() => checkForDuplicates("notObject")).toThrow();
    });
});

describe('normalizeString', () => {
    it('removes accents from characters', () => {
        expect(normalizeString('áéíóúýčďľňřšťž')).toBe('aeiouycdlnrstz');
    });

    it('returns the same string if there are no accents', () => {
        expect(normalizeString('abcdef')).toBe('abcdef');
    });

    it('handles mixed content correctly', () => {
        expect(normalizeString('Crème brûlée')).toBe('Creme brulee');
    });

    it('works with empty string', () => {
        expect(normalizeString('')).toBe('');
    });

    it('preserves special characters and punctuation', () => {
        expect(normalizeString('Café! Déjà vu?')).toBe('Cafe! Deja vu?');
    });

    it('works with uppercase letters', () => {
        expect(normalizeString('ÁÉÍÓÚ')).toBe('AEIOU');
    });
});


describe('togglePasswordVisibility', () => {
    let input;

    beforeEach(() => {
        document.body.innerHTML = `
            <input id="password" type="password" placeholder="••••••••">
        `;
        input = document.getElementById('password');
    });

    it('should change type from password to text and update placeholder', () => {
        togglePasswordVisibility("password");
        expect(input.type).toBe('text');
        expect(input.placeholder).toBe('vaše heslo');
    });

    it('should change type from text to password and update placeholder', () => {
        input.type = 'text';
        input.placeholder = 'vaše heslo';

        togglePasswordVisibility("password");
        expect(input.type).toBe('password');
        expect(input.placeholder).toBe('••••••••');
    });
});
