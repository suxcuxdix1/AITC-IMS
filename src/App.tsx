import React, { useState, useEffect } from "react";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signInAnonymously, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Reports from "./components/Reports";
import { ShieldAlert, Fingerprint } from "lucide-react";
import { motion } from "motion/react";
import { UserProfile } from "./types";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const profileDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (profileDoc.exists()) {
          setProfile({ id: firebaseUser.uid, ...profileDoc.data() } as UserProfile);
        } else {
          // New user - default to Logistics for safety
          const newProfile: UserProfile = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "anonymous@armortech.ims",
            role: "Logistics",
            name: firebaseUser.displayName || "Operator-" + firebaseUser.uid.slice(0, 4)
          };
          await setDoc(doc(db, "users", firebaseUser.uid), {
            email: newProfile.email,
            role: newProfile.role,
            name: newProfile.name
          });
          setProfile(newProfile);
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback to anonymous for demo purposes if Google fails in some environments
      await signInAnonymously(auth);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <motion.div
           animate={{ 
             scale: [1, 1.1, 1],
             opacity: [0.3, 0.6, 0.3]
           }}
           transition={{ duration: 2, repeat: Infinity }}
           className="relative"
        >
          <ShieldAlert className="w-16 h-16 text-amber-500 amber-glow" />
          <div className="absolute inset-0 border-2 border-amber-500 rounded-full animate-ping opacity-20" />
        </motion.div>
        <div className="flex flex-col items-center">
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Initializing Secure Protocol</span>
            <span className="text-amber-600 font-mono text-[8px] uppercase tracking-tighter mt-1">ArmorTech Encryption Layer v4.2 // Active</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center">
            <motion.div 
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl mb-6 amber-glow"
            >
              <ShieldAlert className="w-12 h-12 text-amber-500" />
            </motion.div>
            <h1 className="text-4xl font-bold text-slate-100 font-sans tracking-tight">ARMORTECH_IMS</h1>
            <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest italic">Inventory management system v1.0 // restricted_access</p>
          </div>

          <div className="industrial-card space-y-6">
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded text-left">
              <div className="flex items-center gap-3 text-amber-500 mb-2">
                <Fingerprint className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase font-mono tracking-widest">Identity Verification</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                ACCESS TO THIS SYSTEM IS RESTRICTED TO AUTHORIZED ARMORTECH PERSONNEL. UNAUTHORIZED ATTEMPTS WILL BE LOGGED AND TRACED TO THE ORIGINATING IP.
              </p>
            </div>

            <button 
              onClick={handleLogin}
              className="w-full bg-amber-500 text-slate-950 font-bold font-mono py-4 rounded hover:bg-amber-400 transition-all amber-glow uppercase tracking-tighter flex items-center justify-center gap-3"
            >
              Authorize_Secure_Session
            </button>
            <p className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">Biometric or Token Required</p>
          </div>
          
          <footer className="pt-12">
            <p className="text-[8px] text-slate-700 font-mono uppercase tracking-widest">© 2026 ARMORTECH INDUSTRIES CORP // PRIVATE & CONFIDENTIAL</p>
          </footer>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <Inventory />;
      case "reports":
        return <Reports />;
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-700 font-mono p-12 text-center">
            <ShieldAlert className="w-16 h-16 mb-4 opacity-10" />
            <h2 className="text-xl uppercase tracking-widest">Component_Under_Maintenance</h2>
            <p className="text-xs mt-2 uppercase tracking-tighter italic">This module {activeTab} is currently being hardened. Check back soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={profile} />
      <main className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
}
