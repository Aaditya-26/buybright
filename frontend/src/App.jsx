import { useEffect, useState } from "react";
import client from "./api/client";

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/health")
      .then((res) => setHealth(res.data))
      .catch(() => setError("Cannot reach the backend"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">BuyBright</h1>
        <p className="text-slate-500 mt-1 mb-6 text-sm">Frontend connected to FastAPI backend?</p>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        
        {health && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-xl text-sm font-semibold border border-emerald-100">
              <span>Backend Status</span>
              <span className="uppercase tracking-wider text-xs bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                {health.status}
              </span>
            </div>
            <pre className="text-xs bg-slate-900 text-emerald-400 rounded-xl p-4 overflow-x-auto font-mono">
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        )}
        
        {!health && !error && (
          <div className="flex items-center space-x-3 text-slate-400 text-sm">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
            <span>Testing connection to API...</span>
          </div>
        )}
      </div>
    </div>
  );
}

