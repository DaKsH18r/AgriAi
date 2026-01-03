import { describe, it, expect } from 'vitest';
import { validateLoginForm, validateRegisterForm, validateField } from '../validation';

describe('validateLoginForm', () => {
    it('should validate correct login data', () => {
        const result = validateLoginForm('test@example.com', 'password123');
        expect(result.isValid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should reject invalid email', () => {
        const result = validateLoginForm('invalid-email', 'password123');
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBeDefined();
    });

    it('should reject short password', () => {
        const result = validateLoginForm('test@example.com', '123');
        expect(result.isValid).toBe(false);
        expect(result.errors.password).toBeDefined();
    });

    it('should require both fields', () => {
        const result = validateLoginForm('', '');
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBeDefined();
        expect(result.errors.password).toBeDefined();
    });
});

describe('validateRegisterForm', () => {
    it('should validate correct registration data', () => {
        const result = validateRegisterForm({
            email: 'test@example.com',
            password: 'SecurePass123',
        });
        expect(result.isValid).toBe(true);
    });

    it('should enforce password requirements', () => {
        const result = validateRegisterForm({
            email: 'test@example.com',
            password: 'weak',
        });
        expect(result.isValid).toBe(false);
        expect(result.errors.password).toBeDefined();
    });

    it('should check password confirmation match', () => {
        const result = validateRegisterForm({
            email: 'test@example.com',
            password: 'SecurePass123',
            confirmPassword: 'DifferentPass123',
        });
        expect(result.isValid).toBe(false);
        expect(result.errors.confirmPassword).toBeDefined();
    });
});

describe('validateField', () => {
    it('should validate required fields', () => {
        const result = validateField('', { required: true });
        expect(result).toBeTruthy();
    });

    it('should validate min length', () => {
        const result = validateField('abc', { minLength: 5 });
        expect(result).toContain('Minimum 5 characters');
    });

    it('should validate pattern', () => {
        const result = validateField('invalid', { pattern: /^\d+$/ });
        expect(result).toBe('Invalid format');
    });

    it('should return null for valid input', () => {
        const result = validateField('test@example.com', {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        });
        expect(result).toBeNull();
    });
});
