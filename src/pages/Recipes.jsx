import React, { useState } from 'react';
import { Search, Filter, Plus, ExternalLink, Clock, Flame, ChefHat, X, Edit2, Eye, Trash2, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
    const navigate = useNavigate();

    // Cuisine List (dynamic)
    const [cuisines, setCuisines] = useState([
        'Italian', 'Asian', 'Mediterranean', 'Mexican', 'Seafood', 'American'
    ]);

    // Mock Data
    const initialRecipes = [
        { id: 1, title: 'Mediterranean Quinoa Salad', calories: 320, time: 25, cuisine: 'Mediterranean', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80', match: 95, ingredients: ['Quinoa', 'Cucumber', 'Tomatoes', 'Feta Cheese'], instructions: 'Boil quinoa. Chop veggies. Mix everything.' },
        { id: 2, title: 'Garlic Butter Salmon', calories: 450, time: 35, cuisine: 'Seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80', match: 88, ingredients: ['Salmon Fillet', 'Butter', 'Garlic', 'Lemon'], instructions: 'Pan sear salmon. Baste with garlic butter.' },
        { id: 3, title: 'Vegetable Stir Fry', calories: 280, time: 20, cuisine: 'Asian', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80', match: 82, ingredients: ['Broccoli', 'Carrots', 'Soy Sauce', 'Tofu'], instructions: 'Stir fry veggies. Add sauce. Serve hot.' },
        { id: 4, title: 'Chicken Parmesan', calories: 600, time: 50, cuisine: 'Italian', image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=500&q=80', match: 75, ingredients: ['Chicken Breast', 'Marinara Sauce', 'Mozzarella', 'Breadcrumbs'], instructions: 'Bread chicken. Fry. Bake with cheese.' },
        { id: 5, title: 'Avocado Toast', calories: 220, time: 10, cuisine: 'American', image: 'https://images.unsplash.com/photo-1588137372308-15f75323a51d?w=500&q=80', match: 92, ingredients: ['Bread', 'Avocado', 'Salt', 'Pepper'], instructions: 'Toast bread. Mash avocado. Spread.' },
    ];

    const [recipes, setRecipes] = useState(initialRecipes);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All Cuisines');

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        time: 'All',
        calories: 'All',
        match: 'All'
    });

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Add Cuisine Modal State
    const [isAddCuisineOpen, setIsAddCuisineOpen] = useState(false);
    const [newCuisineName, setNewCuisineName] = useState('');

    // Form State (for adding/editing)
    const [formData, setFormData] = useState({
        title: '',
        cuisine: 'Italian',
        time: '',
        calories: '',
        image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&q=80',
        match: 100
    });

    // Filtering Logic
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCuisine = selectedCuisine === 'All Cuisines' || recipe.cuisine === selectedCuisine;

        let matchesTime = true;
        if (filters.time === '< 15 min') matchesTime = recipe.time < 15;
        if (filters.time === '< 30 min') matchesTime = recipe.time < 30;
        if (filters.time === '< 60 min') matchesTime = recipe.time < 60;

        let matchesCalories = true;
        if (filters.calories === '< 300 kcal') matchesCalories = recipe.calories < 300;
        if (filters.calories === '300-600 kcal') matchesCalories = recipe.calories >= 300 && recipe.calories <= 600;
        if (filters.calories === '> 600 kcal') matchesCalories = recipe.calories > 600;

        let matchesMatch = true;
        if (filters.match === '> 90%') matchesMatch = recipe.match > 90;
        if (filters.match === '> 80%') matchesMatch = recipe.match > 80;

        return matchesSearch && matchesCuisine && matchesTime && matchesCalories && matchesMatch;
    });

    const resetFilters = () => {
        setFilters({ time: 'All', calories: 'All', match: 'All' });
        setSelectedCuisine('All Cuisines');
        setIsFilterOpen(false);
    };

    // Handlers
    const handleAddNew = () => {
        setFormData({
            title: '',
            cuisine: cuisines[0] || 'Italian',
            time: '',
            calories: '',
            image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&q=80',
            match: 100
        });
        setCurrentRecipe(null);
        setIsEditModalOpen(true);
    };

    const handleEdit = (recipe) => {
        setFormData(recipe);
        setCurrentRecipe(recipe);
        setIsEditModalOpen(true);
    };

    const handleView = (recipe) => {
        setCurrentRecipe(recipe);
        setIsViewModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this recipe?')) {
            setRecipes(recipes.filter(r => r.id !== id));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            time: parseInt(formData.time) || 0,
            calories: parseInt(formData.calories) || 0
        };

        if (currentRecipe) {
            setRecipes(recipes.map(r => r.id === currentRecipe.id ? { ...r, ...finalData } : r));
        } else {
            const newRecipe = {
                id: Date.now(),
                ...finalData
            };
            setRecipes([...recipes, newRecipe]);
        }
        setIsEditModalOpen(false);
    };

    // Add Cuisine Handler
    const handleAddCuisine = () => {
        const trimmedName = newCuisineName.trim();
        if (trimmedName && !cuisines.includes(trimmedName)) {
            setCuisines([...cuisines, trimmedName]);
            setFormData({ ...formData, cuisine: trimmedName });
            setNewCuisineName('');
            setIsAddCuisineOpen(false);
        } else if (cuisines.includes(trimmedName)) {
            alert('This cuisine already exists!');
        }
    };

    return (
        <div className="space-y-6" onClick={() => setIsFilterOpen(false)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Recipe Management</h1>
                    <p className="text-gray-500 mt-1">Discover, add, or edit recipes for the platform</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-600 transition-colors flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Manual Recipe
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search recipes by name, ingredient, or tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 bg-white focus:outline-none focus:border-primary"
                    >
                        <option>All Cuisines</option>
                        {cuisines.map(c => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>

                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}
                            className={`flex items-center px-4 py-2.5 border rounded-lg transition-colors ${isFilterOpen || Object.values(filters).some(v => v !== 'All')
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            Filters
                            {Object.values(filters).some(v => v !== 'All') && (
                                <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                            )}
                        </button>

                        {/* Filter Popover */}
                        {isFilterOpen && (
                            <div
                                className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-30 p-5 animate-in fade-in slide-in-from-top-2 duration-200"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Max Cook Time</label>
                                        <div className="space-y-2">
                                            {['All', '< 15 min', '< 30 min', '< 60 min'].map(opt => (
                                                <label key={opt} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="time"
                                                        className="w-4 h-4 text-primary focus:ring-primary"
                                                        checked={filters.time === opt}
                                                        onChange={() => setFilters({ ...filters, time: opt })}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Calories</label>
                                        <select
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                                            value={filters.calories}
                                            onChange={(e) => setFilters({ ...filters, calories: e.target.value })}
                                        >
                                            <option value="All">Any Calories</option>
                                            <option value="< 300 kcal">Less than 300 kcal</option>
                                            <option value="300-600 kcal">300 - 600 kcal</option>
                                            <option value="> 600 kcal">More than 600 kcal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Match Score</label>
                                        <div className="flex gap-2">
                                            {['All', '> 80%', '> 90%'].map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => setFilters({ ...filters, match: opt })}
                                                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${filters.match === opt
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-3 flex justify-between items-center border-t border-gray-100">
                                        <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-600 font-medium">Reset All</button>
                                        <button onClick={() => setIsFilterOpen(false)} className="text-xs text-primary font-medium hover:underline">Apply Filters</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(recipe.id); }}
                            className="absolute top-2 left-2 z-10 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => handleView(recipe)}>
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-primary shadow-sm">
                                {recipe.match}% Match
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between min-h-[3rem]">
                                <h3 className="font-bold text-gray-800 line-clamp-2 cursor-pointer hover:text-primary" onClick={() => handleView(recipe)}>{recipe.title}</h3>
                            </div>
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md mb-4">{recipe.cuisine}</span>

                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {recipe.time} min
                                </div>
                                <div className="flex items-center">
                                    <Flame className="w-4 h-4 mr-1" />
                                    {recipe.calories} kcal
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
                                <button onClick={() => handleEdit(recipe)} className="flex-1 text-sm font-medium text-gray-600 bg-gray-50 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2">
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => handleView(recipe)} className="flex-1 text-sm font-medium text-primary bg-primary/10 py-2 rounded-lg hover:bg-primary/20 flex items-center justify-center gap-2">
                                    <Eye className="w-4 h-4" /> View
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredRecipes.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No recipes found. Try adjusting your search or filters.
                </div>
            )}

            {/* Empty State / API Promo */}
            <div className="text-center py-12 border-t border-gray-100 mt-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Want more recipes?</h3>
                <p className="text-gray-500 max-w-md mx-auto mt-2">Connect the <b>Spoonacular API</b> in Settings to unlock access to 5,000+ recipes automatically.</p>
                <button onClick={() => navigate('/settings')} className="mt-4 text-primary font-medium hover:underline flex items-center justify-center mx-auto">
                    Configure API Keys <ExternalLink className="w-4 h-4 ml-1" />
                </button>
            </div>

            {/* View Recipe Modal */}
            {isViewModalOpen && currentRecipe && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200" onClick={() => setIsViewModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="relative h-64">
                            <img src={currentRecipe.image} alt={currentRecipe.title} className="w-full h-full object-cover" />
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold text-primary shadow-sm">
                                {currentRecipe.match}% Match
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{currentRecipe.title}</h2>
                                    <span className="text-gray-500">{currentRecipe.time} mins • {currentRecipe.calories} kcal • {currentRecipe.cuisine}</span>
                                </div>
                                <button onClick={() => { setIsViewModalOpen(false); handleEdit(currentRecipe); }} className="text-gray-400 hover:text-primary transition-colors">
                                    <Edit2 className="w-5 h-5" />
                                </button>
                            </div>

                            <h4 className="font-semibold text-gray-800 mb-2">Ingredients</h4>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                                {currentRecipe.ingredients ? currentRecipe.ingredients.map((ing, i) => (
                                    <li key={i}>{ing}</li>
                                )) : <li>No ingredients listed.</li>}
                            </ul>

                            <h4 className="font-semibold text-gray-800 mb-2">Instructions</h4>
                            <p className="text-gray-600 leading-relaxed">
                                {currentRecipe.instructions || "No instructions provided."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">{currentRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                                    <div className="flex gap-2">
                                        <select
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary"
                                            value={formData.cuisine}
                                            onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                                        >
                                            {cuisines.map(c => (
                                                <option key={c}>{c}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddCuisineOpen(true)}
                                            className="p-2 border border-dashed border-gray-300 rounded-lg text-primary hover:bg-primary/5 hover:border-primary transition-colors"
                                            title="Add New Cuisine"
                                        >
                                            <PlusCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                        value={formData.calories}
                                        onChange={e => setFormData({ ...formData, calories: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 text-gray-600 font-medium">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 font-medium">Save Recipe</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Cuisine Modal */}
            {isAddCuisineOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Add New Cuisine</h3>
                            <button onClick={() => { setIsAddCuisineOpen(false); setNewCuisineName(''); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Indian, French, Thai..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    value={newCuisineName}
                                    onChange={e => setNewCuisineName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCuisine(); } }}
                                    autoFocus
                                />
                            </div>

                            {/* Current Cuisines */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Existing Cuisines</label>
                                <div className="flex flex-wrap gap-2">
                                    {cuisines.map(c => (
                                        <span key={c} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{c}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddCuisineOpen(false); setNewCuisineName(''); }}
                                    className="flex-1 py-2 border rounded-lg hover:bg-gray-50 text-gray-600 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddCuisine}
                                    disabled={!newCuisineName.trim()}
                                    className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Cuisine
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Recipes;
