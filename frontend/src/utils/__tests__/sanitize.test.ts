import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeInput, isValidEmail, validatePassword } from '../sanitize';

describe('sanitizeHtml', () => {
    it('should escape HTML special characters', () => {
        const input = '<script>alert("xss")</script>';
        const result = sanitizeHtml(input);
        expect(result).not.toContain('<script>');
        expect(result).toContain('&lt;script&gt;');
    });

    it('should handle quotes and ampersands', () => {
        const input = 'Test & "quotes" \'example\'';
        const result = sanitizeHtml(input);
        expect(result).toContain('&amp;');
        expect(result).toContain('&quot;');
    });
});

describe('sanitizeInput', () => {
    it('should remove script tags', () => {
        const input = 'Hello <script>alert("xss")</script> World';
        const result = sanitizeInput(input);
        expect(result).not.toContain('<script>');
    });

    it('should remove event handlers', () => {
        const input = '<div onclick="malicious()">Test</div>';
        const result = sanitizeInput(input);
        expect(result).not.toContain('onclick=');
    });

    it('should trim whitespace', () => {
        const input = '  test  ';
        const result = sanitizeInput(input);
        expect(result).toBe('test');
    });
});

describe('isValidEmail', () => {
    it('should validate correct emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.co.in')).toBe(true);
    });

    it('should reject invalid emails', () => {
        expect(isValidEmail('invalid')).toBe(false);
        expect(isValidEmail('@example.com')).toBe(false);
        expect(isValidEmail('test@')).toBe(false);
    });
});

describe('validatePassword', () => {
    it('should accept strong passwords', () => {
        const result = validatePassword('SecurePass123');
        expect(result.isValid).toBe(true);
    });

    it('should reject short passwords', () => {
        const result = validatePassword('Short1');
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('8 characters');
    });

    it('should require uppercase letters', () => {
        const result = validatePassword('lowercase123');
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('uppercase');
    });

    it('should require numbers', () => {
        const result = validatePassword('NoNumbers');
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('number');
    });
});
