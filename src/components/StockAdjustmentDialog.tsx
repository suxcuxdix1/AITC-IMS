import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Equipment } from "../types";
import { db, handleFirestoreError, OperationType, auth } from "../lib/firebase";
import { doc, runTransaction, serverTimestamp, collection, addDoc } from "firebase/firestore";

interface StockAdjustmentDialogProps {
  item: Equipment;
  isOpen: boolean;
  onClose: () => void;
}

export default function StockAdjustmentDialog({ item, isOpen, onClose }: StockAdjustmentDialogProps) {
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const itemRef = doc(db, "equipment", item.id);
        const itemSnap = await transaction.get(itemRef);
        
        if (!itemSnap.exists()) {
          throw new Error("Item not found");
        }

        const currentStock = itemSnap.data().stockLevel;
        const newStock = type === "IN" ? currentStock + quantity : currentStock - quantity;

        if (newStock < 0) {
          throw new Error("Insufficient Stock");
        }

        // Update Equipment
        transaction.update(itemRef, { stockLevel: newStock });

        // Add Transaction Log
        const logRef = doc(collection(db, "transactions"));
        transaction.set(logRef, {
          type,
          quantity,
          equipmentId: item.id,
          userId: auth.currentUser?.uid,
          timestamp: serverTimestamp(),
          note
        });
      });
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "transactions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="industrial-card w-full max-w-md relative z-10 border-amber-500/30"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-100 font-mono uppercase tracking-widest">Stock_Adjustment</h2>
              <span className="text-[10px] text-slate-500 font-mono">REF_{item.sku}</span>
            </div>

            <div className="mb-6 p-4 bg-slate-950 rounded border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase font-mono mb-1">Target Asset</p>
              <p className="text-slate-100 font-bold">{item.name}</p>
              <p className="text-amber-500 text-xs font-mono mt-1">Current Balance: {item.stockLevel} units</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded border border-slate-800">
                <button 
                  type="button"
                  onClick={() => setType("IN")}
                  className={`py-2 rounded font-mono text-[10px] uppercase transition-all ${type === 'IN' ? 'bg-green-500 text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  [+] Stock In
                </button>
                <button 
                  type="button"
                  onClick={() => setType("OUT")}
                  className={`py-2 rounded font-mono text-[10px] uppercase transition-all ${type === 'OUT' ? 'bg-red-500 text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  [-] Stock Out
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Audit Note / Reason</label>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none h-24 resize-none"
                  placeholder="E.G. ROUTINE PROCUREMENT, DEPLOYMENT TO UNIT X..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-900 text-slate-400 font-bold font-mono py-3 rounded border border-slate-800 hover:text-white transition-all uppercase text-[10px]"
                >
                  Abort
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className={`flex-1 font-bold font-mono py-3 rounded transition-all uppercase text-[10px] amber-glow ${
                    type === 'IN' ? 'bg-green-500 text-slate-950' : 'bg-red-500 text-slate-950'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? "COMMITTING..." : "AUTHORIZE_ADJUSTMENT"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
