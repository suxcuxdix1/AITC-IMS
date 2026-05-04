import React from "react";
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldAlert
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; role: string } | null;
}

export default function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "shipments", label: "Shipments", icon: Truck },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col font-mono text-xs uppercase tracking-widest sticky top-0">
      <div className="p-8 flex items-center gap-3 border-b border-slate-800 bg-slate-900/50">
        <ShieldAlert className="text-amber-500 w-8 h-8 amber-glow" />
        <div className="flex flex-col">
          <span className="font-bold text-slate-100 text-lg leading-tight">ARMORTECH</span>
          <span className="text-amber-500/70 text-[10px]">IMS / SECURE UNIT</span>
        </div>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded transition-all duration-300 group ${
              activeTab === item.id 
                ? "bg-amber-500/10 text-amber-500 border-l-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-indicator"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 amber-glow"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-3 mb-6 p-3 bg-slate-950/50 border border-slate-800 rounded">
          <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-amber-500 font-bold border border-slate-700">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-slate-300 truncate">{user?.name || "LOGISTICS_OPERATOR"}</span>
            <span className="text-slate-600 text-[9px] truncate">{user?.role || "GUEST"}</span>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded transition-all group">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
