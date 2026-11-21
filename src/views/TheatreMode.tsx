import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CRTPanel } from '../components/common/CRTPanel';
import { TapePlayer } from '../components/common/TapePlayer';
import { TimerDisplay } from '../components/common/TimerDisplay';
import { MoralScoreBars } from '../components/common/MoralScoreBars';
import { TheatreScene } from '../components/common/TheatreScene';
import type { CharacterProfile } from '../types';
import { findGearPositions, getPuzzleControl } from '../services/simulationRules';
import { DERNIER_RELAIS_CAMPAIGN, getOrionDossierPiece } from '../services/dernierRelaisData';
import { isOrionConfirmed } from '../services/orionMarker';
import * as sound from '../services/sound';
import { Radio, AlertTriangle, FileText, ChevronRight, X, ArrowLeft, ScanLine } from 'lucide-react';

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
  // Read once per entry: the Station detour is written before the enquiry opens.
  const [orionConfirmed] = useState(isOrionConfirmed);
  const clueDialogRef = useRef<HTMLDivElement>(null);
  const theatreRef = useRef<HTMLDivElement>(null);

  // Local state for Gears Alignment Puzzle
  const [gearLeftClicks, setGearLeftClicks] = useState(0);
  const [gearRightClicks, setGearRightClicks] = useState(0);
  const restoredGearStage = useRef('');

  // Restore the saved index once per stage; equivalent gear positions preserve
  // the authored sum without overwriting a player's new rotations on each tick.
  useEffect(() => {
    if (!activeSimulation) return;
    const key = `${activeSimulation.campaign.id}:${activeSimulation.currentTestIndex}:${activeSimulation.puzzleAttempts}`;
    if (restoredGearStage.current === key) return;
    restoredGearStage.current = key;
    const positions = findGearPositions(Number(activeSimulation.puzzleInput));
    setGearLeftClicks(positions?.left ?? 0);
    setGearRightClicks(positions?.right ?? 0);
  }, [activeSimulation]);

  // A stage transition starts at the new room, rather than leaving the player
  // below its illustration at the previous stage's console scroll position.
  useEffect(() => {
    const theatre = theatreRef.current;
    if (!theatre) return;
    theatre.scrollTop = 0;
    theatre.querySelector<HTMLHeadingElement>('h1')?.focus({ preventScroll: true });
  }, [activeSimulation?.currentTestIndex]);

  // Keep clue inspection inside its dialog and return to the triggering control.
  useEffect(() => {
    if (!showClues) return;
    const previousFocus = document.activeElement;
    clueDialogRef.current?.focus();
    return () => {
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [showClues]);

  // The handover story keeps its quiet introduction; the test at the press opens
  // on the franchise's laughter cue like the other authored campaigns.
  useEffect(() => {
    if (activeSimulation?.campaign.id !== DERNIER_RELAIS_CAMPAIGN.id) sound.playBillyLaughter();
  }, [activeSimulation?.campaign.id]);

  // Keyboard shortcuts listener
  useEffect(() => {
    if (!activeSimulation) return;
    const { isPlayingTape, isFinished, tests: simTests, currentTestIndex, isPuzzleSolved, isPuzzleActive } = activeSimulation;
    const currentTest = simTests[currentTestIndex];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Escape' && showClues) {
        e.preventDefault();
        setShowClues(false);
        return;
      }
      if (showClues || (e.target instanceof Element && e.target.closest('button, a, input, textarea, select, summary, [contenteditable="true"], [role="button"]'))) {
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
          const choiceId = currentTest.choices[0]?.id;
          if (choiceId) submitChoice(choiceId);
        }
      } else if (key === '2') {
        e.preventDefault();
        if (!isPlayingTape && !isFinished && currentTest && (!isPuzzleActive || isPuzzleSolved)) {
          const choiceId = currentTest.choices[1]?.id;
          if (choiceId) submitChoice(choiceId);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSimulation, toggleTapePlayback, exitSimulation, submitChoice, showClues]);

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
  const isDernierRelais = campaign.id === DERNIER_RELAIS_CAMPAIGN.id;
  const orionPiece = isDernierRelais ? getOrionDossierPiece(orionConfirmed) : null;
  const orionClue = orionPiece?.clue && orionPiece.clue.testId === currentTest?.id ? orionPiece.clue.text : null;
  const puzzleControl = getPuzzleControl(currentTest);

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

  // Mechanical balance scale dynamics
  const scaleWeight = Number(puzzleInput) || 0;
  const scaleMax = puzzleControl.kind === 'scale' ? puzzleControl.max : 250000;
  const ratio = scaleWeight / scaleMax;
  const scaleAngle = (ratio - 0.5) * 36; // tilt between -18 and +18 degrees
  const leftY = scaleAngle * 1.2;
  const rightY = -scaleAngle * 1.2;

  return (
    <div ref={theatreRef} className="theatre-mode fixed inset-0 bg-[#0a100a] z-40 overflow-y-auto p-4 md:p-8 font-mono">
      <a href="#theatre-stage-console" className="theatre-mode__skip">Skip to stage console</a>
      <div className="theatre-mode__inner">
        <header className="theatre-mode__topbar">
          <div>
            <p>Theatre / Fictional simulation</p>
            <strong>{campaign.title}</strong>
          </div>
          <button type="button" onClick={exitSimulation} className="theatre-mode__exit">
            <X size={16} aria-hidden="true" /> Exit theatre
          </button>
        </header>

        <TheatreScene
          campaign={campaign}
          tests={tests}
          currentTestIndex={currentTestIndex}
          completedTestIds={activeSimulation.decisions.map(decision => decision.testId)}
          subjectName={matchingCharacterName(characters, currentTest?.characterId || '')}
          isFinished={isFinished}
          isPlayingTape={isPlayingTape}
          isPuzzleActive={isPuzzleActive}
        />

        {/* Main Simulation Board Grid */}
        <div className="theatre-mode__board grid grid-cols-1 lg:grid-cols-3 gap-6 items-start flex-1 mb-8">
          
          {/* Audio and current run context */}
          <div id="theatre-audio" className="flex flex-col gap-6 lg:col-span-1">
            {/* Cassette Deck */}
            <CRTPanel className="theatre-mode__tape p-4 flex flex-col gap-4">
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
                <TimerDisplay seconds={timerLeft} isFinished={isFinished} />
              </div>

              <TapePlayer
                title={matchingCharacterName(characters, currentTest?.characterId || '') || 'Subject Tape'}
                isPlaying={isPlayingTape}
                onTogglePlay={toggleTapePlayback}
              />
            </CRTPanel>

            {/* Station dossier piece: the optional ORION detour follows the player here */}
            {orionPiece && (
              <CRTPanel className="p-4 flex flex-col gap-2">
                <span className="text-[9px] font-bold text-terminal-green border-b border-terminal-green/20 pb-1.5 uppercase select-none flex items-center gap-1.5">
                  <ScanLine size={12} aria-hidden="true" />
                  PIÈCE DU DOSSIER · REPÈRE ORION
                </span>
                <strong className="text-xs font-bold text-white">{orionPiece.title}</strong>
                <p className="text-[10.5px] leading-relaxed text-c4cdc4/80 select-text">{orionPiece.body}</p>
              </CRTPanel>
            )}

            {/* Subject Vitals Telemetry */}
            {activeSimulation.subjectVitals && (
              <CRTPanel className="p-4 flex flex-col gap-2">
                <span className="text-[9px] font-bold text-terminal-green border-b border-terminal-green/20 pb-1.5 uppercase select-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-ping" />
                  SUBJECT VITALS TELEMETRY
                </span>
                
                <div className="grid grid-cols-3 gap-2 text-center font-mono select-none">
                  <div className="bg-black/50 border border-terminal-metal p-2 rounded">
                    <span className="text-[8px] text-c4cdc4/50 block">PULSE</span>
                    <span className="text-xs font-bold text-terminal-red">
                      {activeSimulation.subjectVitals.heartRate} <span className="text-[8px] font-normal text-c4cdc4/60">BPM</span>
                    </span>
                  </div>
                  <div className="bg-black/50 border border-terminal-metal p-2 rounded">
                    <span className="text-[8px] text-c4cdc4/50 block">RESP</span>
                    <span className="text-xs font-bold text-[#e2a228]">
                      {activeSimulation.subjectVitals.respiration} <span className="text-[8px] font-normal text-c4cdc4/60">/MIN</span>
                    </span>
                  </div>
                  <div className="bg-black/50 border border-terminal-metal p-2 rounded">
                    <span className="text-[8px] text-c4cdc4/50 block">ADR</span>
                    <span className="text-xs font-bold text-terminal-green">
                      {activeSimulation.subjectVitals.adrenaline} <span className="text-[8px] font-normal text-c4cdc4/60">%</span>
                    </span>
                  </div>
                </div>

                {/* Simulated EKG Waveform */}
                <div className="w-full h-8 bg-black/60 border border-terminal-metal rounded relative overflow-hidden flex items-center">
                  <div className="absolute inset-y-0 left-0 right-0 opacity-40 bg-[linear-gradient(90deg,rgba(57,255,20,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />
                  <svg className="w-full h-full text-terminal-green" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path
                      d={
                        activeSimulation.subjectVitals.heartRate > 120
                          ? "M0,5 L20,5 L22,2 L24,8 L26,5 L40,5 L42,1 L44,9 L46,5 L60,5 L62,2 L64,8 L66,5 L80,5 L82,1 L84,9 L86,5 L100,5"
                          : "M0,5 L30,5 L33,1 L36,9 L39,5 L65,5 L68,1 L71,9 L74,5 L100,5"
                      }
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </CRTPanel>
            )}

            {/* Jigsaw Commentary Log */}
            {activeSimulation.commentaryLog && activeSimulation.commentaryLog.length > 0 && (
              <CRTPanel className="p-4 flex flex-col gap-2 max-h-[160px] overflow-hidden">
                <span className="text-[9px] font-bold text-terminal-green border-b border-terminal-green/20 pb-1.5 uppercase select-none">
                  ARCHITECT DIRECTIVES LOG
                </span>
                <div className="flex flex-col gap-1.5 font-mono text-[8px] text-c4cdc4/65 overflow-y-auto max-h-[100px] pr-1">
                  {activeSimulation.commentaryLog.slice(-5).map((logLine, idx) => (
                    <div key={idx} className="border-l border-terminal-green/30 pl-1.5">
                      <span className="text-terminal-green-dim font-bold block select-none">[LOG DATA]</span>
                      <span className="select-text">{logLine}</span>
                    </div>
                  ))}
                </div>
              </CRTPanel>
            )}

            {/* Decrypter Button */}
            {!isFinished && currentTest && (
              <button
                id="theatre-clues-trigger"
                onClick={() => {
                  sound.playBeep();
                  setShowClues(true);
                }}
                className="w-full bg-terminal-metal hover:bg-terminal-green/5 border border-terminal-metal-light hover:border-terminal-green p-3 rounded font-bold text-xs text-c4cdc4 hover:text-terminal-green cursor-pointer transition-all flex items-center justify-center gap-2 select-none"
              >
                <FileText size={14} />
                ACCESS DECRYPTION MEMORIES ({currentTest.clues.length + (orionClue ? 1 : 0)} AVAILABLE)
              </button>
            )}
          </div>

          {/* Right Columns: Dialogue Typewriter, Decisions & Scores */}
          <section id="theatre-stage-console" tabIndex={-1} aria-label="Current stage console" className="theatre-mode__console lg:col-span-2 flex flex-col gap-6">
            <h2 className="theatre-mode__console-heading">
              {isFinished ? 'Campaign outcome' : currentTest?.title || 'Stage console'}
              <span>{isFinished ? 'Review the ending and save your case record.' : 'Listen to the tape, respond in the console, then choose your branch.'}</span>
            </h2>
            
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
                    <div id="theatre-puzzle" className="bg-terminal-metal border border-terminal-metal-light p-5 rounded flex flex-col gap-4 font-mono text-xs">
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

                      {(puzzleControl.kind === 'date' || puzzleControl.kind === 'answer') && (
                        <form className="flex flex-col gap-3" onSubmit={event => { event.preventDefault(); if (puzzleInput.trim()) submitPuzzleAnswer(puzzleInput); }}>
                          {puzzleControl.kind === 'date' && (
                            <div className="flex justify-center my-2 select-none" aria-hidden="true">
                              <svg width="150" height="150" viewBox="0 0 200 200">
                                <circle cx="100" cy="100" r="90" fill="#151715" stroke="#2c322c" strokeWidth="5" />
                                <circle cx="100" cy="100" r="82" fill="#060706" stroke="#39ff14" strokeDasharray="3 3" />
                                <circle cx="100" cy="100" r="62" fill="none" stroke="#222722" strokeWidth="6" />
                                <rect x="40" y="86" width="120" height="28" rx="2" fill="#000" stroke="#39ff14" />
                                <text x="100" y="104" fill="#39ff14" fontSize="10" fontFamily="monospace" textAnchor="middle">{puzzleInput || '---- -- --'}</text>
                              </svg>
                            </div>
                          )}
                          <label htmlFor="theatre-puzzle-answer" className="text-[10px] text-c4cdc4/70">
                            {puzzleControl.kind === 'date' ? 'Date de calibration' : 'Réponse à l’énigme'}
                          </label>
                          <input id="theatre-puzzle-answer" type={puzzleControl.kind === 'date' ? 'date' : 'text'} required
                            value={puzzleInput} onChange={event => setPuzzleInput(event.target.value)} autoComplete="off"
                            className="w-full min-w-0 bg-black border border-terminal-metal p-3 text-xs text-white rounded" />
                          {puzzleControl.kind === 'answer' && currentTest.puzzleData.items?.length ? (
                            <div className="flex flex-wrap gap-2">{currentTest.puzzleData.items.map((item, index) => (
                              <button key={`${index}:${item}`} type="button" onClick={() => setPuzzleInput(item)}
                                className="min-w-0 max-w-full break-words text-left border border-terminal-metal p-2 rounded text-[10px] text-c4cdc4">{item}</button>
                            ))}</div>
                          ) : null}
                          <button type="submit" disabled={!puzzleInput.trim()}
                            className="w-full bg-terminal-green border border-terminal-green text-black py-2 font-bold rounded disabled:opacity-40 cursor-pointer">
                            Valider la réponse
                          </button>
                          {puzzleAttempts > 0 && <span className="text-terminal-red text-[9px] font-bold text-center">Réponse incorrecte. Consultez les indices ou réessayez.</span>}
                        </form>
                      )}

                      {puzzleControl.kind === 'confession' && (
                        <div className="flex flex-col gap-3">
                          {/* 3D Perspective Mirror cards */}
                          <div className="perspective-container grid grid-cols-3 gap-4 my-2 select-none">
                            {currentTest.puzzleData.confessionOptions?.map((opt, idx) => {
                              const mirrorClass = idx === 0 ? 'mirror-left' : idx === 1 ? 'mirror-center' : 'mirror-right';
                              const isSelected = puzzleInput === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  aria-pressed={isSelected}
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

                      {puzzleControl.kind === 'scale' && (
                        <form className="flex flex-col gap-4" onSubmit={event => {
                          event.preventDefault();
                          if (puzzleInput.trim() && Number.isFinite(Number(puzzleInput)) && Number(puzzleInput) >= 0 && Number(puzzleInput) <= scaleMax) submitPuzzleAnswer(puzzleInput);
                        }}>
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
                              aria-label="Transfer to workers fund"
                              aria-valuetext={`${Number(puzzleInput || 0).toLocaleString()} dollars transferred`}
                              min="0"
                              max={puzzleControl.max}
                              step="any"
                              value={puzzleInput || '0'}
                              onChange={(e) => {
                                sound.playClick();
                                setPuzzleInput(e.target.value);
                              }}
                              className="accent-terminal-green w-full h-1 bg-terminal-metal rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[7.5px] text-c4cdc4/40 uppercase">
                              <span>Keep Bonus ($0)</span>
                              <span>Transfer to Workers (${puzzleControl.max.toLocaleString()})</span>
                            </div>
                            <label htmlFor="theatre-scale-value" className="text-[10px] text-c4cdc4/70">Valeur exacte</label>
                            <input id="theatre-scale-value" type="number" min="0" max={scaleMax} step="any" required value={puzzleInput}
                              onChange={event => setPuzzleInput(event.target.value)}
                              className="w-full min-w-0 bg-black border border-terminal-metal p-2 text-xs text-white rounded" />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-terminal-green text-black border border-terminal-green hover:bg-transparent hover:text-terminal-green py-2 font-bold font-mono rounded cursor-pointer transition-colors text-center text-xs select-none"
                          >
                            CALIBRATE SCALES BALANCE
                          </button>
                          {puzzleAttempts > 0 && <span className="text-terminal-red text-[9px] font-bold uppercase animate-pulse text-center block mt-1">! DEFICIT BALANCE ENCOUNTERED - ESCAPE ROUTE SECURED</span>}
                        </form>
                      )}

                      {puzzleControl.kind === 'gears' && (
                        <div className="flex flex-col gap-3">
                          {/* Gears rotation alignment rendering */}
                          <div className="flex justify-center items-center gap-6 my-2 select-none">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-[8px] text-c4cdc4/55 font-bold uppercase">LEFT DRIVE SHAFT</span>
                              <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: `rotate(${gearLeftClicks * 45}deg)`, transition: 'transform 0.2s ease-out' }}>
                                <circle cx="50" cy="50" r="30" fill="#1b1c1b" stroke="#39ff14" strokeWidth="2" />
                                {/* Gear Teeth */}
                                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                                  <rect
                                    key={angle}
                                    x="46"
                                    y="10"
                                    width="8"
                                    height="15"
                                    fill="#39ff14"
                                    transform={`rotate(${angle} 50 50)`}
                                  />
                                ))}
                                <circle cx="50" cy="50" r="10" fill="#000" stroke="#39ff14" strokeWidth="1" />
                                <line x1="50" y1="50" x2="50" y2="25" stroke="#ff3914" strokeWidth="2.5" />
                              </svg>
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playClick();
                                  const next = (gearLeftClicks + 1) % 8;
                                  setGearLeftClicks(next);
                                  setPuzzleInput(String(next * 3 + gearRightClicks * 2));
                                }}
                                className="px-3 py-1 border border-terminal-green bg-terminal-green/5 text-terminal-green hover:bg-terminal-green hover:text-black font-bold text-[9px] rounded cursor-pointer"
                              >
                                ROTATE (+3)
                              </button>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                              <span className="text-[8px] text-c4cdc4/55 font-bold uppercase">RIGHT DRIVE SHAFT</span>
                              <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: `rotate(${gearRightClicks * 60}deg)`, transition: 'transform 0.2s ease-out' }}>
                                <circle cx="50" cy="50" r="25" fill="#1b1c1b" stroke="#39ff14" strokeWidth="2" />
                                {/* Gear Teeth */}
                                {[0, 60, 120, 180, 240, 300].map((angle) => (
                                  <rect
                                    key={angle}
                                    x="47"
                                    y="15"
                                    width="6"
                                    height="12"
                                    fill="#39ff14"
                                    transform={`rotate(${angle} 50 50)`}
                                  />
                                ))}
                                <circle cx="50" cy="50" r="8" fill="#000" stroke="#39ff14" strokeWidth="1" />
                                <line x1="50" y1="50" x2="50" y2="28" stroke="#ff3914" strokeWidth="2" />
                              </svg>
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playClick();
                                  const next = (gearRightClicks + 1) % 6;
                                  setGearRightClicks(next);
                                  setPuzzleInput(String(gearLeftClicks * 3 + next * 2));
                                }}
                                className="px-3 py-1 border border-terminal-green bg-terminal-green/5 text-terminal-green hover:bg-terminal-green hover:text-black font-bold text-[9px] rounded cursor-pointer"
                              >
                                ROTATE (+2)
                              </button>
                            </div>
                          </div>

                          {/* Gears target output status */}
                          <div className="bg-black/60 border border-terminal-metal p-3 rounded flex justify-between items-center select-none font-mono">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] text-c4cdc4/50 font-bold uppercase">Alignment ratio</span>
                              <span className={`text-xs font-bold ${gearLeftClicks * 3 + gearRightClicks * 2 === puzzleControl.target ? 'text-terminal-green' : 'text-terminal-red'}`}>
                                {gearLeftClicks * 3 + gearRightClicks * 2} / {puzzleControl.target} index
                              </span>
                            </div>
                            <span className="text-[9px] text-c4cdc4/40 uppercase">Target: Gear alignment matches marker</span>
                          </div>

                          <button
                            onClick={() => submitPuzzleAnswer(String(gearLeftClicks * 3 + gearRightClicks * 2))}
                            className="w-full bg-terminal-green border border-terminal-green text-black hover:bg-transparent hover:text-terminal-green py-2 font-bold font-mono rounded cursor-pointer transition-colors text-center text-xs select-none"
                          >
                            Valider l’alignement
                          </button>
                          {puzzleAttempts > 0 && <span className="text-terminal-red text-[9px] font-bold uppercase animate-pulse text-center block mt-1">! GEAR PRESSURE CRITICAL - LOCKWAY MISALIGNED</span>}
                        </div>
                      )}

                      {puzzleControl.kind === 'coordinates' && (
                        <div className="flex flex-col gap-3">
                          <span className="text-[8.5px] text-c4cdc4/50 font-bold uppercase select-none">{currentTest.puzzleData.gridLabel ?? (isDernierRelais ? 'INVENTAIRE DES CASIERS DE L’ATELIER :' : 'BATHROOM FLOOR COORDINATE SCANNER:')}</span>
                          
                          <div className="grid grid-cols-3 gap-3 my-2 select-none">
                            {['A-1', 'A-2', 'A-3', 'B-1', 'B-2', 'B-3', 'C-1', 'C-2', 'C-3'].map((tile) => {
                              const isSelected = puzzleInput === tile;
                              return (
                                <button
                                  key={tile}
                                  onClick={() => {
                                    sound.playClick();
                                    setPuzzleInput(tile);
                                  }}
                                  className={`p-4 border rounded font-mono text-center font-bold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-terminal-green/10 border-terminal-green text-terminal-green shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                                      : 'bg-black/40 border-terminal-metal text-c4cdc4/60 hover:text-white hover:border-terminal-green/50'
                                  }`}
                                >
                                  {tile}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            disabled={!puzzleInput}
                            onClick={() => submitPuzzleAnswer(puzzleInput)}
                            className={`w-full py-2 font-bold font-mono rounded transition-colors text-center text-xs select-none ${
                              puzzleInput
                                ? 'bg-terminal-green border border-terminal-green text-black hover:bg-transparent hover:text-terminal-green cursor-pointer'
                                : 'bg-terminal-metal border border-terminal-metal-light text-c4cdc4/25 cursor-not-allowed'
                            }`}
                          >
                            {isDernierRelais ? 'Valider le casier' : 'SCAN SELECTED COORDINATE TILE'}
                          </button>
                          {puzzleAttempts > 0 && <span className="text-terminal-red text-[9px] font-bold uppercase animate-pulse text-center block mt-1">{isDernierRelais ? 'Association non reconnue. Relisez l’inventaire puis réessayez.' : '! SCAN EMPTY - STEAM VENT DISCHARGE DETECTED'}</span>}
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

          </section>

        </div>

        {/* Clues Modal Screen */}
        {showClues && currentTest && (
          <div
            ref={clueDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="theatre-clues-heading"
            tabIndex={-1}
            onKeyDown={event => {
              if (event.key !== 'Tab') return;
              const buttons = clueDialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])');
              if (!buttons?.length) return;
              const first = buttons[0];
              const last = buttons[buttons.length - 1];
              if (event.shiftKey && (document.activeElement === first || document.activeElement === clueDialogRef.current)) {
                event.preventDefault();
                last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fade-in"
          >
            <div className="bg-terminal-metal border-2 border-terminal-green max-w-md w-full p-5 rounded shadow-lg crt-screen">
              <div className="scanline-overlay" />
              <div className="visual-noise-overlay" style={{ opacity: 0.15 }} />
              
              <div className="flex justify-between items-center border-b border-terminal-green/20 pb-2 mb-4 select-none">
                <h2 id="theatre-clues-heading" className="text-xs font-bold text-terminal-green flex items-center gap-1.5 uppercase">
                  <FileText size={14} />
                  Decrypted Archives Logs
                </h2>
                <button
                  aria-label="Close clue archives"
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
                {orionClue && (
                  <div className="bg-terminal-green/5 border border-terminal-green/40 p-3 rounded text-[11px] leading-relaxed font-mono">
                    <div className="flex justify-between items-baseline mb-1 select-none">
                      <span className="text-terminal-green font-bold uppercase">Dossier entry — station ORION</span>
                      <span className="text-[8px] text-terminal-green-dim uppercase font-bold">[VERSÉ]</span>
                    </div>
                    <p className="text-c4cdc4/90 mt-1 select-text">{orionClue}</p>
                  </div>
                )}
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
function matchingCharacterName(chars: CharacterProfile[], charId: string) {
  return chars.find(c => c.id === charId)?.name;
}
