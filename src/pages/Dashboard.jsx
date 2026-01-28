import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, DollarSign, Activity, Zap, Server, AlertTriangle, Plus, FileText, ShoppingCart } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const KPICard = ({ title, value, subtext, icon: Icon, colorClass, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
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

// Mock Data
const revenueData = [
    { name: 'Jan', revenue: 4000, cost: 2400 },
    { name: 'Feb', revenue: 3000, cost: 1398 },
    { name: 'Mar', revenue: 2000, cost: 9800 },
    { name: 'Apr', revenue: 2780, cost: 3908 },
    { name: 'May', revenue: 1890, cost: 4800 },
    { name: 'Jun', revenue: 2390, cost: 3800 },
    { name: 'Jul', revenue: 3490, cost: 4300 },
];

const trafficData = [
    { name: '00:00', users: 120 },
    { name: '04:00', users: 50 },
    { name: '08:00', users: 890 },
    { name: '12:00', users: 1450 },
    { name: '16:00', users: 1200 },
    { name: '20:00', users: 980 },
    { name: '23:59', users: 340 },
];

const activityLog = [
    { id: 1, type: 'user', message: 'New user "Sarah Jones" signed up', time: '2 mins ago', icon: Users, color: 'text-blue-500' },
    { id: 2, type: 'system', message: 'Database backup completed successfully', time: '1 hour ago', icon: Server, color: 'text-emerald-500' },
    { id: 3, type: 'alert', message: 'High API latency detected (OpenAI)', time: '3 hours ago', icon: AlertTriangle, color: 'text-amber-500' },
    { id: 4, type: 'inventory', message: 'Low stock warning: Milk (Dairy)', time: '5 hours ago', icon: ShoppingCart, color: 'text-red-500' },
];

const Dashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const bgColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
                            System Operational
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
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
                    title="Total Revenue"
                    value="$12,450"
                    subtext="+15.3% vs last month"
                    trend="up"
                    icon={DollarSign}
                    colorClass="bg-violet-500"
                />
                <KPICard
                    title="Active Users"
                    value="1,240"
                    subtext="+86 new this week"
                    trend="up"
                    icon={Users}
                    colorClass="bg-blue-500"
                />
                <KPICard
                    title="API Costs (Est.)"
                    value="$342.10"
                    subtext="Within budget (75%)"
                    trend="neutral"
                    icon={Zap}
                    colorClass="bg-orange-500"
                />
                <KPICard
                    title="System Uptime"
                    value="99.98%"
                    subtext="No downtime detected"
                    trend="up"
                    icon={Activity}
                    colorClass="bg-emerald-500"
                />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue vs Costs Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800">Financial Overview</h3>
                        <select className="text-sm border-gray-200 border rounded-lg px-2 py-1 text-gray-500 outline-none">
                            <option>Last 6 Months</option>
                            <option>Year to Date</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="cost" name="Op. Costs" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-6">Recent Activity</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {activityLog.map((log) => (
                            <div key={log.id} className="flex gap-4">
                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center ${log.color}`}>
                                    <log.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-800 font-medium leading-snug">{log.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-primary border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        View All Logs
                    </button>
                </div>
            </div>

            {/* Sub Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Peak Usage Times (UTC)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                                <Bar dataKey="users" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative bg element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>
                            <span className="font-medium text-gray-300">Pro Tip</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Optimize API Costs</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Your OpenAI usage spiked by 22% yesterday. Consider switching your AI Model configuration to <span className="text-white font-semibold">GPT-3.5 Turbo</span> for routine tasks to save ~40% on operational costs.
                        </p>
                    </div>
                    <button onClick={() => navigate('/ai-controls')} className="bg-white text-gray-900 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors self-start z-10">
                        Review AI Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
