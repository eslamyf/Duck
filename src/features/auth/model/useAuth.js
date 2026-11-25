import { useState, useCallback } from 'react';

import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    updateCurrentUser,
} from '../../../entities/user/api/authService.js';

export function useAuth() {
    const [user, setUser] = useState(() => getCurrentUser());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Register user and automatically log in
     */
    const register = useCallback(async (userData) => {
        setLoading(true);
        setError('');

        try {
            await registerUser(userData);

            const loggedInUser = await loginUser({
                email: userData.email,
                password: userData.password,
                role: userData.role,
                rememberMe: true,
            });

            setUser(loggedInUser);

            return loggedInUser;
        } catch (err) {
            setError(err.message || 'Registration failed.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Login
     */
    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError('');

        try {
            const loggedInUser = await loginUser(credentials);

            setUser(loggedInUser);

            return loggedInUser;
        } catch (err) {
            setError(err.message || 'Login failed.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Logout
     */
    const logout = useCallback(() => {
        logoutUser();
        setUser(null);
        setError('');
    }, []);

    /**
     * Update current user
     */
    const updateUser = useCallback((updates) => {
        setError('');

        try {
            const updatedUser = updateCurrentUser(updates);

            setUser(updatedUser);

            return updatedUser;
        } catch (err) {
            setError(err.message || 'Failed to update user.');
            throw err;
        }
    }, []);

    /**
     * Refresh current user from storage
     */
    const refreshUser = useCallback(() => {
        const currentUser = getCurrentUser();

        setUser(currentUser);

        return currentUser;
    }, []);

    return {
        user,
        isAuthenticated: Boolean(user),
        loading,
        error,

        register,
        login,
        logout,
        updateUser,
        refreshUser,

        clearError: () => setError(''),
    };
}

export default useAuth;