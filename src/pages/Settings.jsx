import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, Key, Check, Camera, LogOut, Eye, EyeOff, ChefHat, Clock, Flame, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Settings = () => {
    const { user, updateProfile, apiKeys, updateApiKeys, notifications, updateNotifications, userPreferences, updateUserPreferences, logout } = useUser();

    // --- Profile State ---
    const [profileData, setProfileData] = useState({ ...user });
    const [isProfileSaving, setIsProfileSaving] = useState(false);
    const fileInputRef = useRef(null);

    // --- API Key State ---
    const [keysData, setKeysData] = useState({ ...apiKeys });
    const [showKeys, setShowKeys] = useState({ spoonacular: false, openai: false });
    const [isKeysSaving, setIsKeysSaving] = useState(false);

    // --- Notification State ---
    const [notifData, setNotifData] = useState({ ...notifications });

    // --- Recipe Preferences State ---
    const [prefsData, setPrefsData] = useState({ ...userPreferences });
    const [isPrefsSaving, setIsPrefsSaving] = useState(false);

    // Available options for preferences
    const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'seafood', 'low-carb'];
    const cuisineOptions = ['Italian', 'Asian', 'Mediterranean', 'Mexican', 'Seafood', 'American', 'Indian', 'French', 'Thai', 'Japanese'];

    // Sync local state with context on mount
    useEffect(() => {
        setProfileData({ ...user });
        setKeysData({ ...apiKeys });
        setNotifData({ ...notifications });
        setPrefsData({ ...userPreferences });
    }, [user, apiKeys, notifications, userPreferences]);

    // Handlers
    const handleProfileSave = () => {
        setIsProfileSaving(true);
        setTimeout(() => {
            updateProfile(profileData);
            setIsProfileSaving(false);
            alert("Profile updated successfully!");
        }, 800);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKeysSave = () => {
        setIsKeysSaving(true);
        setTimeout(() => {
            updateApiKeys(keysData);
            setIsKeysSaving(false);
            alert("API Keys updated successfully!");
        }, 800);
    };

    const handleNotifChange = (key) => {
        const newData = { ...notifData, [key]: !notifData[key] };
        setNotifData(newData);
        updateNotifications(newData);
    };

    const handlePrefsSave = () => {
        setIsPrefsSaving(true);
        setTimeout(() => {
            updateUserPreferences(prefsData);
            setIsPrefsSaving(false);
            alert("Recipe preferences updated! Match scores will recalculate.");
        }, 800);
    };

    const toggleDietaryPref = (pref) => {
        const current = prefsData.dietaryPreferences || [];
        if (current.includes(pref)) {
            setPrefsData({ ...prefsData, dietaryPreferences: current.filter(p => p !== pref) });
        } else {
            setPrefsData({ ...prefsData, dietaryPreferences: [...current, pref] });
        }
    };

    const toggleCuisinePref = (cuisine) => {
        const current = prefsData.cuisinePreferences || [];
        if (current.includes(cuisine)) {
            setPrefsData({ ...prefsData, cuisinePreferences: current.filter(c => c !== cuisine) });
        } else {
            setPrefsData({ ...prefsData, cuisinePreferences: [...current, cuisine] });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account and platform preferences</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <h2 className="font-semibold text-gray-800">Profile Information</h2>
                </div>
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <img
                                    src={profileData.avatar}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 group-hover:border-primary/20 transition-all"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm text-primary font-medium hover:text-emerald-700"
                            >
                                Change Photo
                            </button>
                        </div>

                        {/* Text Fields */}
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                    <button
                        onClick={handleProfileSave}
                        disabled={isProfileSaving}
                        className="bg-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
                    >
                        {isProfileSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </div>

            {/* Recipe Preferences Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <ChefHat className="w-5 h-5 text-gray-400" />
                    <h2 className="font-semibold text-gray-800">Recipe Matching Preferences</h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Dietary Preferences */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
                        <p className="text-xs text-gray-500 mb-3">Select dietary restrictions or preferences for recipe matching</p>
                        <div className="flex flex-wrap gap-2">
                            {dietaryOptions.map(pref => (
                                <button
                                    key={pref}
                                    onClick={() => toggleDietaryPref(pref)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${(prefsData.dietaryPreferences || []).includes(pref)
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {pref}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cuisine Preferences */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Cuisines</label>
                        <p className="text-xs text-gray-500 mb-3">Recipes matching these cuisines get higher match scores</p>
                        <div className="flex flex-wrap gap-2">
                            {cuisineOptions.map(cuisine => (
                                <button
                                    key={cuisine}
                                    onClick={() => toggleCuisinePref(cuisine)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${(prefsData.cuisinePreferences || []).includes(cuisine)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time & Calorie Goals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <Clock className="w-4 h-4 mr-1" /> Max Cook Time (minutes)
                            </label>
                            <input
                                type="range"
                                min="15"
                                max="120"
                                step="5"
                                value={prefsData.maxCookTime || 60}
                                onChange={(e) => setPrefsData({ ...prefsData, maxCookTime: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>15 min</span>
                                <span className="font-medium text-primary">{prefsData.maxCookTime || 60} min</span>
                                <span>120 min</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <Flame className="w-4 h-4 mr-1" /> Max Calories per Serving
                            </label>
                            <input
                                type="number"
                                value={prefsData.maxCalories || 800}
                                onChange={(e) => setPrefsData({ ...prefsData, maxCalories: parseInt(e.target.value) || 0 })}
                                placeholder="e.g., 600"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recipes under this limit score higher</p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                    <button
                        onClick={handlePrefsSave}
                        disabled={isPrefsSaving}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                        {isPrefsSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>

            {/* API Keys Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <Key className="w-5 h-5 text-gray-400" />
                    <h2 className="font-semibold text-gray-800">API Keys (Backend Connections)</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Spoonacular API Key</label>
                        <div className="relative">
                            <input
                                type={showKeys.spoonacular ? "text" : "password"}
                                value={keysData.spoonacular}
                                onChange={(e) => setKeysData({ ...keysData, spoonacular: e.target.value })}
                                placeholder="sk-xxxxxxxxxxxxxxxx"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary font-mono"
                            />
                            <button
                                onClick={() => setShowKeys({ ...showKeys, spoonacular: !showKeys.spoonacular })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showKeys.spoonacular ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
                        <div className="relative">
                            <input
                                type={showKeys.openai ? "text" : "password"}
                                value={keysData.openai}
                                onChange={(e) => setKeysData({ ...keysData, openai: e.target.value })}
                                placeholder="sk-xxxxxxxxxxxxxxxx"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary font-mono"
                            />
                            <button
                                onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                    <button
                        onClick={handleKeysSave}
                        disabled={isKeysSaving}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                        {isKeysSaving ? 'Updating...' : 'Update Keys'}
                    </button>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <h2 className="font-semibold text-gray-800">Notification Preferences</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-800">New User Alerts</p>
                            <p className="text-sm text-gray-500">Get notified when a new user signs up</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifData.newUserAlerts}
                                onChange={() => handleNotifChange('newUserAlerts')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-800">System Errors</p>
                            <p className="text-sm text-gray-500">Receive alerts for API failures or bugs</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifData.systemErrors}
                                onChange={() => handleNotifChange('systemErrors')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Logout Zone */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={logout}
                    className="flex items-center text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Log Out of Admin Console
                </button>
            </div>
        </div>
    );
};

export default Settings;
