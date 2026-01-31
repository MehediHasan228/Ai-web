import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, DollarSign, Activity, Zap, Server, AlertTriangle, Plus, FileText, ShoppingCart, RefreshCw } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { systemService } from '../services/api';

const KPICard = ({ title, value, subtext, icon: Icon, colorClass, trend, isLoading }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
                <div className="h-8 w-24 bg-gray-100 animate-pulse rounded mt-2"></div>
            ) : (
                <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
            )}
            {subtext && (
                <p className={`text-xs mt-1 font-medium flex items-center ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                    {subtext}
                </p>
            )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const response = await systemService.getStats();
            setStats(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

    const planPieData = stats?.users?.plans?.map(p => ({
        name: p.plan,
        value: p._count.id
    })) || [];

    const inventoryBarData = stats?.inventory?.locations?.map(l => ({
        name: l.location,
        count: l._count.id
    })) || [];

    // Construct a more active activity log from real data
    const activityLog = stats ? [
        ...(stats.recentActivity.users?.map(u => ({
            id: `u-${u.name}-${u.createdAt}`,
            type: 'user',
            message: `New user: ${u.name}`,
            time: new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: Users,
            color: 'text-blue-500',
            rawTime: new Date(u.createdAt)
        })) || []),
        ...(stats.recentActivity.recipes?.map(r => ({
            id: `r-${r.title}-${r.createdAt}`,
            type: 'recipe',
            message: `New recipe: ${r.title}`,
            time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: FileText,
            color: 'text-emerald-500',
            rawTime: new Date(r.createdAt)
        })) || []),
        ...(stats.recentActivity.items?.map(i => ({
            id: `i-${i.name}-${i.createdAt}`,
            type: 'inventory',
            message: `Added to ${i.location}: ${i.name}`,
            time: new Date(i.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: ShoppingCart,
            color: 'text-orange-500',
            rawTime: new Date(i.createdAt)
        })) || [])
    ].sort((a, b) => b.rawTime - a.rawTime).slice(0, 5) : [];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header / Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user.name.split(' ')[0]} 👋
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center text-sm text-gray-500">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                            Live System Analytics
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-400 italic">Last sync: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={fetchStats} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => navigate('/users')} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center transition-colors">
                        <Users className="w-4 h-4 mr-2" /> Manage Users
                    </button>
                    <button onClick={() => navigate('/recipes')} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-emerald-600 flex items-center transition-colors">
                        <Plus className="w-4 h-4 mr-2" /> New Recipe
                    </button>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Registered Users"
                    value={stats?.users?.total || 0}
                    subtext="Real-time count"
                    trend="up"
                    icon={Users}
                    colorClass="bg-blue-500"
                    isLoading={isLoading}
                />
                <KPICard
                    title="Est. Grocery Budget"
                    value={`$${stats?.grocery?.estimatedBudget?.toFixed(2) || '0.00'}`}
                    subtext="Current active list"
                    trend="neutral"
                    icon={DollarSign}
                    colorClass="bg-violet-500"
                    isLoading={isLoading}
                />
                <KPICard
                    title="Expiring Soon"
                    value={stats?.inventory?.expiringSoon || 0}
                    subtext={`${stats?.inventory?.expired || 0} already expired`}
                    trend={stats?.inventory?.expiringSoon > 0 ? "down" : "up"}
                    icon={AlertTriangle}
                    colorClass={stats?.inventory?.expiringSoon > 0 ? "bg-red-500" : "bg-emerald-500"}
                    isLoading={isLoading}
                />
                <KPICard
                    title="System Health"
                    value="Stable"
                    subtext="All services active"
                    trend="up"
                    icon={Activity}
                    colorClass="bg-orange-500"
                    isLoading={isLoading}
                />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Plan Distribution Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">User Tier Distribution</h3>
                    <div className="h-80 flex flex-col md:flex-row items-center justify-around">
                        <div className="w-full md:w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={planPieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {planPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-4 px-4 overflow-y-auto max-h-full">
                            {planPieData.length > 0 ? planPieData.map((entry, idx) => (
                                <div key={entry.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                        <span className="text-sm text-gray-600 font-medium">{entry.name} Plan</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">{entry.value} Users</span>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-400 text-center">No user data available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                    <h3 className="font-bold text-gray-800 mb-6">Real-Time Activity</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {activityLog.length > 0 ? activityLog.map((log) => (
                            <div key={log.id} className="flex gap-4">
                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center ${log.color}`}>
                                    <log.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800 font-medium leading-snug truncate">{log.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10">
                                <Activity className="w-10 h-10 mb-2 opacity-20" />
                                <p className="text-sm">No recent activity detected.</p>
                            </div>
                        )}
                    </div>
                    <button onClick={() => navigate('/users')} className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-primary border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        View User Audit Logs
                    </button>
                </div>
            </div>

            {/* Sub Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Inventory Location Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={inventoryBarData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>
                            <span className="font-medium text-gray-300">Operational Tip</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Content Strategy</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            You have <span className="text-white font-semibold">{stats?.recipes?.total || 0} recipes</span> in the database.
                            Users are searching for <span className="text-white font-semibold italic">{stats?.recipes?.cuisines?.[0]?.cuisine || "diverse"}</span> cuisines.
                            Consider adding more content there to increase engagement.
                        </p>
                    </div>
                    <div className="flex gap-3 z-10">
                        <button onClick={() => navigate('/recipes')} className="bg-white text-gray-900 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                            Manage Content
                        </button>
                        <button onClick={() => navigate('/ai-controls')} className="bg-white/10 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-white/20 transition-colors border border-white/10">
                            Configure AI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
