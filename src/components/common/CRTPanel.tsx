import React from 'react';
import { useApp } from '../../context/AppContext';

interface CRTPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const CRTPanel: React.FC<CRTPanelProps> = ({ children, className = '' }) => {
  const { settings } = useApp();

  return (
    <div className={`relative bg-terminal-bg border-2 border-terminal-metal p-6 rounded-md shadow-2xl crt-screen overflow-hidden ${className}`}>
      {/* Dynamic CRT elements based on settings */}
      {settings.visualNoise && (
        <>
          <div className="scanline-overlay" />
          <div className="visual-noise-overlay" />
        </>
      )}
      
      {/* Content wrapper with optional flicker */}
      <div className={`relative z-10 ${settings.visualNoise ? 'animate-flicker' : ''}`}>
        {children}
      </div>
      
      {/* CRT Inner Screen Glass Frame Overlay */}
      <div className="absolute inset-0 pointer-events-none border border-terminal-metal-light/35 rounded-md z-20" />
    </div>
  );
};
