import React, { useState } from 'react';
import { Search, Plus, Trash2, AlertCircle, Calendar, X } from 'lucide-react';

const Inventory = () => {
    const [activeTab, setActiveTab] = useState('Pantry');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tabs = ['Pantry', 'Fridge', 'Freezer'];

    // Initial Mock Data
    const [items, setItems] = useState([
        { id: 1, name: 'Pasta (Penne)', category: 'Grains', qty: '2 boxes', expiry: '2024-12-10', status: 'Good', location: 'Pantry' },
        { id: 2, name: 'Tomato Sauce', category: 'Canned', qty: '3 cans', expiry: '2024-08-15', status: 'Good', location: 'Pantry' },
        { id: 3, name: 'Olive Oil', category: 'Oils', qty: '1 bottle', expiry: '2025-01-20', status: 'Good', location: 'Pantry' },
        { id: 4, name: 'Whole Wheat Flour', category: 'Baking', qty: '1 bag', expiry: '2023-11-30', status: 'Expiring Soon', location: 'Pantry' },
        { id: 5, name: 'Milk', category: 'Dairy', qty: '1 gallon', expiry: '2024-02-10', status: 'Good', location: 'Fridge' },
    ]);

    // Form State
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        qty: '',
        expiry: '',
    });

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

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.qty) return;

        const item = {
            id: Date.now(),
            name: newItem.name,
            category: newItem.category || 'General',
            qty: newItem.qty,
            expiry: newItem.expiry,
            status: getStatus(newItem.expiry),
            location: activeTab // Add to current tab
        };

        setItems([...items, item]);
        setNewItem({ name: '', category: '', qty: '', expiry: '' });
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Remove this item from inventory?')) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    // Filter items by active tab and search query
    const filteredItems = items.filter(item => {
        const matchesTab = item.location === activeTab;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                    <p className="text-gray-500 mt-1">Track pantry, fridge, and freezer items</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-600 transition-colors flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Item
                </button>
            </div>

            {/* Tabs & Search */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex p-1 bg-gray-100/50 rounded-lg w-full sm:w-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-80 mr-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Inventory List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Item Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Quantity</th>
                            <th className="px-6 py-4">Status & Expiry</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.category}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.qty}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-sm">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className={`font-medium ${item.status === 'Expiring Soon' ? 'text-orange-500' :
                                            item.status === 'Expired' ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                            {item.expiry || 'No Date'}
                                        </span>
                                        {item.status === 'Expiring Soon' && <AlertCircle className="w-4 h-4 ml-2 text-orange-500" />}
                                        {item.status === 'Expired' && <AlertCircle className="w-4 h-4 ml-2 text-red-600" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredItems.length === 0 && (
                    <div className="p-12 text-center text-gray-400">No items found in {activeTab}.</div>
                )}
            </div>

            {/* Add Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Add to {activeTab}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddItem} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Almond Milk"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Dairy">Dairy</option>
                                        <option value="Produce">Produce</option>
                                        <option value="Meat">Meat</option>
                                        <option value="Grains">Grains</option>
                                        <option value="Canned">Canned</option>
                                        <option value="Oils">Oils</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., 2 liters"
                                        value={newItem.qty}
                                        onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                                <input
                                    type="date"
                                    value={newItem.expiry}
                                    onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 font-medium"
                                >
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
