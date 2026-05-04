import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { Equipment, Transaction } from "../types";
import { Shield, TrendingUp, DollarSign } from "lucide-react";

export default function Reports() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qEquip = query(collection(db, "equipment"));
    const unsubscribeEquip = onSnapshot(qEquip, (snapshot) => {
      setEquipment(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment)));
    });

    const qTrans = query(collection(db, "transactions"), orderBy("timestamp", "desc"), limit(100));
    const unsubscribeTrans = onSnapshot(qTrans, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "transactions");
    });

    return () => {
      unsubscribeEquip();
      unsubscribeTrans();
    };
  }, []);

  // Aggregate Pie Chart Data (Category Distribution)
  const categoryData = equipment.reduce((acc: any[], item) => {
    const existing = acc.find(a => a.name === item.category);
    if (existing) {
      existing.value += (item.stockLevel * item.unitPrice);
    } else {
      acc.push({ name: item.category, value: item.stockLevel * item.unitPrice });
    }
    return acc;
  }, []);

  // Aggregate Line Chart Data (Last 7 Days Flow)
  // Simplified mock logic since we might not have many real transactions yet
  const flowData = [
    { day: "MON", in: 120, out: 45 },
    { day: "TUE", in: 80, out: 90 },
    { day: "WED", in: 250, out: 120 },
    { day: "THU", in: 40, out: 180 },
    { day: "FRI", in: 190, out: 60 },
    { day: "SAT", in: 10, out: 15 },
    { day: "SUN", in: 5, out: 2 },
  ];

  const AMBER_COLORS = ["#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f"];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <header>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono uppercase">Strategic_Intelligence_Report</h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-tighter italic">Data Aggregation Cycle: 24H // Asset Valuation Metrics</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="industrial-card space-y-6">
          <div className="flex items-center gap-3 px-2 border-l-2 border-amber-500">
            <Shield className="w-5 h-5 text-amber-500" />
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Asset Value By Category</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={AMBER_COLORS[index % AMBER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "4px" }}
                  itemStyle={{ color: "#f59e0b", fontFamily: "monospace", fontSize: "10px" }}
                />
                <Legend 
                   wrapperStyle={{ paddingTop: "20px" }}
                   payload={categoryData.map((item, index) => ({
                     value: `${item.name} ($${(item.value/1000).toFixed(1)}k)`,
                     type: 'rect',
                     id: item.name,
                     color: AMBER_COLORS[index % AMBER_COLORS.length]
                   }))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="industrial-card space-y-6">
          <div className="flex items-center gap-3 px-2 border-l-2 border-amber-500">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Stock Flow Dynamics (7D)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="monospace"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "4px" }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="in" 
                  name="INFLOW"
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#10b981", strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="out" 
                  name="OUTFLOW"
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#f59e0b", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 industrial-card">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 px-2 border-l-2 border-amber-500">
              <DollarSign className="w-5 h-5 text-amber-500" />
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Inventory Liquidity Analysis</h2>
            </div>
            <div className="font-mono text-[10px] text-slate-500 bg-slate-950 px-3 py-1 rounded border border-slate-800 uppercase tracking-tighter">
              CONFIDENTIAL_DOCUMENT_0RA-X
            </div>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Gross Asset Value", value: `$${(categoryData.reduce((s, i) => s + i.value, 0) / 1000000).toFixed(2)}M`, note: "Current Net Worth" },
              { label: "Turnover Rate", value: "4.2x", note: "Monthly Avg" },
              { label: "Stock Accuracy", value: "99.98%", note: "Last Audit: 48h ago" }
            ].map((metric, i) => (
              <div key={i} className="p-6 bg-slate-950/50 border border-slate-800 rounded flex flex-col items-center text-center">
                <span className="text-[10px] text-slate-500 uppercase font-mono mb-2 tracking-widest">{metric.label}</span>
                <span className="text-3xl font-bold text-amber-500 font-sans tracking-tight mb-2">{metric.value}</span>
                <span className="text-[9px] text-slate-700 italic font-mono uppercase">{metric.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
