import React from 'react';

interface TimerDisplayProps {
  seconds: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  const formattedMins = mins.toString().padStart(2, '0');
  const formattedSecs = secs.toString().padStart(2, '0');

  const isLowTime = seconds <= 30;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black border-2 border-terminal-metal rounded-md shadow-inner max-w-[240px] mx-auto select-none">
      <span className="text-[10px] text-terminal-green-dim font-bold uppercase tracking-wider mb-1">
        Fictional Countdown
      </span>
      
      {/* Nixie / Segmented LED Display Grid */}
      <div className={`flex gap-1 font-mono text-4xl font-extrabold tracking-widest px-4 py-2 bg-[#050605] rounded border border-terminal-metal shadow-inner transition-shadow ${
        isLowTime
          ? 'text-terminal-red shadow-[0_0_15px_rgba(230,0,0,0.4)] border-terminal-red/50 animate-pulse'
          : 'text-terminal-green shadow-[0_0_15px_rgba(57,255,20,0.2)] border-terminal-green/30'
      }`}>
        <span>{formattedMins[0]}</span>
        <span>{formattedMins[1]}</span>
        <span className={isLowTime ? 'text-terminal-red animate-ping' : 'text-terminal-green'}>:</span>
        <span>{formattedSecs[0]}</span>
        <span>{formattedSecs[1]}</span>
      </div>

      {isLowTime && (
        <span className="text-[8px] text-terminal-red font-bold uppercase tracking-widest mt-2 animate-pulse">
          WARNING: Chrono Critical
        </span>
      )}
    </div>
  );
};
