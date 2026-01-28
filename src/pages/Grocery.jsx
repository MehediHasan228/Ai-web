import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, MoreVertical, X, Trash2, PieChart } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';

const Grocery = () => {
    const [items, setItems] = useState([
        { id: 1, name: 'Almond Milk', category: 'Dairy & Alternatives', isBought: false, price: 4.50 },
        { id: 2, name: 'Spinach', category: 'Produce', isBought: false, price: 2.99 },
        { id: 3, name: 'Eggs (Dozen)', category: 'Dairy & Alternatives', isBought: true, price: 5.20 },
        { id: 4, name: 'Chicken Breast', category: 'Meat & Poultry', isBought: false, price: 12.50 },
        { id: 5, name: 'Brown Rice', category: 'Grains', isBought: false, price: 3.75 },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Produce', price: '' });

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, isBought: !item.isBought } : item
        ));
    };

    const clearCompleted = () => {
        if (window.confirm("Clear all bought items?")) {
            setItems(items.filter(i => !i.isBought));
        }
    };

    const addItem = (e) => {
        e.preventDefault();
        if (!newItem.name) return;
        setItems([...items, {
            id: Date.now(),
            name: newItem.name,
            category: newItem.category,
            isBought: false,
            price: parseFloat(newItem.price) || 0
        }]);
        setNewItem({ name: '', category: 'Produce', price: '' });
        setIsAddModalOpen(false);
    };

    const deleteItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    }

    const categories = [...new Set(items.map(i => i.category))];
    const remainingItems = items.filter(i => !i.isBought);
    const estimatedCost = remainingItems.reduce((acc, curr) => acc + curr.price, 0);

    // Analytics Data Preparation
    const costByCategory = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.price;
        return acc;
    }, {});
    const pieData = Object.keys(costByCategory).map(key => ({ name: key, value: costByCategory[key] }));
    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Grocery List</h1>
                    <p className="text-gray-500 mt-1">Smart shopping list synced with your meal plan</p>
                </div>
                <div className="flex gap-3">
                    {items.some(i => i.isBought) && (
                        <button onClick={clearCompleted} className="text-red-500 bg-white border border-red-100 px-4 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors">
                            Clear Completed
                        </button>
                    )}
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-600 transition-colors flex items-center justify-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main List Area */}
                <div className="lg:col-span-2 space-y-6">
                    {categories.map(category => (
                        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-700">{category}</h3>
                                <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                    {items.filter(i => i.category === category && !i.isBought).length} items
                                </span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {items.filter(i => i.category === category).map(item => (
                                    <div
                                        key={item.id}
                                        className={`px-6 py-4 flex items-center justify-between group transition-colors ${item.isBought ? 'bg-gray-50/50' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center cursor-pointer flex-1" onClick={() => toggleItem(item.id)}>
                                            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${item.isBought ? 'bg-primary border-primary' : 'border-gray-300'
                                                }`}>
                                                {item.isBought && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <div>
                                                <span className={`block ${item.isBought ? 'text-gray-400 line-through' : 'text-gray-800 font-medium'}`}>
                                                    {item.name}
                                                </span>
                                                <span className="text-xs text-gray-400">${item.price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteItem(item.id)} className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-2">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <div className="text-center p-10 text-gray-400">Your list is empty! Time to add some milk? 🥛</div>}
                </div>

                {/* Summary / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md">
                        <ShoppingBag className="w-10 h-10 mb-4 opacity-80" />
                        <h3 className="text-xl font-bold">Shopping Setup</h3>
                        <p className="text-white/80 mt-2 text-sm leading-relaxed">
                            You have <span className="font-bold text-white">{remainingItems.length} items</span> remaining.
                            <br />Estimated cost: <span className="font-bold text-xl block mt-2">${estimatedCost.toFixed(2)}</span>
                        </p>
                        <button onClick={() => setIsAnalyticsOpen(true)} className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center">
                            <PieChart className="w-4 h-4 mr-2" />
                            View Budget Analytics
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Add Grocery Item</h3>
                            <button onClick={() => setIsAddModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <form onSubmit={addItem} className="space-y-4">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Item name (e.g. Bananas)"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                            />
                            <select
                                className="w-full px-4 py-2 border rounded-lg bg-white"
                                value={newItem.category}
                                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                            >
                                <option>Produce</option>
                                <option>Dairy & Alternatives</option>
                                <option>Meat & Poultry</option>
                                <option>Grains</option>
                                <option>Snacks</option>
                            </select>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Estimated Price ($)"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                                value={newItem.price}
                                onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                            />
                            <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-emerald-600">Add to List</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Budget Analytics Modal */}
            {isAnalyticsOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Spending Breakdown</h3>
                            <button onClick={() => setIsAnalyticsOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ReTooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            {pieData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-gray-600 flex-1">{entry.name}</span>
                                    <span className="font-medium">${entry.value.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Grocery;
