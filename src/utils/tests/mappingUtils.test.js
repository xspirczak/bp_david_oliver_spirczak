/* global describe, it, expect */
import { decrypt, calculateCodebookMatches, calculateFrequencyScore } from '../mappingUtils.js';
describe('decrypt', () => {
    it('should decrypt a single code correctly', () => {
        const ciphertext = "#1";
        const key = { A: [1] };
        expect(decrypt(ciphertext, key)).toBe("A");
    });

    it('should decrypt multiple codes in one word', () => {
        const ciphertext = "#1#2";
        const key = { A: [1], B: [2] };
        expect(decrypt(ciphertext, key)).toBe("AB");
    });

    it('should decrypt multiple words with codes', () => {
        const ciphertext = "#1 #2";
        const key = { A: [1], B: [2] };
        expect(decrypt(ciphertext, key)).toBe("A B");
    });

    it('should retain unknown codes if not in key', () => {
        const ciphertext = "#3";
        const key = { A: [1], B: [2] };
        expect(decrypt(ciphertext, key)).toBe("#3");
    });

    it('should mix plaintext and codes correctly', () => {
        const ciphertext = "test#1ing";
        const key = { A: [1] };
        expect(decrypt(ciphertext, key)).toBe("testAing");
    });

    it('should return empty string for empty input', () => {
        const ciphertext = "";
        const key = { A: [1] };
        expect(decrypt(ciphertext, key)).toBe("");
    });

    it('should ignore whitespace around ciphertext', () => {
        const ciphertext = "   #1   ";
        const key = { A: [1] };
        expect(decrypt(ciphertext, key)).toBe("A");
    });

    it('should work with empty key (no decryption)', () => {
        const ciphertext = "#1 test #2";
        const key = {};
        expect(decrypt(ciphertext, key)).toBe("#1 test #2");
    });

    it('should work with plain text only (no codes)', () => {
        const ciphertext = "hello world";
        const key = { A: [1], B: [2] };
        expect(decrypt(ciphertext, key)).toBe("hello world");
    });
});

describe ( 'calculateCodebookMatches', () => {
    it('should return 1 when all codes match', () => {
        const ciphertext = "#1 #2";
        const key = { A: [1], B: [2] };
        expect(calculateCodebookMatches(ciphertext, key)).toBe(1);
    });

    it('should return 0 when no codes match', () => {
        const ciphertext = "#3 #4";
        const key = { A: [1], B: [2] };
        expect(calculateCodebookMatches(ciphertext, key)).toBe(0);
    });

    it('should return correct ratio for partial match', () => {
        const ciphertext = "#1 #3";
        const key = { A: [1], B: [2] };
        expect(calculateCodebookMatches(ciphertext, key)).toBeCloseTo(0.5);
    });

    it('should return 0 for empty ciphertext', () => {
        const ciphertext = "";
        const key = { A: [1], B: [2] };
        expect(calculateCodebookMatches(ciphertext, key)).toBe(0);
    });

    it('should return 0 for ciphertext with no codes', () => {
        const ciphertext = "hello world";
        const key = { A: [1], B: [2] };
        expect(calculateCodebookMatches(ciphertext, key)).toBe(0);
    });

    it('should handle duplicate codes in ciphertext', () => {
        const ciphertext = "#1 #1 #2";
        const key = { A: [1], B: [2] };
        expect(calculateCodebookMatches(ciphertext, key)).toBeCloseTo(1); // all codes match
    });

    it('should handle malformed codes gracefully', () => {
        const ciphertext = "#abc #2";
        const key = { A: [2] };
        expect(calculateCodebookMatches(ciphertext, key)).toBeCloseTo(0.5);
    });

    it('should handle numbers as strings in key', () => {
        const ciphertext = "#1 #2";
        const key = { A: ["1", "2"].map(Number) }; // string -> number
        expect(calculateCodebookMatches(ciphertext, key)).toBe(1);
    });

    it('should return 0 if totalCodes is 0 (no valid codes)', () => {
        const ciphertext = "#abc";
        const key = { A: [1] };
        expect(calculateCodebookMatches(ciphertext, key)).toBe(0);
    });
});

describe('calculateFrequencyScore', () => {
    it('returns 1 for perfectly matching English frequency text', () => {
        const plaintext = 'eeeeeeeeeeeeeeeeeeeeaaaaaaaabbbbbcccccccdddddd';
        const score = calculateFrequencyScore(plaintext, 'english');
        expect(score).toBeGreaterThan(0.6);
    });

    it('returns a lower score for poorly matching text', () => {
        const plaintext = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
        const score = calculateFrequencyScore(plaintext, 'english');
        expect(score).toBeLessThan(0.5);
    });

    it('defaults to English if no language is provided', () => {
        const plaintext = 'hello world';
        const score = calculateFrequencyScore(plaintext);
        expect(typeof score).toBe('number');
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
    });

    it('uses specified language frequencies if available', () => {
        const plaintext = 'aaaabbbbccccddddeeee';
        const score = calculateFrequencyScore(plaintext, 'gernam');
        expect(typeof score).toBe('number');
    });

    it('falls back to English if unknown language is given', () => {
        const plaintext = 'aaaabbbbccccddddeeee';
        const score = calculateFrequencyScore(plaintext, 'slovak');
        const fallbackScore = calculateFrequencyScore(plaintext);
        expect(score).toEqual(fallbackScore);
    });

    it('returns 1 for empty text (normalized edge case)', () => {
        const score = calculateFrequencyScore('', 'english');
        expect(score).toBeCloseTo(0);
    });

    it('ignores non-alphabetic characters', () => {
        const plaintext = '1234!@#$%^&*()_+=';
        const score = calculateFrequencyScore(plaintext);
        expect(score).toBeCloseTo(0);
    });
});
