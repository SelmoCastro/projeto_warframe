import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Hammer, 
  TrendingUp, 
  AlertCircle,
  Loader2,
  Package,
  Activity,
  Settings,
  Database,
  Server,
  Terminal,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface DropLocation {
  location: string;
  mission_type: string;
  chance: number;
}

interface CraftingResource {
  resource_name: string;
  quantity: number;
}

interface ItemResult {
  item_name: string;
  thumb_url: string;
  drop_locations: DropLocation[];
  crafting_resources: CraftingResource[];
  market_price: number | null;
}

interface SystemStats {
  totalItems: number;
  cachedPrices: number;
  ramUsage: number;
  uptimeHours: number;
  status: string;
}

// --- Components ---

function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const navItems = [
    { id: 'dashboard', icon: Activity, label: 'System Dashboard' },
    { id: 'search', icon: Search, label: 'Item Search Hub' },
    { id: 'settings', icon: Settings, label: 'Configuration' },
  ];

  return (
    <div className="w-64 h-screen bg-[#141414] border-r border-[#262626] flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-[#262626]">
        <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
          <Package className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-widest uppercase text-zinc-100">Info Hub</h1>
          <p className="text-[10px] text-zinc-500 font-mono">RASPBERRY PI // DEBIAN</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#262626]">
        <div className="bg-zinc-900 rounded p-3 border border-zinc-800 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs font-mono text-zinc-400">
            <p>FastAPI: Online</p>
            <p>Port: 8000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const [stats, setStats] = useState<SystemStats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-6xl mx-auto space-y-8"
    >
      <header>
        <h2 className="text-2xl font-semibold text-zinc-100">System Overview</h2>
        <p className="text-sm text-zinc-500 mt-1">Real-time monitoring of your Raspberry Pi Warframe Hub.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Database className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-zinc-400">Items in SQLite</p>
          <p className="text-4xl font-light text-zinc-100 mt-2 font-mono">{stats?.totalItems || 0}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-500">
            <span>Local Database</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <TrendingUp className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-zinc-400">Cached Prices</p>
          <p className="text-4xl font-light text-zinc-100 mt-2 font-mono">{stats?.cachedPrices || 0}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-500">
            <span>LRU Cache (Memory)</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-emerald-500/20 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Server className="w-24 h-24 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-emerald-500/80">RAM Usage</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-light text-emerald-500 font-mono">{stats?.ramUsage || 0}</p>
            <span className="text-sm text-emerald-500/50 font-medium">MB</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-500/70">
            <span>Of 1024 MB Total</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Clock className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-zinc-400">Uptime</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-light text-zinc-100 font-mono">{stats?.uptimeHours || 0}</p>
            <span className="text-sm text-zinc-500 font-medium">Hours</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
            <span>Since last reboot</span>
          </div>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-5 h-5 text-zinc-400" />
          <h3 className="text-sm font-medium text-zinc-200">FastAPI Server Logs</h3>
        </div>
        <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-zinc-400 space-y-2 border border-zinc-800/50">
          <p><span className="text-emerald-500">[INFO]</span> Application startup complete.</p>
          <p><span className="text-emerald-500">[INFO]</span> Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)</p>
          <p><span className="text-emerald-500">[INFO]</span> SQLite Database connected. Indexes verified.</p>
          <p><span className="text-blue-400">[HTTP]</span> GET /api/search?query=chroma 200 OK</p>
          <p><span className="text-amber-500">[CACHE]</span> WFM API called for 'chroma_prime_set'. Saved to LRU Cache.</p>
          <p><span className="text-blue-400">[HTTP]</span> GET /api/search?query=argon 200 OK</p>
        </div>
      </div>
    </motion.div>
  );
}

