import { useState } from 'react';
import { useProxy } from '../hooks/useProxy';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogOut, ExternalLink, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { fetchExternalProxy, loading, error } = useProxy();
    const [proxyData, setProxyData] = useState<unknown>(null);

    const handleTestProxy = async () => {
        // Testing the proxy to an external API (avoiding CORS and keeping keys safe)
        const data = await fetchExternalProxy('https://jsonplaceholder.typicode.com/posts/1');
        setProxyData(data);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">

                <header className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MinCultura Dashboard</h1>
                        <p className="text-slate-500 mt-1">Gobernanza Corporativa SPA Baseline.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-600 px-3 py-1 bg-slate-100 rounded-full">
                            {user?.email} ({user?.role})
                        </span>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <ShieldAlert className="text-indigo-500" />
                            Serverless Proxy Test
                        </h2>
                        <p className="text-sm text-slate-600 mb-6">
                            Use the local proxy Serverless Function to call external APIs without CORS errors.
                        </p>
                        <button
                            onClick={handleTestProxy}
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all shadow-sm disabled:opacity-70 cursor-pointer"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <ExternalLink size={18} />}
                            Fetch External JSON
                        </button>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-slate-900 rounded-2xl shadow-md text-emerald-400 overflow-hidden">
                        <h3 className="text-sm font-semibold mb-3 text-slate-400">Proxy Output:</h3>
                        <pre className="text-xs font-mono overflow-auto h-48 scrollbar-thin scrollbar-thumb-slate-700">
                            {proxyData ? JSON.stringify(proxyData, null, 2) : '// No proxy data yet...'}
                        </pre>
                    </div>
                </main>
            </div>
        </div>
    );
}
