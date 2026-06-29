import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Compass,
  FileCode,
  Settings as SettingsIcon,
  ShieldCheck,
  Binary
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setView, logs } = useApp();
  const logEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const menuItems = [
    { id: 'dashboard', label: 'Control Room', icon: LayoutDashboard, view: 'dashboard' },
    { id: 'campaigns', label: 'Game Architect', icon: GitBranch, view: 'campaigns' },
    { id: 'characters', label: 'Dossiers Sujets', icon: Users, view: 'characters' },
    { id: 'tests', label: 'Test Chamber', icon: Binary, view: 'tests' },
    { id: 'timeline', label: 'Archives Timeline', icon: Compass, view: 'timeline' },
    { id: 'writer-room', label: "Writer's Room", icon: FileCode, view: 'writer-room' },
    { id: 'settings', label: 'Local Vault', icon: SettingsIcon, view: 'settings' }
  ];

  return (
    <aside className="w-64 bg-terminal-metal border-r border-terminal-metal-light p-4 flex flex-col justify-between h-full select-none">
      <div className="flex flex-col gap-6 overflow-y-auto max-h-[45%] custom-scrollbar">
        {/* Brand/Console Title */}
        <div className="border border-terminal-green/30 p-3 bg-black rounded flex flex-col gap-1">
          <span className="text-[10px] text-terminal-green-dim font-bold tracking-widest uppercase">
            JIGSAW MASTERMIND
          </span>
          <span className="text-xs text-terminal-green font-extrabold tracking-wider border-t border-terminal-green/10 pt-1">
            CONSO-V1.0 // OFFLINE
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view || currentView.startsWith(item.view + '-');
            
            return (
              <button
                key={item.id}
                onClick={() => setView(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono rounded border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-terminal-green/10 border-terminal-green text-terminal-green shadow-[0_0_10px_rgba(57,255,20,0.15)] font-bold'
                    : 'bg-transparent border-transparent text-c4cdc4/60 hover:text-c4cdc4 hover:bg-terminal-metal-light/50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-terminal-green animate-pulse' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Console Log Terminal */}
      <div className="flex-1 my-4 border border-terminal-metal-light bg-black/60 rounded p-2 flex flex-col justify-between overflow-hidden h-[180px] font-mono text-[9px] select-text">
        <div className="text-[8px] text-terminal-green-dim font-bold border-b border-terminal-metal-light pb-1 mb-1.5 uppercase flex justify-between select-none">
          <span>Diagnostic Log Console</span>
          <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
          {logs.length === 0 ? (
            <span className="text-c4cdc4/20 italic select-none">[Console idle...]</span>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="text-terminal-green/80 leading-normal break-all font-mono">
                {log}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Safety Shield Indicator */}
      <div className="border border-terminal-metal-light bg-black/40 p-3 rounded text-[9px] font-mono leading-tight flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-terminal-green">
          <ShieldCheck size={12} />
          <span className="font-extrabold">SECURED NODE</span>
        </div>
        <p className="text-c4cdc4/40">
          Strict safety filter: ACTIVE. Real-world target block enabled.
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-ping" />
          <span className="text-[7px] text-terminal-green-dim uppercase font-bold">
            Local Database Loaded
          </span>
        </div>
      </div>
    </aside>
  );
};