function SearchView() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ItemResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || query.length < 3) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to fetch data');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-zinc-100">Item Search Hub</h2>
        <p className="text-sm text-zinc-500 mt-1">Search the local SQLite database and fetch live WFM prices.</p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-2xl mb-12">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for an item (e.g., Chroma Prime Set, Argon Crystal)..."
            className="w-full bg-[#141414] border border-[#262626] rounded-xl py-4 pl-12 pr-32 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all shadow-lg"
          />
          <button
            type="submit"
            disabled={loading || query.length < 3}
            className="absolute right-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-medium rounded-lg transition-colors text-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </form>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h3 className="text-red-500 font-medium">Search Failed</h3>
              <p className="text-red-400/80 text-sm mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Item Header Card */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="w-32 h-32 shrink-0 bg-black/50 rounded-xl border border-[#262626] p-4 flex items-center justify-center relative z-10">
                {result.thumb_url ? (
                  <img src={result.thumb_url} alt={result.item_name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
                ) : (
                  <Package className="w-12 h-12 text-zinc-700" />
                )}
              </div>

              <div className="flex-1 text-center md:text-left relative z-10">
                <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">{result.item_name}</h2>
                
                {result.market_price !== null ? (
                  <div className="mt-4 inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-amber-500/70 font-semibold">WFM Avg Price (48h)</p>
                      <p className="text-xl font-mono text-amber-400 font-bold">{result.market_price} <span className="text-sm font-sans font-normal text-amber-500/50">pt</span></p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 inline-flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2">
                    <p className="text-xs text-zinc-400">Untradable Item</p>
                  </div>
                )}
              </div>
            </div>

            {/* Data Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Drops Panel */}
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#262626]">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-zinc-200">Drop Locations</h3>
                </div>
                
                {result.drop_locations.length > 0 ? (
                  <ul className="space-y-3">
                    {result.drop_locations.map((drop, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-[#262626]/50 hover:border-blue-500/30 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-zinc-200">{drop.location}</p>
                          <p className="text-xs text-zinc-500">{drop.mission_type}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded border border-blue-500/20">
                            {drop.chance}%
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">No drop locations found.</p>
                )}
              </div>

              {/* Crafting Panel */}
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#262626]">
                  <Hammer className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-medium text-zinc-200">Crafting Requirements</h3>
                </div>
                
                {result.crafting_resources.length > 0 && result.crafting_resources[0].resource_name !== 'None' ? (
                  <ul className="space-y-3">
                    {result.crafting_resources.map((res, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-[#262626]/50 hover:border-emerald-500/30 transition-colors">
                        <p className="text-sm font-medium text-zinc-200">{res.resource_name}</p>
                        <span className="text-sm font-mono text-emerald-400">x{res.quantity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">No crafting requirements.</p>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SettingsView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-4xl mx-auto space-y-8"
    >
      <header>
        <h2 className="text-2xl font-semibold text-zinc-100">Configuration</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage API limits and memory constraints for your Raspberry Pi.</p>
      </header>

      <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-4">Memory Management (LRU Cache)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Max Cache Items
              </label>
              <input 
                type="number" 
                defaultValue={500}
                className="w-full bg-black border border-[#262626] rounded-lg px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
              />
              <p className="text-xs text-zinc-500 mt-2">Limits RAM usage. 500 items ~ 15MB.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Cache TTL (Seconds)
              </label>
              <input 
                type="number" 
                defaultValue={3600}
                className="w-full bg-black border border-[#262626] rounded-lg px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
              />
              <p className="text-xs text-zinc-500 mt-2">Time before fetching fresh WFM prices.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#262626]">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">Database</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                SQLite Path
              </label>
              <input 
                type="text" 
                defaultValue="/home/pi/warframe_hub.db"
                className="w-full bg-black border border-[#262626] rounded-lg px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button className="px-6 py-2.5 bg-amber-500 text-black font-medium text-sm rounded-lg hover:bg-amber-400 transition-colors">
            Save Configuration
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-300 overflow-hidden selection:bg-amber-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}
