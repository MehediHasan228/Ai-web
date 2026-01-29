import React, { createContext, useContext, useState } from 'react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    // Inventory items with location, name, category, quantity
    const [inventory, setInventory] = useState([
        { id: 1, name: 'Pasta (Penne)', category: 'Grains', qty: '2 boxes', expiry: '2024-12-10', status: 'Good', location: 'Pantry' },
        { id: 2, name: 'Tomato Sauce', category: 'Canned', qty: '3 cans', expiry: '2024-08-15', status: 'Good', location: 'Pantry' },
        { id: 3, name: 'Olive Oil', category: 'Oils', qty: '1 bottle', expiry: '2025-01-20', status: 'Good', location: 'Pantry' },
        { id: 4, name: 'Whole Wheat Flour', category: 'Baking', qty: '1 bag', expiry: '2023-11-30', status: 'Expiring Soon', location: 'Pantry' },
        { id: 5, name: 'Milk', category: 'Dairy', qty: '1 gallon', expiry: '2024-02-10', status: 'Good', location: 'Fridge' },
        { id: 6, name: 'Butter', category: 'Dairy', qty: '1 pack', expiry: '2024-03-15', status: 'Good', location: 'Fridge' },
        { id: 7, name: 'Garlic', category: 'Produce', qty: '1 head', expiry: '2024-02-20', status: 'Good', location: 'Pantry' },
        { id: 8, name: 'Chicken Breast', category: 'Meat', qty: '2 lbs', expiry: '2024-02-05', status: 'Good', location: 'Freezer' },
        { id: 9, name: 'Salmon', category: 'Seafood', qty: '1 lb', expiry: '2024-02-08', status: 'Good', location: 'Freezer' },
        { id: 10, name: 'Rice', category: 'Grains', qty: '5 lbs', expiry: '2025-06-01', status: 'Good', location: 'Pantry' },
        { id: 11, name: 'Quinoa', category: 'Grains', qty: '1 bag', expiry: '2025-04-01', status: 'Good', location: 'Pantry' },
        { id: 12, name: 'Broccoli', category: 'Produce', qty: '2 heads', expiry: '2024-02-03', status: 'Expiring Soon', location: 'Fridge' },
        { id: 13, name: 'Carrots', category: 'Produce', qty: '1 bag', expiry: '2024-02-15', status: 'Good', location: 'Fridge' },
        { id: 14, name: 'Soy Sauce', category: 'Condiments', qty: '1 bottle', expiry: '2025-12-01', status: 'Good', location: 'Pantry' },
        { id: 15, name: 'Tofu', category: 'Protein', qty: '1 block', expiry: '2024-02-10', status: 'Good', location: 'Fridge' },
    ]);

    // Helper to calculate status based on date
    const getStatus = (date) => {
        if (!date) return 'Good';
        const today = new Date();
        const expiry = new Date(date);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Expired';
        if (diffDays <= 7) return 'Expiring Soon';
        return 'Good';
    };

    // Add item to inventory
    const addItem = (item) => {
        const newItem = {
            id: Date.now(),
            ...item,
            status: getStatus(item.expiry)
        };
        setInventory(prev => [...prev, newItem]);
        return newItem;
    };

    // Remove item from inventory
    const removeItem = (id) => {
        setInventory(prev => prev.filter(item => item.id !== id));
    };

    // Update item in inventory
    const updateItem = (id, updates) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates, status: getStatus(updates.expiry || item.expiry) } : item
        ));
    };

    // Get all inventory item names (for match calculation)
    const getInventoryNames = () => {
        return inventory.map(item => item.name);
    };

    // Get items by location
    const getItemsByLocation = (location) => {
        return inventory.filter(item => item.location === location);
    };

    // Get inventory statistics
    const getStats = () => {
        const total = inventory.length;
        const expiringSoon = inventory.filter(i => i.status === 'Expiring Soon').length;
        const expired = inventory.filter(i => i.status === 'Expired').length;
        return { total, expiringSoon, expired };
    };

    return (
        <InventoryContext.Provider value={{
            inventory,
            setInventory,
            addItem,
            removeItem,
            updateItem,
            getInventoryNames,
            getItemsByLocation,
            getStats,
            getStatus
        }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};
