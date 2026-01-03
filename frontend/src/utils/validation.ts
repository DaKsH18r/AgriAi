/**
 * Form Validation Utilities
 * Client-side validation for all forms
 */

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

/**
 * Validates login form
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email format';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Validates registration form
 */
export function validateRegisterForm(data: {
    email: string;
    password: string;
    confirmPassword?: string;
}): ValidationResult {
    const errors: Record<string, string> = {};

    // Email validation
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    // Password validation
    if (!data.password) {
        errors.password = 'Password is required';
    } else {
        if (data.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(data.password)) {
            errors.password = 'Password must contain an uppercase letter';
        } else if (!/[0-9]/.test(data.password)) {
            errors.password = 'Password must contain a number';
        }
    }

    // Confirm password
    if (data.confirmPassword && data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Validates profile form
 */
export function validateProfileForm(data: {
    fullName?: string;
    phone?: string;
    location?: string;
}): ValidationResult {
    const errors: Record<string, string> = {};

    if (data.phone && !/^\+?[0-9\s-()]{10,}$/.test(data.phone)) {
        errors.phone = 'Invalid phone number format';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Generic field validator
 */
export function validateField(
    value: unknown,
    rules: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (val: unknown) => boolean;
    }
): string | null {
    if (rules.required && !value) {
        return 'This field is required';
    }

    if (value && typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
            return `Minimum ${rules.minLength} characters required`;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
            return `Maximum ${rules.maxLength} characters allowed`;
        }
        if (rules.pattern && !rules.pattern.test(value)) {
            return 'Invalid format';
        }
    }

    if (rules.custom && !rules.custom(value)) {
        return 'Invalid value';
    }

    return null;
}
