import React from 'react';
import { Play, Pause, Square } from 'lucide-react';

interface TapePlayerProps {
  title: string;
  isPlaying: boolean;
  onTogglePlay: (playing: boolean) => void;
  onStop?: () => void;
}

export const TapePlayer: React.FC<TapePlayerProps> = ({
  title,
  isPlaying,
  onTogglePlay,
  onStop
}) => {
  return (
    <div className="bg-terminal-metal/90 border border-terminal-metal-light p-4 rounded-md text-monospace select-none max-w-sm mx-auto shadow-lg">
      {/* Cassette Tape Visualization */}
      <div className="relative w-64 h-36 bg-black border border-terminal-metal p-3 rounded-lg mx-auto flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Cassette Label */}
        <div className="bg-[#dcd6cd] text-[#1c1d1a] border-b-2 border-dashed border-[#b71c1c] text-[10px] p-1 font-bold text-center uppercase tracking-wider rounded">
          Subject File: {title || 'Simulation Tape'}
        </div>
        
        {/* Cassette Wheels Center */}
        <div className="flex justify-around items-center my-2 px-6">
          {/* Left Reel */}
          <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-terminal-green/50 bg-[#1c1d1a] flex items-center justify-center">
            <div className={`w-8 h-8 rounded-full border border-terminal-green/20 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
              <div className="w-1.5 h-6 bg-terminal-green/30 absolute rotate-0" />
              <div className="w-1.5 h-6 bg-terminal-green/30 absolute rotate-45" />
              <div className="w-1.5 h-6 bg-terminal-green/30 absolute rotate-90" />
              <div className="w-1.5 h-6 bg-terminal-green/30 absolute rotate-135" />
            </div>
            <div className="w-3 h-3 rounded-full bg-black z-10 border border-terminal-green/80" />
          </div>

          {/* Center Window (Tape Feed) */}
          <div className="w-16 h-8 bg-terminal-metal border border-terminal-metal-light rounded flex items-center justify-center overflow-hidden">
            {/* CSS Waveform */}
            <div className="flex gap-0.5 items-end h-5">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1 bg-terminal-green rounded-t ${isPlaying ? 'animate-bounce' : 'h-1'}`}
                  style={{
                    height: isPlaying ? `${Math.random() * 16 + 4}px` : '4px',
                    animationDelay: `${idx * 0.1}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Reel */}
          <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-terminal-green/50 bg-[#1c1d1a] flex items-center justify-center">
            <div className={`w-8 h-8 rounded-full border border-terminal-green/20 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
              <div className="w-1.5 h-6 bg-terminal-green/30 absolute rotate-0" />
              <div className="w-1.5 h-6 bg-terminal-green/30 absolute rotate-45" />
              <div className="w-1.5 h-6 bg-terminal-green/30 absolute rotate-90" />
              <div className="w-1.5 h-6 bg-terminal-green/30 absolute rotate-135" />
            </div>
            <div className="w-3 h-3 rounded-full bg-black z-10 border border-terminal-green/80" />
          </div>
        </div>

        {/* Cassette Base notches */}
        <div className="flex justify-between items-center text-[7px] text-terminal-green-dim font-bold tracking-tight">
          <span>A-SIDE / 60 MIN</span>
          <div className="w-8 h-2 bg-[#1c1d1a] border border-terminal-metal rounded-t flex justify-around items-center px-1">
            <span className="w-0.5 h-0.5 bg-terminal-green rounded-full" />
            <span className="w-0.5 h-0.5 bg-terminal-green rounded-full" />
          </div>
          <span>OFFLINE AUDIO</span>
        </div>
      </div>

      {/* Hardware Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => onTogglePlay(!isPlaying)}
          className={`flex items-center justify-center w-12 h-10 rounded border transition-colors ${
            isPlaying
              ? 'bg-terminal-green-dim/30 border-terminal-green text-terminal-green'
              : 'bg-terminal-bg border-terminal-metal hover:border-terminal-green text-terminal-green-dim hover:text-terminal-green'
          }`}
          title={isPlaying ? "Pause Tape" : "Play Tape"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {onStop && (
          <button
            onClick={onStop}
            className="flex items-center justify-center w-12 h-10 rounded border bg-terminal-bg border-terminal-metal hover:border-terminal-red text-terminal-metal-light hover:text-terminal-red transition-colors"
            title="Stop/Eject"
          >
            <Square size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
