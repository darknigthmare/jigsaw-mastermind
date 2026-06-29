import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CRTPanel } from '../components/common/CRTPanel';
import { TapePlayer } from '../components/common/TapePlayer';
import { TimerDisplay } from '../components/common/TimerDisplay';
import { MoralScoreBars } from '../components/common/MoralScoreBars';
import * as sound from '../services/sound';
import { Radio, AlertTriangle, FileText, ChevronRight, X, ArrowLeft, Video } from 'lucide-react';

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
  const [cctvTime, setCctvTime] = useState('');

  // Local state for Logic Puzzle (Vault Dial combination lock)
  const [dialYear, setDialYear] = useState('2022');
  const [dialMonth, setDialMonth] = useState('01');
  const [dialDay, setDialDay] = useState('01');

  // CCTV timestamp tick
  useEffect(() => {
    const updateCctv = () => {
      const now = new Date();
      setCctvTime(now.toLocaleDateString() + ' ' + now.toLocaleTimeString());
    };
    updateCctv();
    const interval = setInterval(updateCctv, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts listener
  useEffect(() => {
    if (!activeSimulation) return;
    const { isPlayingTape, isFinished, tests: simTests, currentTestIndex, isPuzzleSolved, isPuzzleActive } = activeSimulation;
    const currentTest = simTests[currentTestIndex];

    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Get room background
  const getRoomBackground = () => {
    switch (campaign.id) {
      case 'camp-ledger-room':
        return 'url("/ledger_room_bg.png")';
      case 'camp-glass-confession':
        return 'url("/glass_confession_bg.png")';
      case 'camp-quiet-scale':
        return 'url("/quiet_scale_bg.png")';
      default:
        return 'none';
    }
  };

  const getCctvLabel = () => {
    switch (campaign.id) {
      case 'camp-ledger-room': return 'CAM_01_VAULT_ZONING';
      case 'camp-glass-confession': return 'CAM_02_MIRRORS_WALL';
      case 'camp-quiet-scale': return 'CAM_03_COMP_SCALES';
      default: return 'CAM_99_SYS_MONITOR';
    }
  };

  const rotateValue = (current: string, options: string[], direction: 'up' | 'down') => {
    sound.playClick();
    const idx = options.indexOf(current);
    if (direction === 'up') {
      return options[(idx + 1) % options.length];
    } else {
      return options[(idx - 1 + options.length) % options.length];
    }
  };

  const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  // Mechanical balance scale dynamics
  const scaleWeight = parseInt(puzzleInput) || 0;
  const ratio = scaleWeight / 250000;
  const scaleAngle = (ratio - 0.5) * 36; // tilt between -18 and +18 degrees
  const leftY = scaleAngle * 1.2;
  const rightY = -scaleAngle * 1.2;

  return (
    <div
      className="fixed inset-0 bg-[#070807] z-40 overflow-y-auto p-4 md:p-8 flex flex-col justify-between font-mono transition-all duration-1000"
      style={{
        backgroundImage: getRoomBackground(),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark gradient filter wrapper to preserve text readability */}
      <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />
      <div className="scanline-overlay" />
      <div className="visual-noise-overlay" style={{ opacity: 0.10 }} />

      <div className="relative z-10 flex flex-col justify-between h-full min-h-screen">
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
          
          {/* Left Column: Tapes, Timers & CCTV */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Cassette Deck */}
            <CRTPanel className="p-4 flex flex-col gap-4">
              <span className="text-[10px] font-bold text-terminal-green border-b border-terminal-green/20 pb-1.5 uppercase select-none">
                Narrative audio playback
              </span>
              
              <div className="flex justify-between items-center bg-black/60 border border-terminal-metal p-3 rounded">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-c4cdc4/50 font-bold uppercase select-none">Target Tape</span>
                  <span className="text-xs font-bold text-white max-w-[150px] truncate">
                    {matchingCharacterName(characters, currentTest?.characterId || '')}
                  </span>
                </div>
                <TimerDisplay seconds={timerLeft} />
              </div>

              <TapePlayer
                title={matchingCharacterName(characters, currentTest?.characterId || '') || 'Subject Tape'}
                isPlaying={isPlayingTape}
                onTogglePlay={toggleTapePlayback}
              />
            </CRTPanel>

            {/* CCTV Glitchy Camera Feed */}
            <CRTPanel className="p-4 flex flex-col gap-3 overflow-hidden">
              <div className="flex justify-between items-center text-[9px] text-terminal-green-dim font-bold border-b border-terminal-green/20 pb-1.5 uppercase select-none">
                <span className="flex items-center gap-1.5">
                  <Video size={12} className="text-terminal-red animate-pulse" />
                  CCTV ROOM FEED
                </span>
                <span className="text-terminal-red flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-red animate-ping" />
                  REC
                </span>
              </div>

              <div className="relative aspect-video bg-black border border-terminal-metal overflow-hidden rounded cctv-glitch">
                {/* Camera Static Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_95%)] z-10 pointer-events-none" />
                
                {/* CCTV Info text overlays */}
                <div className="absolute top-2 left-2 z-10 font-mono text-[7px] text-terminal-green flex flex-col select-none">
                  <span>{getCctvLabel()}</span>
                  <span>{cctvTime}</span>
                </div>
                <div className="absolute bottom-2 right-2 z-10 font-mono text-[7px] text-terminal-green select-none">
                  <span>SIGNAL: DECRYPTED</span>
                </div>

                {/* Central subject visual silhouette */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" stroke="#39ff14" strokeWidth="1">
                    {/* Outer target ring */}
                    <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
                    <path d="M 50 5 L 50 15 M 50 85 L 50 95 M 5 50 L 15 50 M 85 50 L 95 50" />
                    
                    {/* Silhouette posture representation */}
                    <path d="M 50 25 C 55 25 58 30 58 35 C 58 42 53 45 50 48 C 47 45 42 42 42 35 C 42 30 45 25 50 25 Z" fill="none" strokeWidth="1.5" />
                    <path d="M 25 80 C 35 60 40 52 50 52 C 60 52 65 60 75 80" fill="none" strokeWidth="1.5" strokeLinecap="round" />
                    
                    {/* Flashing scanner line */}
                    <line x1="10" y1="50" x2="90" y2="50" strokeWidth="0.5" strokeDasharray="2 2" className="animate-bounce" />
                  </svg>
                </div>

                {/* Scanning visual overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.05)_50%,transparent_50%)] bg-[size:100%_4px] pointer-events-none z-10" />
              </div>
            </CRTPanel>

            {/* Decrypter Button */}
            {!isFinished && currentTest && (
              <button
                onClick={() => {
                  sound.playBeep();
                  setShowClues(true);
                }}
                className="w-full bg-terminal-metal hover:bg-terminal-green/5 border border-terminal-metal-light hover:border-terminal-green p-3 rounded font-bold text-xs text-c4cdc4 hover:text-terminal-green cursor-pointer transition-all flex items-center justify-center gap-2 select-none"
              >
                <FileText size={14} />
                ACCESS DECRYPTION MEMORIES ({currentTest.clues.length} AVAILABLE)
              </button>
            )}
          </div>

          {/* Right Columns: Dialogue Typewriter, Decisions & Scores */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Transcript / Screen console */}
            <CRTPanel className="min-h-[220px] p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[9px] text-terminal-green-dim font-bold border-b border-terminal-green/20 pb-1.5 mb-3 uppercase tracking-wider select-none">
                  <span>TAPE TRANSCRIPTION TERMINAL</span>
                  <span>STATUS: {isPlayingTape ? 'RECEIVING STREAM...' : 'STREAM READY'}</span>
                </div>
                
                <div className="text-sm text-terminal-green font-bold leading-relaxed whitespace-pre-wrap font-mono min-h-[120px] select-text">
                  {textPrinted}
                  {isPlayingTape && <span className="typewriter-cursor" />}
                </div>
              </div>

              {/* Fictional rules warning */}
              {!isPlayingTape && !isFinished && currentTest && (
                <div className="border border-terminal-green/20 bg-[#0d140d] px-3 py-2 rounded text-[10px] leading-snug text-terminal-green-dim font-bold mt-4 uppercase select-none">
                  <span className="text-terminal-green">RULES:</span> {currentTest.rules}
                </div>
              )}
            </CRTPanel>

            {/* Branches / Decisions or Final Ending Details */}
            {isFinished && ending ? (
              <CRTPanel className="p-6 border-2 border-terminal-green animate-pulse">
                <div className="flex items-center gap-2 text-terminal-green mb-3 border-b border-terminal-green/20 pb-3 select-none">
                  <Radio size={20} className="animate-ping" />
                  <h3 className="font-extrabold text-sm uppercase tracking-widest">
                    [SIMULATION RESOLVED — CASE ARCHIVED]
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] text-c4cdc4/55 font-bold uppercase select-none">Ending Reached:</span>
                    <h4 className="text-lg font-extrabold text-white mt-0.5">{ending.title}</h4>
                  </div>

                  <p className="text-xs leading-relaxed text-c4cdc4/80 select-text">
                    {ending.description}
                  </p>

                  <div className="flex flex-col gap-2 border-t border-terminal-metal-light pt-3 mt-2">
                    <span className="text-[9px] text-c4cdc4/50 font-bold uppercase select-none">Case Record File:</span>
                    <div className="bg-black border border-terminal-metal p-3 rounded font-mono text-[9.5px] leading-relaxed text-c4cdc4/80 max-h-36 overflow-y-auto whitespace-pre-wrap select-text">
                      {currentRunReport}
                    </div>
                    
                    <div className="flex gap-3 justify-end mt-2 select-none">
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
                    /* Interactive 2D SVG/HTML puzzles */
                    <div className="bg-terminal-metal border border-terminal-metal-light p-5 rounded flex flex-col gap-4 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-terminal-metal-light pb-2 select-none">
                        <span className="font-extrabold text-terminal-green uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                          <Radio size={14} />
                          [SYSTEM CALIBRATION CONSOLE]
                        </span>
                        <span className="text-[9px] text-c4cdc4/55">
                          ATTEMPTS: {puzzleAttempts} / 3
                        </span>
                      </div>

                      <p className="text-[11px] text-white leading-normal font-bold">
                        {currentTest?.puzzleData?.question || 'Calibrate the terminal values to proceed.'}
                      </p>

                      {currentTest?.puzzleType === 'logic' && (
                        <div className="flex flex-col gap-3">
                          {/* Circular vault lock SVG */}
                          <div className="flex justify-center my-2 select-none">
                            <svg width="150" height="150" viewBox="0 0 200 200">
                              <circle cx="100" cy="100" r="90" fill="#151715" stroke="#2c322c" strokeWidth="5" />
                              <circle cx="100" cy="100" r="82" fill="#060706" stroke="#39ff14" strokeWidth="0.8" strokeDasharray="3 3" />
                              
                              <circle cx="100" cy="100" r="62" fill="none" stroke="#222722" strokeWidth="6" />
                              <circle cx="100" cy="100" r="46" fill="none" stroke="#181a18" strokeWidth="6" />
                              <circle cx="100" cy="100" r="30" fill="none" stroke="#222722" strokeWidth="6" />
                              
                              {/* Lock indicator */}
                              <polygon points="100,12 95,22 105,22" fill="#39ff14" />
                              <line x1="100" y1="22" x2="100" y2="100" stroke="#39ff14" strokeWidth="0.5" strokeDasharray="2 2" />
                              
                              <rect x="50" y="86" width="100" height="28" rx="2" fill="#000" stroke="#39ff14" strokeWidth="1" />
                              <text x="100" y="103" fill="#39ff14" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                                {dialYear}-{dialMonth}-{dialDay}
                              </text>
                            </svg>
                          </div>

                          {/* Controls */}
                          <div className="flex justify-around bg-black/40 border border-terminal-metal p-3 rounded select-none">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[7.5px] text-c4cdc4/50 uppercase font-bold">YEAR</span>
                              <button
                                onClick={() => setDialYear(prev => rotateValue(prev, years, 'up'))}
                                className="px-2 py-0.5 border border-terminal-green bg-terminal-green/5 text-terminal-green text-[9px] font-bold rounded cursor-pointer hover:bg-terminal-green hover:text-black"
                              >
                                ▲
                              </button>
                              <span className="text-[10px] font-bold text-white font-mono bg-black px-2 py-0.5 border border-terminal-metal rounded">{dialYear}</span>
                              <button
                                onClick={() => setDialYear(prev => rotateValue(prev, years, 'down'))}
                                className="px-2 py-0.5 border border-terminal-green bg-terminal-green/5 text-terminal-green text-[9px] font-bold rounded cursor-pointer hover:bg-terminal-green hover:text-black"
                              >
                                ▼
                              </button>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[7.5px] text-c4cdc4/50 uppercase font-bold">MONTH</span>
                              <button
                                onClick={() => setDialMonth(prev => rotateValue(prev, months, 'up'))}
                                className="px-2 py-0.5 border border-terminal-green bg-terminal-green/5 text-terminal-green text-[9px] font-bold rounded cursor-pointer hover:bg-terminal-green hover:text-black"
                              >
                                ▲
                              </button>
                              <span className="text-[10px] font-bold text-white font-mono bg-black px-2 py-0.5 border border-terminal-metal rounded">{dialMonth}</span>
                              <button
                                onClick={() => setDialMonth(prev => rotateValue(prev, months, 'down'))}
                                className="px-2 py-0.5 border border-terminal-green bg-terminal-green/5 text-terminal-green text-[9px] font-bold rounded cursor-pointer hover:bg-terminal-green hover:text-black"
                              >
                                ▼
                              </button>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[7.5px] text-c4cdc4/50 uppercase font-bold">DAY</span>
                              <button
                                onClick={() => setDialDay(prev => rotateValue(prev, days, 'up'))}
                                className="px-2 py-0.5 border border-terminal-green bg-terminal-green/5 text-terminal-green text-[9px] font-bold rounded cursor-pointer hover:bg-terminal-green hover:text-black"
                              >
                                ▲
                              </button>
                              <span className="text-[10px] font-bold text-white font-mono bg-black px-2 py-0.5 border border-terminal-metal rounded">{dialDay}</span>
                              <button
                                onClick={() => setDialDay(prev => rotateValue(prev, days, 'down'))}
                                className="px-2 py-0.5 border border-terminal-green bg-terminal-green/5 text-terminal-green text-[9px] font-bold rounded cursor-pointer hover:bg-terminal-green hover:text-black"
                              >
                                ▼
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => submitPuzzleAnswer(`${dialYear}-${dialMonth}-${dialDay}`)}
                            className="w-full bg-terminal-green border border-terminal-green text-black hover:bg-transparent hover:text-terminal-green py-2 font-bold font-mono rounded cursor-pointer transition-colors text-center text-xs select-none"
                          >
                            TEST LOCK OVERRIDE COMBINATION
                          </button>
                          {puzzleAttempts > 0 && <span className="text-terminal-red text-[9px] font-bold uppercase animate-pulse text-center block mt-1">! INVALID OVERRIDE TIMESTAMP VALUE RECEIVED</span>}
                        </div>
                      )}

                      {currentTest?.puzzleType === 'confession' && (
                        <div className="flex flex-col gap-3">
                          {/* 3D Perspective Mirror cards */}
                          <div className="perspective-container grid grid-cols-3 gap-4 my-2 select-none">
                            {currentTest.puzzleData.confessionOptions?.map((opt: any, idx: number) => {
                              const mirrorClass = idx === 0 ? 'mirror-left' : idx === 1 ? 'mirror-center' : 'mirror-right';
                              const isSelected = puzzleInput === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    sound.playClick();
                                    setPuzzleInput(opt.id);
                                  }}
                                  className={`mirror-3d ${mirrorClass} flex flex-col justify-between aspect-[3/5] bg-gradient-to-b from-[#181a18] to-black border-2 rounded p-2 text-center text-mono transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-terminal-green shadow-[0_0_15px_rgba(57,255,20,0.4)]'
                                      : 'border-terminal-metal hover:border-terminal-green/50'
                                  }`}
                                >
                                  <span className="text-[7.5px] text-c4cdc4/55 font-bold">MIRROR {idx + 1}</span>
                                  
                                  {/* Face outline representation */}
                                  <div className="flex-1 flex items-center justify-center opacity-35 hover:opacity-75">
                                    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke={isSelected ? '#39ff14' : '#2c322c'} strokeWidth="2">
                                      <path d="M 50 15 A 25 25 0 0 1 50 65 A 25 25 0 0 1 50 15" />
                                      <path d="M 20 90 Q 50 70 80 90" />
                                      {isSelected && (
                                        <>
                                          <circle cx="40" cy="35" r="3" fill="#39ff14" />
                                          <circle cx="60" cy="35" r="3" fill="#39ff14" />
                                          <path d="M 45 50 Q 50 55 55 50" />
                                        </>
                                      )}
                                    </svg>
                                  </div>
                                  
                                  <span className="text-[8px] text-c4cdc4/40 mt-1 uppercase truncate font-mono">
                                    {opt.id}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Selected mirror detail text */}
                          {puzzleInput && (
                            <div className="bg-black/60 border border-terminal-green/20 p-2.5 rounded font-mono text-[9.5px] text-terminal-green leading-snug">
                              <span className="font-extrabold uppercase select-none block mb-1">Mirror Reflection Detail:</span>
                              "{currentTest.puzzleData.confessionOptions?.find((o: any) => o.id === puzzleInput)?.text}"
                            </div>
                          )}

                          <button
                            disabled={!puzzleInput}
                            onClick={() => submitPuzzleAnswer(puzzleInput)}
                            className={`w-full py-2 font-bold font-mono rounded transition-colors text-center text-xs select-none ${
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
                          {/* Tilting mechanical scale SVG */}
                          <div className="flex justify-center my-2 select-none">
                            <svg width="240" height="150" viewBox="0 0 300 200">
                              <rect x="142" y="50" width="16" height="120" fill="#222622" stroke="#161916" strokeWidth="2" />
                              <polygon points="120,170 180,170 170,185 130,185" fill="#161916" />
                              
                              <circle cx="150" cy="50" r="14" fill="#0a0b0a" stroke="#39ff14" strokeWidth="1.5" />
                              <line x1="150" y1="50" x2={150 + Math.sin(scaleAngle * Math.PI / 180) * 16} y2={50 - Math.cos(scaleAngle * Math.PI / 180) * 16} stroke="#39ff14" strokeWidth="2" />
                              
                              <g style={{ transform: `rotate(${scaleAngle}deg)`, transformOrigin: '150px 50px', transition: 'transform 0.3s ease-out' }}>
                                <line x1="50" y1="50" x2="250" y2="50" stroke="#39ff14" strokeWidth="4" />
                                <circle cx="50" cy="50" r="4" fill="#39ff14" />
                                <circle cx="250" cy="50" r="4" fill="#39ff14" />
                              </g>
                              
                              <g style={{ transform: `translateY(${leftY}px)`, transition: 'transform 0.3s ease-out' }}>
                                <line x1="50" y1={50 + Math.sin(scaleAngle * Math.PI / 180) * 100} x2="25" y2="120" stroke="#c4cdc4" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="50" y1={50 + Math.sin(scaleAngle * Math.PI / 180) * 100} x2="75" y2="120" stroke="#c4cdc4" strokeWidth="1" strokeOpacity="0.4" />
                                <path d="M 20 120 L 80 120 Q 50 145 20 120" fill="#1c1f1c" stroke="#ff3914" strokeWidth="1.5" />
                                <text x="50" y="132" fill="#ff3914" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">BONUS</text>
                              </g>

                              <g style={{ transform: `translateY(${rightY}px)`, transition: 'transform 0.3s ease-out' }}>
                                <line x1="250" y1={50 - Math.sin(scaleAngle * Math.PI / 180) * 100} x2="225" y2="120" stroke="#c4cdc4" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="250" y1={50 - Math.sin(scaleAngle * Math.PI / 180) * 100} x2="275" y2="120" stroke="#c4cdc4" strokeWidth="1" strokeOpacity="0.4" />
                                <path d="M 220 120 L 280 120 Q 250 145 220 120" fill="#1c1f1c" stroke="#39ff14" strokeWidth="1.5" />
                                <text x="250" y="132" fill="#39ff14" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">WORKERS</text>
                              </g>
                            </svg>
                          </div>

                          <div className="flex flex-col gap-1.5 mt-2 select-none">
                            <input
                              type="range"
                              min="0"
                              max="250000"
                              step="10000"
                              value={puzzleInput || '0'}
                              onChange={(e) => {
                                sound.playClick();
                                setPuzzleInput(e.target.value);
                              }}
                              className="accent-terminal-green w-full h-1 bg-terminal-metal rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[7.5px] text-c4cdc4/40 uppercase">
                              <span>Keep Bonus ($0)</span>
                              <span>Transfer to Workers ($250,000)</span>
                            </div>
                          </div>

                          <button
                            onClick={() => submitPuzzleAnswer(puzzleInput)}
                            className="w-full bg-terminal-green text-black border border-terminal-green hover:bg-transparent hover:text-terminal-green py-2 font-bold font-mono rounded cursor-pointer transition-colors text-center text-xs select-none"
                          >
                            CALIBRATE SCALES BALANCE
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
                          <span className="text-[9px] text-c4cdc4/40 mt-1 block select-text">
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
    </div>
  );
};

// Helper character matcher
function matchingCharacterName(chars: any[], charId: string) {
  return chars.find(c => c.id === charId)?.name;
}
