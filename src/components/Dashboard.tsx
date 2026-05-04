import React from "react";
import { 
  TrendingUp, 
  AlertTriangle, 
  PackageCheck, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Clock
} from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendType?: "up" | "down";
  alert?: boolean;
}

function StatCard({ label, value, icon: Icon, trend, trendType, alert }: StatCardProps) {
  return (
    <div className={`industrial-card flex flex-col gap-4 relative overflow-hidden transition-all hover:border-slate-700 active:scale-[0.98] ${alert ? 'border-amber-500/50' : ''}`}>
      {alert && (
        <div className="absolute top-0 right-0 p-2">
          <AlertTriangle className="text-amber-500 w-4 h-4 animate-pulse" />
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className="p-3 bg-slate-950 rounded border border-slate-800 text-amber-500">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1 ${
            trendType === 'up' ? 'text-green-500 bg-green-500/5' : 'text-red-500 bg-red-500/5'
          }`}>
            {trendType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-[10px] uppercase tracking-widest font-mono mb-1">{label}</h3>
        <p className="text-2xl font-bold text-slate-100 font-sans tracking-tight">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const recentActivity = [
    { id: 1, type: "IN", item: "Ballistic Vest Lvl IV", qty: 25, timestamp: "14:23:01", user: "Operator-07" },
    { id: 2, type: "OUT", item: "Tactical Shield - Riot", qty: 12, timestamp: "12:45:12", user: "Logistics-A" },
    { id: 3, type: "IN", item: "Ceramic Plate SAPI", qty: 100, timestamp: "10:15:44", user: "Admin-HQ" },
    { id: 4, type: "OUT", item: "Vehicle Plating - BR7", qty: 4, timestamp: "09:30:22", user: "Operator-12" },
    { id: 5, type: "IN", item: "Advanced Kevlar Mesh", qty: 500, timestamp: "Yesterday", user: "Logistics-C" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-4">
            COMMAND_DASHBOARD
            <div className="h-1px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent min-w-[200px]" />
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-tighter italic">Unified Inventory Control System // Real-time Feed Active</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 font-mono text-xl tabular-nums">04.MAY.2026</p>
          <p className="text-amber-500/60 font-mono text-xs uppercase">Location: Region-AS1 / Main Depot</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Assets" 
          value="1,429 Units" 
          icon={PackageCheck} 
          trend="+12.5%" 
          trendType="up" 
        />
        <StatCard 
          label="Low Stock Alerts" 
          value="08 ITEMS" 
          icon={AlertTriangle} 
          alert={true}
        />
        <StatCard 
          label="Active Shipments" 
          value="14 PENDING" 
          icon={TrendingUp} 
          trend="4.2%" 
          trendType="up" 
        />
        <StatCard 
          label="Monthly Valuation" 
          value="$2.4M USD" 
          icon={DollarSign} 
          trend="-2.1%" 
          trendType="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-slate-100 font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Recent System Activity
            </h2>
            <button className="text-[10px] text-amber-500 font-mono hover:underline uppercase">View All Ledger</button>
          </div>
          
          <div className="industrial-card p-0 overflow-hidden border-slate-800/50">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="p-4 text-slate-500 font-medium">TYPE</th>
                  <th className="p-4 text-slate-500 font-medium">ITEM_DESCRIPTION</th>
                  <th className="p-4 text-slate-500 font-medium">QTY</th>
                  <th className="p-4 text-slate-500 font-medium">USER_ID</th>
                  <th className="p-4 text-slate-500 font-medium text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors group">
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded ${log.type === 'IN' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 group-hover:text-amber-500 transition-colors">{log.item}</td>
                    <td className="p-4 font-bold text-slate-100">{log.qty}</td>
                    <td className="p-4 text-slate-400">{log.user}</td>
                    <td className="p-4 text-right text-slate-500">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-slate-100 font-mono text-xs uppercase tracking-[0.2em] font-bold px-2">System Health</h2>
          <div className="industrial-card space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500 uppercase">Database Sync</span>
                <span className="text-green-500 uppercase font-bold">100% ONLINE</span>
              </div>
              <div className="h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div 
                  className="h-full bg-green-500 amber-glow" 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500 uppercase">Storage Capacity</span>
                <span className="text-amber-500 uppercase font-bold">84% FULL</span>
              </div>
              <div className="h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div 
                  className="h-full bg-amber-500 amber-glow" 
                  initial={{ width: 0 }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="p-4 bg-slate-950/50 border border-red-500/20 rounded-lg flex items-start gap-4">
                <div className="p-2 bg-red-500/10 rounded border border-red-500/30 text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Critical Low Stock</h4>
                  <p className="text-[10px] text-slate-500 font-mono">SAPI Plates reach critical threshold in Main Depot Warehouse.</p>
                  <button className="mt-2 text-[10px] text-red-400 font-mono hover:underline uppercase">Create PO</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
