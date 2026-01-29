import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            // Auto-close sidebar on mobile
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Notification state
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Recipe Request', message: 'A new recipe for "Spicy Ramen" has been submitted.', time: '5m ago', type: 'recipe', read: false },
        { id: 2, title: 'Inventory Alert', message: 'Chicken Breast is running low in the Freezer.', time: '2h ago', type: 'inventory', read: false },
        { id: 3, title: 'Server Update', message: 'Savora Admin v1.2.0 has been deployed successfully.', time: '5h ago', type: 'system', read: true },
    ]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Notification actions
    const toggleNotifications = () => {
        setIsNotificationOpen(prev => !prev);
        if (showProfileMenu) setShowProfileMenu(false);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
        setIsNotificationOpen(false);
    };

    // Profile state (moved to context for easier management)
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const toggleProfileMenu = () => {
        setShowProfileMenu(prev => !prev);
        if (isNotificationOpen) setIsNotificationOpen(false);
    };

    // Close sidebar (for mobile after clicking menu item)
    const closeSidebar = () => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    // Open sidebar
    const openSidebar = () => {
        setIsSidebarOpen(true);
    };

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            isMobile,
            searchQuery,
            setSearchQuery,
            debouncedSearchQuery,
            notifications,
            unreadCount,
            isNotificationOpen,
            setIsNotificationOpen,
            toggleNotifications,
            markAsRead,
            markAllAsRead,
            clearNotifications,
            showProfileMenu,
            setShowProfileMenu,
            toggleProfileMenu,
            toggleSidebar,
            closeSidebar,
            openSidebar,
            setIsSidebarOpen
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
