import { ROLES } from '../model/roles.js';
import { authenticateDemoAccount } from '../../../shared/config/demoAccounts.js';

const USERS_KEY = 'duck_users';
const CURRENT_USER_KEY = 'duck_current_user';
const SESSION_USER_KEY = 'duck_session_user';

/**
 * Get users from localStorage
 */
function getStoredUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem(USERS_KEY) || '[]'
        );

        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

/**
 * Save users to localStorage
 */
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Normalize email
 */
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

/**
 * Hash password using Web Crypto API
 */
async function hashPassword(password) {
    if (!window.crypto?.subtle) {
        throw new Error(
            'Secure password hashing is not supported in this browser.'
        );
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await window.crypto.subtle.digest(
        'SHA-256',
        data
    );

    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Create a unique user ID
 */
function generateUserId() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `user_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}

/**
 * Remove sensitive information from user object
 */
function sanitizeUser(user) {
    if (!user) return null;

    const safeUser = { ...user };
    delete safeUser.passwordHash;

    return safeUser;
}

/**
 * Register a new Customer or Partner
 */
export async function registerUser(userData) {
    const {
        fullName,
        businessName = '',
        email,
        phone,
        password,
        role = ROLES.CUSTOMER,
    } = userData;

    if (!fullName?.trim()) {
        throw new Error('Full name is required.');
    }

    if (!email?.trim()) {
        throw new Error('Email is required.');
    }

    if (!password || password.length < 8) {
        throw new Error('Password must contain at least 8 characters.');
    }

    if (![ROLES.CUSTOMER, ROLES.PARTNER].includes(role)) {
        throw new Error('Invalid registration role.');
    }

    if (role === ROLES.PARTNER && !businessName.trim()) {
        throw new Error('Business name is required for partners.');
    }

    const normalizedEmail = normalizeEmail(email);

    const users = getStoredUsers();

    const existingUser = users.find(
        (user) => user.email === normalizedEmail
    );

    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }

    const passwordHash = await hashPassword(password);

    const newUser = {
        id: generateUserId(),
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || '',
        role,
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    saveUsers(users);

    return sanitizeUser(newUser);
}

/**
 * Create a development-only Admin account.
 * This function is disabled in production.
 */
export async function createDevelopmentAdmin({
    fullName = 'Development Admin',
    email,
    password,
}) {
    // Allow this helper only in Vite development mode
    if (!import.meta.env.DEV) {
        throw new Error(
            'Development Admin setup is only available in development mode.'
        );
    }

    if (!fullName?.trim()) {
        throw new Error('Full name is required.');
    }

    if (!email?.trim()) {
        throw new Error('Email is required.');
    }

    if (!password || password.length < 8) {
        throw new Error(
            'Password must contain at least 8 characters.'
        );
    }

    const normalizedEmail = normalizeEmail(email);

    const users = getStoredUsers();

    const existingUser = users.find(
        (user) => user.email === normalizedEmail
    );

    if (existingUser) {
        throw new Error(
            'An account with this email already exists.'
        );
    }

    const passwordHash = await hashPassword(password);

    const adminUser = {
        id: generateUserId(),
        fullName: fullName.trim(),
        businessName: '',
        email: normalizedEmail,
        phone: '',
        role: ROLES.ADMIN,
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    users.push(adminUser);

    saveUsers(users);

    return sanitizeUser(adminUser);
}

/**
 * Login existing user
 */
export async function loginUser({
    email,
    password,
    role,
    rememberMe = true,
}) {
    if (!email?.trim() || !password) {
        throw new Error('Email and password are required.');
    }

    const normalizedEmail = normalizeEmail(email);

    const demoUser = authenticateDemoAccount(normalizedEmail, password);
    if (demoUser) {
        if (role && demoUser.role !== role) {
            throw new Error('This account does not match the selected role.');
        }

        logoutUser();
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(
            rememberMe ? CURRENT_USER_KEY : SESSION_USER_KEY,
            JSON.stringify(demoUser)
        );
        return demoUser;
    }

    const users = getStoredUsers();

    const user = users.find(
        (item) => item.email === normalizedEmail
    );

    if (!user) {
        throw new Error('Invalid email or password.');
    }

    if (role && user.role !== role) {
        throw new Error('This account does not match the selected role.');
    }

    const passwordHash = await hashPassword(password);

    if (passwordHash !== user.passwordHash) {
        throw new Error('Invalid email or password.');
    }

    const safeUser = sanitizeUser(user);

    // Clear any previous session
    logoutUser();

    const storage = rememberMe
        ? localStorage
        : sessionStorage;

    storage.setItem(
        rememberMe ? CURRENT_USER_KEY : SESSION_USER_KEY,
        JSON.stringify(safeUser)
    );

    return safeUser;
}

/**
 * Get currently logged-in user
 */
export function getCurrentUser() {
    try {
        const persistentUser = localStorage.getItem(
            CURRENT_USER_KEY
        );

        const sessionUser = sessionStorage.getItem(
            SESSION_USER_KEY
        );

        const storedUser = persistentUser || sessionUser;

        return storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch {
        return null;
    }
}

/**
 * Logout current user
 */
export function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
}

/**
 * Update current user information
 */
export function updateCurrentUser(updates) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        throw new Error('No authenticated user found.');
    }

    const users = getStoredUsers();

    const userIndex = users.findIndex(
        (user) => user.id === currentUser.id
    );

    const allowedFields = [
        'fullName',
        'phone',
        'businessName',
    ];

    const safeUpdates = {};

    allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
            safeUpdates[field] = updates[field];
        }
    });

    let safeUser;

    if (userIndex === -1) {
        if (!String(currentUser.id).startsWith('demo-')) {
            throw new Error('User account was not found.');
        }
        safeUser = sanitizeUser({
            ...currentUser,
            ...safeUpdates,
            updatedAt: new Date().toISOString(),
        });
    } else {
        const updatedUser = {
            ...users[userIndex],
            ...safeUpdates,
            updatedAt: new Date().toISOString(),
        };

        users[userIndex] = updatedUser;
        saveUsers(users);
        safeUser = sanitizeUser(updatedUser);
    }

    const persistentSession = localStorage.getItem(
        CURRENT_USER_KEY
    );

    const sessionStorageUser = sessionStorage.getItem(
        SESSION_USER_KEY
    );

    if (persistentSession) {
        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(safeUser)
        );
    }

    if (sessionStorageUser) {
        sessionStorage.setItem(
            SESSION_USER_KEY,
            JSON.stringify(safeUser)
        );
    }

    return safeUser;
}
