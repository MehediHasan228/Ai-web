import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Save, RotateCcw, Send, Bot, User as UserIcon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { aiService } from '../services/api';

const AIControls = () => {
    const { aiConfig, updateAiConfig } = useUser();

    // Local state for configuration to allow editing before saving
    const [config, setConfig] = useState({ ...aiConfig });
    const [isSaving, setIsSaving] = useState(false);

    // Chat Playground State
    const [inputMessage, setInputMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'user', content: 'I have chicken and rice. What can I make in under 20 mins?' },
        { role: 'ai', content: 'Here is a quick recipe for "Chicken Fried Rice":\n1. Dice chicken...\n2. Cook rice with soy sauce and veggies.\n3. Serve hot!' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Sync local state when context changes (e.g. on mount or external update)
    useEffect(() => {
        setConfig({ ...aiConfig });
    }, [aiConfig]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isTyping]);


    // Handlers
    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateAiConfig(config);
            setIsSaving(false);
            alert("AI Configuration saved successfully!");
        }, 800);
    };

    const handleReset = () => {
        if (window.confirm("Reset to default recommendations?")) {
            const defaults = {
                model: 'GPT-4 (Recommended)',
                temperature: 0.7,
                systemPrompt: "You are an expert chef and nutritional planner. Create meal plans that are efficient, cost-effective, and adhere strictly to the user's dietary restrictions."
            };
            setConfig(defaults);
            updateAiConfig(defaults); // Immediate save for reset
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = { role: 'user', content: inputMessage };
        setChatHistory(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await aiService.chat({
                messages: chatHistory.concat(userMsg),
                systemPrompt: config.systemPrompt,
                temperature: config.temperature
            });

            setChatHistory(prev => [...prev, { role: 'ai', content: response.data.content }]);
        } catch (error) {
            console.error('AI Error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to connect to AI engine. Please check your API key.';
            setChatHistory(prev => [...prev, { role: 'ai', content: `Error: ${errorMsg}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">AI Controls (OpenAI)</h1>
                    <p className="text-gray-500 mt-1">Configure user behavior and prompt engineering</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="text-gray-600 bg-white border border-gray-200 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 flex items-center transition-colors"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-600 transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                {/* Configuration Panel */}
                <div className="space-y-6 overflow-y-auto pr-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                            <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                            Model Configuration
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Model Selection</label>
                                <select
                                    value={config.model}
                                    onChange={(e) => setConfig({ ...config, model: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                                >
                                    <option>GPT-4 (Recommended)</option>
                                    <option>GPT-3.5 Turbo (Faster)</option>
                                    <option>GPT-4 Turbo (Preview)</option>
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Temperature (Creativity)</label>
                                    <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded text-sm">{config.temperature}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={config.temperature}
                                    onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                    <span>Precise (0.0)</span>
                                    <span>Balanced (0.5)</span>
                                    <span>Creative (1.0)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1">
                        <h3 className="font-bold text-gray-800 mb-4">System Prompt (Context)</h3>
                        <p className="text-sm text-gray-500 mb-3">This system instruction is sent with every API call to ground the AI's persona.</p>
                        <textarea
                            value={config.systemPrompt}
                            onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                            className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm leading-relaxed resize-none"
                            placeholder="Enter system instructions here..."
                        ></textarea>
                    </div>
                </div>

                {/* Logs / Test Panel */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                        Test Playground
                        <span className="text-xs font-normal text-gray-500 border border-gray-200 px-2 py-1 rounded bg-gray-50">Simulation Mode</span>
                    </h3>

                    {/* Chat Log */}
                    <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 p-4 mb-4 overflow-y-auto space-y-4">
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-600'
                                    }`}>
                                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-gray-800 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                                    }`}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type a test message..."
                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim() || isTyping}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-dark text-white rounded-md hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIControls;
