import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, AlertCircle, Calendar, X, Edit2, Minus, Check, AlertTriangle, ArrowUpDown, Sparkles } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useUI } from '../context/UIContext';
import EditInventoryModal from '../components/EditInventoryModal';
import ExpiryBadge from '../components/ExpiryBadge';
import AIAnalysisModal from '../components/AIAnalysisModal';
import { aiService } from '../services/api';

const Inventory = () => {
    const { inventory, addItem, removeItem, updateItem, getStatus } = useInventory();
    const { searchQuery, setSearchQuery, debouncedSearchQuery } = useUI();
    const [activeTab, setActiveTab] = useState('Pantry');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    const [successMessage, setSuccessMessage] = useState('');

    // AI Analysis State
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);

    const handleAnalyze = async () => {
        setIsAnalysisOpen(true);
        setIsAnalyzing(true);
        try {
            // Get current inventory item names
            const itemNames = inventory.map(item => item.name);
            const response = await aiService.analyzeInventory(itemNames);

            // Handle both suggestions array (standard) and suggestion string (requested)
            // Merge suggestions array with raw suggestion text for the modal
            const suggestions = response.data.suggestions || [];
            if (response.data.suggestion && suggestions.length > 0) {
                suggestions[0].suggestion = response.data.suggestion;
            } else if (response.data.suggestion) {
                suggestions.push({ title: 'AI Recommendation', suggestion: response.data.suggestion, matchPercent: 100 });
            }

            setAiSuggestions(suggestions);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Failed to run AI analysis. Please check your OpenAI API key in Settings.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const tabs = ['Pantry', 'Fridge', 'Freezer'];

    // Form State
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        qty: '',
        expiry: '',
    });

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.qty) return;

        addItem({
            name: newItem.name,
            category: newItem.category || 'General',
            qty: newItem.qty,
            expiry: newItem.expiry,
            location: activeTab
        });

        setNewItem({ name: '', category: '', qty: '', expiry: '' });
        setIsModalOpen(false);
        showToast('Item added successfully');
    };

    const handleEditItem = (id, updates) => {
        updateItem(id, updates);
        showToast('Item updated successfully');
    };

    const handleDelete = (id) => {
        removeItem(id);
        setDeleteConfirm({ show: false, id: null, name: '' });
        showToast('Item removed successfully');
    };

    const handleUpdateQty = (item, delta) => {
        const match = item.qty.match(/^(\d+(\.\d+)?)\s*(.*)$/);
        if (match) {
            const num = parseFloat(match[1]);
            const unit = match[3];
            const newNum = Math.max(0, num + delta);
            updateItem(item.id, { qty: `${newNum}${unit ? ' ' + unit : ''}` });
        } else {
            const num = parseFloat(item.qty);
            if (!isNaN(num)) {
                updateItem(item.id, { qty: String(Math.max(0, num + delta)) });
            }
        }
    };

    const showToast = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter items by active tab and global debounced search query
    const filteredItems = useMemo(() => {
        let items = inventory.filter(item => {
            const matchesTab = item.location === activeTab;
            const matchesSearch = item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });

        // Apply Sorting
        return items.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            if (sortConfig.key === 'expiry') {
                aVal = aVal ? new Date(aVal).getTime() : Infinity;
                bVal = bVal ? new Date(bVal).getTime() : Infinity;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [inventory, activeTab, debouncedSearchQuery, sortConfig]);

    // Stats for dashboard
    const stats = useMemo(() => {
        return {
            total: inventory.length,
            expiringSoon: inventory.filter(i => i.status === 'Expiring Soon').length,
            expired: inventory.filter(i => i.status === 'Expired').length
        };
    }, [inventory]);

    return (
        <div className="space-y-6 relative">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-24 right-8 z-[60] bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                    <p className="text-gray-500 mt-1">Track pantry, fridge, and freezer items</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleAnalyze}
                        className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-lg font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center group"
                    >
                        <Sparkles className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                        AI Analyst
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-600 transition-colors flex items-center justify-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className={`bg-white p-4 rounded-xl shadow-sm border transition-colors ${stats.expiringSoon > 0 ? 'border-amber-200 bg-amber-50' : 'border-gray-100'}`}>
                    <p className={`text-sm ${stats.expiringSoon > 0 ? 'text-amber-600' : 'text-gray-500'}`}>Expiring Soon</p>
                    <p className={`text-2xl font-bold ${stats.expiringSoon > 0 ? 'text-amber-600' : 'text-gray-800'}`}>{stats.expiringSoon}</p>
                </div>
                <div className={`bg-white p-4 rounded-xl shadow-sm border transition-colors ${stats.expired > 0 ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                    <p className={`text-sm ${stats.expired > 0 ? 'text-red-600' : 'text-gray-500'}`}>Expired</p>
                    <p className={`text-2xl font-bold ${stats.expired > 0 ? 'text-red-600' : 'text-gray-800'}`}>{stats.expired}</p>
                </div>
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

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-1">Item <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('category')}>
                                <div className="flex items-center gap-1">Category <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('expiry')}>
                                <div className="flex items-center gap-1">Expiry Date <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredItems.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                                <td className="px-6 py-4 text-gray-600">{item.category}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleUpdateQty(item, -1)}
                                            className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="min-w-[3rem] text-center font-medium">{item.qty}</span>
                                        <button
                                            onClick={() => handleUpdateQty(item, 1)}
                                            className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{item.expiry ? new Date(item.expiry).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <ExpiryBadge expiryDate={item.expiry} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingItem(item);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-gray-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/5"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm({ show: true, id: item.id, name: item.name })}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-500/5"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                    No items in {activeTab}. Add some items to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Add New Item to {activeTab}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddItem} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g., Chicken Breast"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary"
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        <option>Dairy</option>
                                        <option>Meat</option>
                                        <option>Seafood</option>
                                        <option>Produce</option>
                                        <option>Grains</option>
                                        <option>Canned</option>
                                        <option>Oils</option>
                                        <option>Baking</option>
                                        <option>Condiments</option>
                                        <option>Protein</option>
                                        <option>Frozen</option>
                                        <option>General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g., 2 lbs"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                        value={newItem.qty}
                                        onChange={e => setNewItem({ ...newItem, qty: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Calendar className="w-4 h-4 inline mr-1" /> Expiry Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={newItem.expiry}
                                    onChange={e => setNewItem({ ...newItem, expiry: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 text-gray-600 font-medium">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 font-medium">Add Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Item Modal */}
            <EditInventoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                item={editingItem}
                onSave={handleEditItem}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
                        <div className="flex items-center gap-4 text-red-500 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">Remove Item?</h3>
                        </div>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to remove <span className="font-semibold text-gray-700">"{deleteConfirm.name}"</span> from your {activeTab.toLowerCase()}? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                                className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.id)}
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors shadow-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* AI Analysis Modal */}
            <AIAnalysisModal
                isOpen={isAnalysisOpen}
                onClose={() => setIsAnalysisOpen(false)}
                suggestions={aiSuggestions}
                isLoading={isAnalyzing}
            />
        </div>
    );
};

export default Inventory;
