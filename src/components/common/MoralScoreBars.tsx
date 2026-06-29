import React from 'react';
import type { MoralScores } from '../../types';

interface MoralScoreBarsProps {
  scores: MoralScores;
}

export const MoralScoreBars: React.FC<MoralScoreBarsProps> = ({ scores }) => {
  const attributes = [
    { label: 'Responsibility', value: scores.responsibility, desc: 'Acknowledge impact', color: 'bg-terminal-green' },
    { label: 'Truth', value: scores.truth, desc: 'Sincerity vs falsification', color: 'bg-terminal-green' },
    { label: 'Empathy', value: scores.empathy, desc: 'Altruism and care', color: 'bg-terminal-green' },
    { label: 'Courage', value: scores.courage, desc: 'Confronting hardship', color: 'bg-terminal-green' },
    { label: 'Denial', value: scores.denial, desc: 'Self-justification and shields', color: 'bg-terminal-red' },
    { label: 'Cooperation', value: scores.cooperation, desc: 'Mutual trust', color: 'bg-terminal-green' },
    { label: 'Acceptance', value: scores.acceptance, desc: 'Facing consequences', color: 'bg-terminal-green' }
  ];

  // Helper to generate segmented meter string e.g. [||||||....]
  const renderSegmentedMeter = (val: number, isRed: boolean) => {
    const totalSegments = 15;
    const filledSegments = Math.round((val / 100) * totalSegments);
    const emptySegments = totalSegments - filledSegments;

    const fillChar = '█';
    const emptyChar = '░';
    
    return (
      <div className="font-mono text-sm tracking-tighter select-none">
        <span className={isRed ? 'text-terminal-red' : 'text-terminal-green'}>
          {fillChar.repeat(filledSegments)}
        </span>
        <span className="text-terminal-metal-light">
          {emptyChar.repeat(emptySegments)}
        </span>
        <span className="ml-2 font-bold text-xs">
          {val}%
        </span>
      </div>
    );
  };

  return (
    <div className="bg-[#0f110f] border border-terminal-metal p-4 rounded-md shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes.map((attr) => {
          const isRed = attr.label === 'Denial';
          return (
            <div key={attr.label} className="border-b border-terminal-metal/30 pb-2 flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-c4cdc4">
                  {attr.label}
                </span>
                <span className="text-[9px] text-terminal-green-dim italic">
                  {attr.desc}
                </span>
              </div>
              
              {/* Segmented display bar */}
              <div className="flex items-center">
                {renderSegmentedMeter(attr.value, isRed)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
