import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { WifiOff, Lock, Unlock, Volume2, VolumeX } from 'lucide-react';
import * as sound from '../../services/sound';

export const TopStatusBar: React.FC = () => {
  const { campaigns, characters, runs, isVaultEncrypted, addLog } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');
  const [soundOn, setSoundOn] = useState<boolean>(sound.isSoundEnabled());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const nextSound = !soundOn;
    sound.setSoundEnabled(nextSound);
    setSoundOn(nextSound);
    addLog(`SETTINGS: Sound FX ${nextSound ? 'ENABLED' : 'MUTED'}`);
  };

  return (
    <header className="h-12 bg-black border-b border-terminal-metal px-6 flex items-center justify-between font-mono text-[10px] select-none text-c4cdc4/70">
      {/* Local System Status Indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-terminal-green font-bold bg-terminal-green/5 border border-terminal-green/20 px-2 py-0.5 rounded">
          <WifiOff size={12} />
          <span>LOCAL ONLY</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span>SAFE-T CORE:</span>
          <span className="text-terminal-green font-bold">ACTIVE</span>
        </div>

        {isVaultEncrypted ? (
          <div className="flex items-center gap-1 text-terminal-green font-bold">
            <Lock size={10} />
            <span>VAULT ENCRYPTED</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-c4cdc4/40">
            <Unlock size={10} />
            <span>PLAIN STORAGE</span>
          </div>
        )}
      </div>

      {/* Center Console Label */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-terminal-green animate-pulse">●</span>
        <span className="tracking-widest uppercase font-extrabold text-[9px]">
          System Monitor Terminal
        </span>
      </div>

      {/* Right Side Clock & Counters */}
      <div className="flex items-center gap-4 font-bold">
        <button
          onClick={toggleSound}
          title={soundOn ? "Mute synthesized audio effects" : "Unmute synthesized audio effects"}
          className={`flex items-center justify-center p-1 rounded border transition-colors cursor-pointer ${
            soundOn
              ? 'border-terminal-green/30 hover:border-terminal-green text-terminal-green hover:bg-terminal-green/10'
              : 'border-terminal-metal-light hover:border-c4cdc4 text-c4cdc4/40 hover:bg-terminal-metal-light/20'
          }`}
        >
          {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>

        <div className="flex items-center gap-2 border-r border-terminal-metal-light pr-4">
          <span>CAMP: <strong className="text-white">{campaigns.length}</strong></span>
          <span>SUBJ: <strong className="text-white">{characters.length}</strong></span>
          <span>RUNS: <strong className="text-white">{runs.length}</strong></span>
        </div>
        
        <div className="text-terminal-green min-w-[65px] text-right font-extrabold tracking-wider">
          [{timeStr || '--:--:--'}]
        </div>
      </div>
    </header>
  );
};
