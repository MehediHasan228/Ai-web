import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Core Profile Data
    const [user, setUser] = useState({
        name: 'Robert Fox',
        email: 'admin@savora.app',
        role: 'Admin Workspace',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
    });

    // API Configuration
    const [apiKeys, setApiKeys] = useState({
        spoonacular: '',
        openai: ''
    });

    // Notification Preferences
    const [notifications, setNotifications] = useState({
        newUserAlerts: true,
        systemErrors: true
    });

    // AI Controls Configuration
    const [aiConfig, setAiConfig] = useState({
        model: 'GPT-4 (Recommended)',
        temperature: 0.7,
        systemPrompt: "You are an expert chef and nutritional planner. Create meal plans that are efficient, cost-effective, and adhere strictly to the user's dietary restrictions."
    });

    // User Preferences for Recipe Matching
    const [userPreferences, setUserPreferences] = useState({
        dietaryPreferences: ['seafood', 'gluten-free'],
        cuisinePreferences: ['Italian', 'Asian', 'Mediterranean'],
        maxCookTime: 60, // minutes
        maxCalories: 800  // kcal
    });

    const updateProfile = (updates) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    const updateApiKeys = (keys) => {
        setApiKeys(prev => ({ ...prev, ...keys }));
    };

    const updateNotifications = (prefs) => {
        setNotifications(prev => ({ ...prev, ...prefs }));
    };

    const updateAiConfig = (config) => {
        setAiConfig(prev => ({ ...prev, ...config }));
    };

    const updateUserPreferences = (prefs) => {
        setUserPreferences(prev => ({ ...prev, ...prefs }));
    };

    const logout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            alert("Logging out... (This would redirect to login)");
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            updateProfile,
            apiKeys,
            updateApiKeys,
            notifications,
            updateNotifications,
            aiConfig,
            updateAiConfig,
            userPreferences,
            updateUserPreferences,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
