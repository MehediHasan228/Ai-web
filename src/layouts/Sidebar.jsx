import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ChefHat, ShoppingCart, Settings, List, Activity, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
    const { user } = useUser();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: ChefHat, label: 'Recipes', path: '/recipes' },
        { icon: List, label: 'Inventory Data', path: '/inventory' },
        { icon: ShoppingCart, label: 'Grocery Lists', path: '/grocery' },
        { icon: Activity, label: 'AI Controls', path: '/ai-controls' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="bg-dark text-white w-64 min-h-screen flex flex-col transition-all duration-300">
            <div className="p-6 border-b border-gray-700 flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg mr-3 flex items-center justify-center font-bold text-white">S</div>
                <span className="text-xl font-bold tracking-wide">Savora Admin</span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-primary/20 text-primary font-medium'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300 border border-transparent hover:border-gray-700/50 group cursor-pointer relative overflow-hidden">
                    {/* subtle glow effect */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    <NavLink to="/settings" className="flex items-center gap-3 z-10 w-full">
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt="Admin Avatar"
                                className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-colors"
                            />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
                            <p className="text-xs text-gray-400 truncate group-hover:text-gray-300">{user.role}</p>
                        </div>
                    </NavLink>

                    <button
                        onClick={() => { if (window.confirm('Are you sure you want to logout?')) alert('Logged out!'); }}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all ml-2 z-10"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
