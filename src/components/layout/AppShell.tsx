import React from 'react';
import { Sidebar } from './Sidebar';
import { TopStatusBar } from './TopStatusBar';
import { SafeRewriteBox } from '../common/SafeRewriteBox';
import { useApp } from '../../context/AppContext';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { settings } = useApp();

  // Mapping theme strings to class rules
  const getThemeClass = () => {
    switch (settings.theme) {
      case 'monochrome-dark':
        return 'theme-monochrome text-slate-300 [&_*]:!text-slate-300 [&_.text-terminal-green]:!text-slate-200 [&_.border-terminal-green]:!border-slate-500 [&_.bg-terminal-green]:!bg-slate-400 [&_.text-terminal-green-dim]:!text-slate-500';
      case 'clinical-green':
        return 'theme-clinical text-[#00ff88] [&_.text-terminal-green]:!text-[#00ff88] [&_.border-terminal-green]:!border-[#00ff88]/50 [&_.bg-terminal-green]:!bg-[#00ff88] [&_.text-terminal-green-dim]:!text-[#00aa55]';
      case 'industrial-dark':
      default:
        return 'theme-industrial';
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-terminal-bg text-c4cdc4 font-mono ${getThemeClass()}`}>
      {/* Top Status Bar */}
      <TopStatusBar />

      {/* Main workspace layout */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-3rem)]">
        {/* Left Sidebar navigation */}
        <Sidebar />

        {/* Content Area viewport */}
        <main className="flex-1 overflow-y-auto bg-black/30 p-6 relative">
          {children}
        </main>
      </div>

      {/* Global Safety Alert Overlay */}
      <SafeRewriteBox />
    </div>
  );
};
