import React from "react";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-[#08090a]">
      <style>{`
        * { box-sizing: border-box; }
        :root {
          --bg: #08090a;
          --surface: #0c0d0f;
          --border: rgba(255,255,255,0.06);
        }
        body { background: #08090a; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
      {children}
    </div>
  );
}