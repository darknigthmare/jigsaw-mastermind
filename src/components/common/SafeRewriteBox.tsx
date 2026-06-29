import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SafeRewriteBox: React.FC = () => {
  const { safetyTriggered, dismissSafetyAlert } = useApp();

  if (!safetyTriggered || !safetyTriggered.triggered) return null;

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#120808] border-2 border-terminal-red max-w-lg w-full p-6 rounded-md shadow-[0_0_30px_rgba(230,0,0,0.5)] crt-screen overflow-hidden">
        <div className="scanline-overlay" />
        <div className="visual-noise-overlay" style={{ opacity: 0.25 }} />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-3 text-terminal-red border-b border-terminal-red/30 pb-3">
            <ShieldAlert size={28} className="animate-pulse" />
            <h3 className="font-mono font-extrabold text-lg uppercase tracking-widest">
              [SAFETY LAYER: ACTIVE SANITIZATION]
            </h3>
          </div>

          {/* Alert Message */}
          <div className="text-xs font-mono leading-relaxed text-[#fca5a5] bg-[#3a1010] p-3 border border-terminal-red/20 rounded">
            <p className="font-bold mb-2">
              Boundary Triggered: Unsafe terminology detected.
            </p>
            <p>
              Your input contained the term: <span className="underline font-bold font-sans text-white bg-black px-1.5 py-0.5 rounded">"{safetyTriggered.term}"</span>
            </p>
            <p className="mt-2 text-[10px] text-[#fca5a5]/70">
              The application strictly enforces non-violent, symbolic, and psychological escape-room campaigns. Mechanical violence, weaponry, or tracking real individuals is prohibited.
            </p>
          </div>

          {/* Proposed Safe Rewrite */}
          {safetyTriggered.suggestion && (
            <div className="border border-terminal-green/30 bg-[#0d140d] p-3 rounded">
              <h4 className="text-[10px] font-bold text-terminal-green uppercase tracking-wider mb-1">
                Sanitized Rewrite Auto-Applied:
              </h4>
              <p className="text-xs font-mono italic text-terminal-green/90">
                "{safetyTriggered.suggestion}"
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 border-t border-terminal-red/10 pt-3">
            <button
              onClick={dismissSafetyAlert}
              className="flex items-center gap-2 px-4 py-2 border border-terminal-green bg-terminal-green-dim/20 hover:bg-terminal-green/20 text-terminal-green text-xs font-bold font-mono rounded cursor-pointer transition-colors"
            >
              <Check size={14} />
              Accept Sanitization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
