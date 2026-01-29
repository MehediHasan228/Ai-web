import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authUser, setAuthUser] = useState(null);

    // Check for existing auth on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('savora_auth_token');
            const userData = localStorage.getItem('savora_user');

            if (token && userData) {
                setIsAuthenticated(true);
                setAuthUser(JSON.parse(userData));
            } else {
                setIsAuthenticated(false);
                setAuthUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setIsAuthenticated(false);
            setAuthUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // Simulate API call - replace with actual auth logic
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock successful login
            const mockUser = {
                id: '1',
                email: email,
                name: 'Admin User',
                role: 'Admin'
            };
            const mockToken = 'mock_jwt_token_' + Date.now();

            // Store in localStorage
            localStorage.setItem('savora_auth_token', mockToken);
            localStorage.setItem('savora_user', JSON.stringify(mockUser));

            setAuthUser(mockUser);
            setIsAuthenticated(true);
            setIsLoading(false);

            return { success: true };
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Logout function
    const logout = () => {
        // Clear all auth data
        localStorage.removeItem('savora_auth_token');
        localStorage.removeItem('savora_user');

        // Reset state
        setIsAuthenticated(false);
        setAuthUser(null);

        // Return true to indicate successful logout
        return true;
    };

    // Get current token
    const getToken = () => {
        return localStorage.getItem('savora_auth_token');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            authUser,
            login,
            logout,
            getToken,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
