import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  ChevronDown, 
  Download,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Equipment } from "../types";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, onSnapshot, query, addDoc, serverTimestamp } from "firebase/firestore";
import StockAdjustmentDialog from "./StockAdjustmentDialog";

export default function Inventory() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);

  useEffect(() => {
    const q = query(collection(db, "equipment"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const equipData: Equipment[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Equipment));
      setItems(equipData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "equipment");
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono uppercase">Master_Inventory</h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-tighter italic">Secured Storage Ledger // Total Records: {items.length}</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px] uppercase px-4 py-2 rounded hover:bg-slate-800 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-500 text-slate-950 font-mono font-bold text-[10px] uppercase px-4 py-2 rounded hover:bg-amber-400 transition-all amber-glow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Register New Asset
          </button>
        </div>
      </div>

      <div className="industrial-card p-4 flex flex-wrap gap-4 items-center justify-between bg-slate-900/50">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="SEARCH_BY_SKU_OR_ITEM_NAME..." 
            className="w-full bg-slate-950 border border-slate-800 rounded px-10 py-2 text-slate-100 font-mono text-xs focus:border-amber-500/50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
            <Filter className="w-4 h-4" /> FILTER_BY:
          </div>
          <select 
            className="bg-slate-950 border border-slate-800 rounded px-4 py-2 text-slate-300 font-mono text-xs focus:border-amber-500/50 outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Ballistic Vest">Ballistic Vest</option>
            <option value="Vehicle Plating">Vehicle Plating</option>
            <option value="Tactical Helmet">Tactical Helmet</option>
            <option value="Shield">Shield</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="industrial-card p-0 overflow-hidden border-slate-800/50">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-500 uppercase">
            <tr>
              <th className="p-4 font-medium">SKU_ID</th>
              <th className="p-4 font-medium">ITEM_NAME</th>
              <th className="p-4 font-medium">CATEGORY</th>
              <th className="p-4 font-medium">STOCK_LEVEL</th>
              <th className="p-4 font-medium">UNIT_PRICE</th>
              <th className="p-4 font-medium">STATUS</th>
              <th className="p-4 font-medium text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.tr 
                  key={item.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors group ${item.stockLevel < item.reorderPoint ? 'bg-red-500/5' : ''}`}
                >
                  <td className="p-4 text-slate-500">{item.sku}</td>
                  <td className="p-4 text-slate-100 font-bold tracking-tight">{item.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className={`p-4 font-bold ${item.stockLevel < item.reorderPoint ? 'text-red-400' : 'text-slate-100'}`}>
                    {item.stockLevel}
                  </td>
                  <td className="p-4 text-slate-400">${item.unitPrice.toLocaleString()}</td>
                  <td className="p-4">
                    {item.stockLevel < item.reorderPoint ? (
                      <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold">
                        <AlertCircle className="w-3 h-3" /> CRITICAL_LOW
                      </span>
                    ) : (
                      <span className="text-green-500 text-[10px] font-bold">IN_STOCK</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => setSelectedItem(item)}
                        className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded text-[9px] hover:bg-amber-500 hover:text-slate-950 transition-all font-bold uppercase"
                      >
                        Adjust
                      </button>
                      <button className="text-slate-600 hover:text-amber-500 transition-colors p-1">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredItems.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-600 font-mono italic">
                  NO_RECORDS_MATCHING_CRITERIA
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-amber-500 font-mono animate-pulse">
                  FETCHING_SECURE_DATA...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <StockAdjustmentDialog 
          item={selectedItem} 
          isOpen={!!selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      {/* Add New Asset Slide-over (Simplified for now) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-[450px] bg-slate-900 border-l border-slate-800 z-50 p-8 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 font-mono uppercase tracking-widest">Register_Asset</h2>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Form ID: RE-90-221 // Secure Protocol</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-500 hover:text-white font-mono text-xl"
                >
                  [X]
                </button>
              </div>

              <form className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const sku = formData.get("sku") as string;
                const category = formData.get("category") as any;
                const stockLevel = parseInt(formData.get("stockLevel") as string);
                const reorderPoint = parseInt(formData.get("reorderPoint") as string);
                const unitPrice = parseFloat(formData.get("unitPrice") as string);

                try {
                  await addDoc(collection(db, "equipment"), {
                    name, sku, category, stockLevel, reorderPoint, unitPrice
                  });
                  setIsAddModalOpen(false);
                } catch (err) {
                  handleFirestoreError(err, OperationType.CREATE, "equipment");
                }
              }}>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Asset Name</label>
                  <input name="name" type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">SKU Identifier</label>
                    <input name="sku" type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Category</label>
                    <select name="category" className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none">
                      <option value="Ballistic Vest">Ballistic Vest</option>
                      <option value="Vehicle Plating">Vehicle Plating</option>
                      <option value="Tactical Helmet">Tactical Helmet</option>
                      <option value="Shield">Shield</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Initial Stock</label>
                    <input name="stockLevel" type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Reorder Point</label>
                    <input name="reorderPoint" type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Unit Price (USD)</label>
                  <input name="unitPrice" type="number" step="0.01" className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none" required />
                </div>

                <div className="pt-8 border-t border-slate-800">
                  <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold font-mono py-4 rounded hover:bg-amber-400 transition-all amber-glow uppercase tracking-tighter">
                    COMMIT_TO_DATABASE
                  </button>
                  <p className="mt-4 text-[9px] text-slate-600 font-mono text-center uppercase italic">All entries are cryptographically signed and logged for audit purposes.</p>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
