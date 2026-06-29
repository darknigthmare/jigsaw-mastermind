import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CRTPanel } from '../components/common/CRTPanel';
import { TapePlayer } from '../components/common/TapePlayer';
import { TimerDisplay } from '../components/common/TimerDisplay';
import { MoralScoreBars } from '../components/common/MoralScoreBars';
import { Radio, AlertTriangle, FileText, ChevronRight, X, ArrowLeft } from 'lucide-react';

export const TheatreMode: React.FC = () => {
  const {
    activeSimulation,
    submitChoice,
    toggleTapePlayback,
    exitSimulation,
    characters,
    submitPuzzleAnswer,
    setPuzzleInput,
    revealClue
  } = useApp();
  
  const [showClues, setShowClues] = useState(false);

  // Keyboard shortcuts listener
  React.useEffect(() => {
    if (!activeSimulation) return;
    const { isPlayingTape, isFinished, tests: simTests, currentTestIndex, isPuzzleSolved, isPuzzleActive } = activeSimulation;
    const currentTest = simTests[currentTestIndex];

    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input, ignore shortcuts
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      const key = e.key.toLowerCase();
      
      if (key === ' ') {
        e.preventDefault();
        toggleTapePlayback(!isPlayingTape);
      } else if (key === 'escape') {
        e.preventDefault();
        exitSimulation();
      } else if (key === 'c') {
        e.preventDefault();
        setShowClues(prev => !prev);
      } else if (key === '1') {
        e.preventDefault();
        if (!isPlayingTape && !isFinished && currentTest && (!isPuzzleActive || isPuzzleSolved)) {
          submitChoice(currentTest.choices[0].id);
        }
      } else if (key === '2') {
        e.preventDefault();
        if (!isPlayingTape && !isFinished && currentTest && (!isPuzzleActive || isPuzzleSolved)) {
          submitChoice(currentTest.choices[1].id);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSimulation, toggleTapePlayback, exitSimulation, submitChoice]);

  if (!activeSimulation) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
        <AlertTriangle size={36} className="text-terminal-red mb-3 animate-bounce" />
        <span className="text-sm font-bold uppercase tracking-widest text-white">
          No Simulation Thread Initialized
        </span>
        <button
          onClick={exitSimulation}
          className="mt-4 px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black font-bold font-mono text-xs rounded transition-all cursor-pointer"
        >
          Return to Control Room
        </button>
      </div>
    );
  }

  const {
    campaign,
    tests,
    currentTestIndex,
    scores,
    timerLeft,
    isPlayingTape,
    isFinished,
    ending,
    textPrinted,
    puzzleInput,
    puzzleAttempts,
    isPuzzleActive,
    revealedCluesIndices
  } = activeSimulation;

  const currentTest = tests[currentTestIndex];

  // Helper to trigger download of case report
  const downloadReport = (filename: string, text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const currentRunReport = isFinished && ending ? `# CASE FILE ARCHIVE: ${campaign.title.toUpperCase()}\n` +
    `Ending Obtained: ${ending.title}\n` +
    `---------------------------------------\n` +
    `Final scores:\n` +
    `- Responsibility: ${scores.responsibility}/100\n` +
    `- Truth: ${scores.truth}/100\n` +
    `- Empathy: ${scores.empathy}/100\n` +
    `- Denial: ${scores.denial}/100\n` +
    `---------------------------------------\n` +
    `This is a local fictional simulation. No real individuals were tested.` : '';

  return (
    <div className="fixed inset-0 bg-[#070807] z-40 overflow-y-auto p-4 md:p-8 flex flex-col justify-between font-mono">
      {/* Top Console Status */}
      <div className="flex flex-wrap items-center justify-between border-b border-terminal-metal-light pb-3 mb-6 select-none text-[10px] text-c4cdc4/50">
        <div className="flex items-center gap-3">
          <span className="text-terminal-red animate-pulse font-bold flex items-center gap-1">
            <Radio size={14} />
            [SIMULATION LAYER ACTIVE]
          </span>
          <span className="text-white font-bold">
            CAMP: {campaign.title.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-terminal-green-dim font-bold">
            STAGE: {currentTestIndex + 1} OF {tests.length}
          </span>
          <button
            onClick={exitSimulation}
            className="flex items-center gap-1.5 border border-terminal-red/40 hover:border-terminal-red bg-terminal-red/5 hover:bg-terminal-red/20 px-2.5 py-1 text-[9px] text-terminal-red font-bold rounded cursor-pointer transition-colors"
          >
            <X size={10} />
            ABORT ENGINE
          </button>
        </div>
      </div>

      {/* Main Simulation Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start flex-1 mb-8">
        
        {/* Left Column: Tapes and Timers */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Cassette Deck */}
          <CRTPanel className="p-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green border-b border-terminal-green/20 pb-2">
              Cassette Recorder
            </h3>
            
            <TapePlayer
              title={matchingCharacterName(characters, currentTest?.characterId) || 'Subject'}
              isPlaying={isPlayingTape}
              onTogglePlay={(play) => toggleTapePlayback(play)}
            />
          </CRTPanel>

          {/* Nixon segment countdown */}
          {!isFinished && (
            <CRTPanel className="p-4">
              <TimerDisplay seconds={timerLeft} />
              
              {/* Clues logs button */}
              {currentTest?.clues && currentTest.clues.length > 0 && (
                <button
                  onClick={() => setShowClues(true)}
                  className="mt-4 w-full flex items-center justify-center gap-1 bg-terminal-metal hover:bg-terminal-metal-light border border-terminal-metal-light hover:border-terminal-green text-c4cdc4 hover:text-terminal-green px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition-colors"
                >
                  <FileText size={12} />
                  DECRYPT MEMORY CLUES ({currentTest.clues.length})
                </button>
              )}
            </CRTPanel>
          )}
        </div>

        {/* Right Columns: Dialogue Typewriter, Decisions & Scores */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Transcript / Screen console */}
          <CRTPanel className="min-h-[220px] p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-[9px] text-terminal-green-dim font-bold border-b border-terminal-green/20 pb-1.5 mb-3 uppercase tracking-wider">
                <span>TAPE TRANSCRIPTION TERMINAL</span>
                <span>STATUS: {isPlayingTape ? 'RECEIVING STREAM...' : 'STREAM READY'}</span>
              </div>
              
              <div className="text-sm text-terminal-green font-bold leading-relaxed whitespace-pre-wrap font-mono min-h-[120px]">
                {textPrinted}
                {isPlayingTape && <span className="typewriter-cursor" />}
              </div>
            </div>

            {/* Fictional rules warning */}
            {!isPlayingTape && !isFinished && currentTest && (
              <div className="border border-terminal-green/20 bg-[#0d140d] px-3 py-2 rounded text-[10px] leading-snug text-terminal-green-dim font-bold mt-4 uppercase">
                <span className="text-terminal-green">RULES:</span> {currentTest.rules}
              </div>
            )}
          </CRTPanel>

          {/* Branches / Decisions or Final Ending Details */}
          {isFinished && ending ? (
            <CRTPanel className="p-6 border-2 border-terminal-green animate-pulse">
              <div className="flex items-center gap-2 text-terminal-green mb-3 border-b border-terminal-green/20 pb-3">
                <Radio size={20} className="animate-ping" />
                <h3 className="font-extrabold text-sm uppercase tracking-widest">
                  [SIMULATION RESOLVED — CASE ARCHIVED]
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-c4cdc4/55 font-bold uppercase">Ending Reached:</span>
                  <h4 className="text-lg font-extrabold text-white mt-0.5">{ending.title}</h4>
                </div>

                <p className="text-xs leading-relaxed text-c4cdc4/80">
                  {ending.description}
                </p>

                <div className="flex flex-col gap-2 border-t border-terminal-metal-light pt-3 mt-2">
                  <span className="text-[9px] text-c4cdc4/50 font-bold uppercase">Case Record File:</span>
                  <div className="bg-black border border-terminal-metal p-3 rounded font-mono text-[9.5px] leading-relaxed text-c4cdc4/80 max-h-36 overflow-y-auto whitespace-pre-wrap select-text">
                    {currentRunReport}
                  </div>
                  
                  <div className="flex gap-3 justify-end mt-2">
                    <button
                      onClick={() => downloadReport(`${campaign.title.replace(/\s+/g, '_')}_report.md`, currentRunReport)}
                      className="flex items-center gap-1 bg-terminal-bg border border-terminal-metal hover:border-terminal-green px-3 py-1.5 text-xs font-bold text-c4cdc4 hover:text-terminal-green rounded cursor-pointer transition-colors"
                    >
                      DOWNLOAD CASE FILE (.MD)
                    </button>
                    <button
                      onClick={exitSimulation}
                      className="flex items-center gap-1.5 bg-terminal-green border border-terminal-green hover:bg-transparent text-black hover:text-terminal-green px-4 py-2 text-xs font-bold rounded cursor-pointer transition-colors"
                    >
                      <ArrowLeft size={12} />
                      EJECT FILE & EXIT
                    </button>
                  </div>
                </div>
              </div>
            </CRTPanel>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Choices Buttons Console */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-l-2 border-terminal-green pl-2 select-none">
                  Branches Consolidation
                </h3>

                {isPlayingTape ? (
                  <div className="p-6 bg-terminal-metal/20 border border-terminal-metal rounded text-center text-xs text-c4cdc4/45 italic select-none">
                    [BRANCHES SECURED — DECRYPTING AUDIO Cassette BEFORE DECISION PROTOCOL]
                  </div>
                ) : isPuzzleActive ? (
                  /* Puzzle Calibration console */
                  <div className="bg-terminal-metal border border-terminal-metal-light p-5 rounded flex flex-col gap-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-terminal-metal-light pb-2">
                      <span className="font-extrabold text-terminal-green uppercase tracking-wider animate-pulse flex items-center gap-1.5 select-none">
                        <Radio size={14} />
                        [SYSTEM CALIBRATION CONSOLE]
                      </span>
                      <span className="text-[9px] text-c4cdc4/55 select-none">
                        ATTEMPTS: {puzzleAttempts} / 3
                      </span>
                    </div>

                    <p className="text-[11px] text-white leading-normal font-bold">
                      {currentTest?.puzzleData?.question || 'Calibrate the terminal values to proceed.'}
                    </p>

                    {currentTest?.puzzleType === 'logic' && (
                      <div className="flex flex-col gap-3">
                        {currentTest.puzzleData.items && (
                          <div className="bg-black/40 border border-terminal-metal p-2.5 rounded flex flex-col gap-1.5 text-[9px] text-c4cdc4/60">
                            {currentTest.puzzleData.items.map((item: string, idx: number) => (
                              <div key={idx}>{item}</div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={puzzleInput}
                            onChange={(e) => setPuzzleInput(e.target.value)}
                            placeholder="YYYY-MM-DD"
                            className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono flex-1 text-center"
                          />
                          <button
                            onClick={() => submitPuzzleAnswer(puzzleInput)}
                            className="bg-terminal-green text-black border border-terminal-green hover:bg-transparent hover:text-terminal-green px-4 py-2 font-bold font-mono rounded cursor-pointer transition-colors"
                          >
                            CALIBRATE
                          </button>
                        </div>
                        <div className="text-[9px] text-c4cdc4/40 mt-1 flex flex-col gap-1">
                          <span>* Hint: open Memory Clues modal. Wrong answers deduct 15 seconds.</span>
                          {puzzleAttempts > 0 && <span className="text-terminal-red font-bold uppercase animate-pulse">! INVALID OVERRIDE TIMESTAMP VALUE RECEIVED</span>}
                        </div>
                      </div>
                    )}

                    {currentTest?.puzzleType === 'confession' && (
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 gap-2">
                          {currentTest.puzzleData.confessionOptions?.map((opt: any) => (
                            <button
                              key={opt.id}
                              onClick={() => setPuzzleInput(opt.id)}
                              className={`border p-2.5 rounded text-left transition-colors text-[10px] font-mono leading-normal cursor-pointer ${
                                puzzleInput === opt.id
                                  ? 'bg-terminal-green/10 border-terminal-green text-terminal-green shadow-[0_0_8px_rgba(57,255,20,0.15)] font-bold'
                                  : 'bg-black/40 border-terminal-metal hover:border-terminal-green/40 text-c4cdc4/80'
                              }`}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                        <button
                          disabled={!puzzleInput}
                          onClick={() => submitPuzzleAnswer(puzzleInput)}
                          className={`w-full py-2 font-bold font-mono rounded transition-colors text-center text-xs ${
                            puzzleInput
                              ? 'bg-terminal-green border border-terminal-green text-black hover:bg-transparent hover:text-terminal-green cursor-pointer'
                              : 'bg-terminal-metal border border-terminal-metal-light text-c4cdc4/25 cursor-not-allowed'
                          }`}
                        >
                          TRANSMIT CONFESSION DATA
                        </button>
                        {puzzleAttempts > 0 && <span className="text-terminal-red text-[9px] font-bold uppercase animate-pulse text-center block mt-1">! DEFLECTION VALUE DETECTED - DATA SANITIZED</span>}
                      </div>
                    )}

                    {currentTest?.puzzleType === 'sacrifice' && (
                      <div className="flex flex-col gap-4">
                        <div className="bg-black/60 border border-terminal-metal p-3 rounded flex flex-col gap-2 font-mono text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-c4cdc4/50">Bonus Account:</span>
                            <span className="text-terminal-red font-bold">${(250000 - (parseInt(puzzleInput) || 0)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-c4cdc4/50">Workers Comp Fund:</span>
                            <span className="text-terminal-green font-bold">${(parseInt(puzzleInput) || 0).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <input
                            type="range"
                            min="0"
                            max="250000"
                            step="10000"
                            value={puzzleInput || '0'}
                            onChange={(e) => setPuzzleInput(e.target.value)}
                            className="accent-terminal-green w-full h-1 bg-terminal-metal rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-[8px] text-c4cdc4/40 uppercase select-none">
                            <span>Keep All ($0)</span>
                            <span>Balanced ($125,000)</span>
                            <span>Transfer All ($250,000)</span>
                          </div>
                        </div>

                        <button
                          onClick={() => submitPuzzleAnswer(puzzleInput)}
                          className="w-full bg-terminal-green text-black border border-terminal-green hover:bg-transparent hover:text-terminal-green py-2 font-bold font-mono rounded cursor-pointer transition-colors text-center text-xs"
                        >
                          CALIBRATE PHYSICAL SCALES
                        </button>
                        {puzzleAttempts > 0 && <span className="text-terminal-red text-[9px] font-bold uppercase animate-pulse text-center block mt-1">! DEFICIT BALANCE ENCOUNTERED - ESCAPE ROUTE SECURED</span>}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Choices buttons */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentTest?.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => submitChoice(choice.id)}
                        className="bg-terminal-metal hover:bg-terminal-green/5 border border-terminal-metal-light hover:border-terminal-green p-4 rounded text-left flex flex-col justify-between gap-3 group transition-all cursor-pointer"
                      >
                        <div className="flex gap-2">
                          <ChevronRight size={14} className="text-terminal-green mt-0.5 group-hover:translate-x-1 transition-transform" />
                          <span className="text-xs font-bold text-white leading-snug group-hover:text-terminal-green transition-colors">
                            {choice.text}
                          </span>
                        </div>
                        <span className="text-[9px] text-c4cdc4/40 mt-1 block">
                          Consequent Narrative: {choice.narrativeImpact}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Moral Profile Bars */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-l-2 border-terminal-red pl-2 select-none">
                  Active Subject Profile Ledger
                </h3>
                <MoralScoreBars scores={scores} />
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Clues Modal Screen */}
      {showClues && currentTest && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-terminal-metal border-2 border-terminal-green max-w-md w-full p-5 rounded shadow-lg crt-screen">
            <div className="scanline-overlay" />
            <div className="visual-noise-overlay" style={{ opacity: 0.15 }} />
            
            <div className="flex justify-between items-center border-b border-terminal-green/20 pb-2 mb-4 select-none">
              <span className="text-xs font-bold text-terminal-green flex items-center gap-1.5 uppercase">
                <FileText size={14} />
                Decrypted Archives Logs
              </span>
              <button
                onClick={() => setShowClues(false)}
                className="text-c4cdc4/50 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
              {currentTest.clues.map((clue, idx) => {
                const isDecrypted = revealedCluesIndices?.includes(idx);
                return (
                  <div key={idx} className="bg-black/60 border border-terminal-metal p-3 rounded text-[11px] leading-relaxed font-mono">
                    <div className="flex justify-between items-baseline mb-1 select-none">
                      <span className="text-terminal-green font-bold">LOG ENTRY #{idx + 1}:</span>
                      {isDecrypted ? (
                        <span className="text-[8px] text-terminal-green-dim uppercase font-bold">[DECRYPTED]</span>
                      ) : (
                        <span className="text-[8px] text-terminal-red font-bold uppercase animate-pulse">[LOCKED]</span>
                      )}
                    </div>
                    {isDecrypted ? (
                      <p className="text-c4cdc4/90 mt-1 select-text">{clue}</p>
                    ) : (
                      <button
                        onClick={() => revealClue(idx)}
                        className="w-full border border-terminal-red hover:bg-terminal-red/20 text-terminal-red text-[9px] font-bold uppercase py-1 mt-1 rounded cursor-pointer transition-colors text-center"
                      >
                        DECRYPT CLUE (-5 Courage / +5 Denial)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowClues(false)}
              className="mt-4 w-full bg-terminal-green text-black hover:bg-transparent hover:text-terminal-green border border-terminal-green py-2 text-xs font-bold rounded cursor-pointer transition-colors select-none"
            >
              CLOSE DECRYPTOR
            </button>
          </div>
        </div>
      )}

      {/* Footnote disclaimer requirement */}
      <footer className="text-center text-[8px] text-c4cdc4/30 select-none uppercase tracking-widest mt-6">
        Fiction locale — aucun scénario réel.
      </footer>
    </div>
  );
};

// Helper character matcher
function matchingCharacterName(chars: any[], charId: string) {
  return chars.find(c => c.id === charId)?.name;
}
