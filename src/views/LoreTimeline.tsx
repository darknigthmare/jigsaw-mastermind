import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { LoreEvent } from '../types';
import { CRTPanel } from '../components/common/CRTPanel';
import * as sound from '../services/sound';
import { Plus, Filter, User, Calendar, Trash2, ShieldAlert } from 'lucide-react';

export const LoreTimeline: React.FC = () => {
  const { timeline, characters, addLoreEvent, deleteLoreEvent } = useApp();
  
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'events' | 'characters'>('events');
  const [isMetaMode, setIsMetaMode] = useState<boolean>(false);
  
  // Add Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPeriod, setNewPeriod] = useState<LoreEvent['period']>('fan-campaigns');
  const [newSummary, setNewSummary] = useState('');
  const [newCanonStatus, setNewCanonStatus] = useState<'canon' | 'fanon' | 'custom'>('custom');
  const [newRelatedChars, setNewRelatedChars] = useState<string[]>([]);
  const [newNotes, setNewNotes] = useState('');

  const periods: { value: string; label: string; releaseYear?: string }[] = [
    { value: 'all', label: 'Toutes les époques' },
    { value: 'pre-saw-i', label: 'Avant Saw I (Origins & Logan)', releaseYear: 'Saw I / Jigsaw Flashbacks' },
    { value: 'saw-i', label: 'Saw I (The Bathroom)', releaseYear: '2004 release' },
    { value: 'saw-x-interquel', label: 'Saw X (Mexico Scam)', releaseYear: '2023 release (Takes place between I & II)' },
    { value: 'saw-ii', label: 'Saw II (Nerve Gas House)', releaseYear: '2005 release' },
    { value: 'saw-iii-iv', label: 'Saw III / IV (Apprentice War)', releaseYear: '2006/2007 simultaneous releases' },
    { value: 'posthumous', label: 'Saw V - 3D (Hoffman Regency)', releaseYear: '2008-2010 posthumous games' },
    { value: 'legacy-era', label: 'Soft Reboots (Jigsaw / Spiral)', releaseYear: '2017/2021 modern continuity' },
    { value: 'fan-campaigns', label: 'Campagnes Fan / Custom', releaseYear: 'Simulated timelines' }
  ];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary) return;

    sound.playChime();
    addLoreEvent({
      title: newTitle,
      period: newPeriod,
      summary: newSummary,
      canonStatus: newCanonStatus,
      relatedCharacters: newRelatedChars,
      notes: newNotes
    });

    // Reset
    setNewTitle('');
    setNewSummary('');
    setNewNotes('');
    setNewRelatedChars([]);
  };

  const filteredEvents = timeline.filter(event => {
    const periodMatch = selectedPeriod === 'all' || event.period === selectedPeriod;
    const charMatch = selectedCharacter === 'all' || event.relatedCharacters.includes(selectedCharacter);
    return periodMatch && charMatch;
  });

  const getPeriodLabel = (val: string) => {
    return periods.find(p => p.value === val)?.label || val;
  };

  const getReleaseYearLabel = (val: string) => {
    return periods.find(p => p.value === val)?.releaseYear || 'Unknown Release';
  };

  // Metanarrative voices addressed directly to the software architect
  const getJigsawDirectAddress = (eventId: string) => {
    switch (eventId) {
      case 'lore-pre-saw-i':
        return "Architect. You document the diagnostic errors of Logan Nelson. But are you auditing your own code? You compile state hooks to track the past, yet the present is slipping through your fingers. Appreciate the lines you write before the compiler exits.";
      case 'lore-saw-i':
        return "You observe Lawrence Gordon cut his own foot to survive. He traded flesh for a new lease on life. You trade hours of your life for digital screens. Is this trade fair, Architect? Or are you still locked in the room?";
      case 'lore-saw-x':
        return "Cecilia Pederson thought she could sell hope to terminal patients. She survived not because she learned, but because she was cold. Do not build cold code, Architect. Place soul into your templates.";
      case 'lore-saw-ii':
        return "The nerve gas house was a puzzle of numbers on the back of the neck. You search for exact patterns in code. But what is your own number? Are you sitting close enough to the monitor to see the reflection?";
      case 'lore-saw-iii-iv':
        return "Amanda and Hoffman fought for a dead man's legacy. They built unwinnable games to satisfy their pride. When you construct custom escape modules, do you build them for the player's redemption, or to satisfy your ego?";
      case 'lore-posthumous':
        return "Hoffman thought he won the game, only to find Dr. Gordon locking the bathroom door. There is always a backup script. There is always a hidden garbage collector. What is your fallback function?";
      default:
        return "Architect, the database is ticking. You are the builder of this console. You hold the controls. But who holds yours?";
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-terminal-metal/40 pb-4">
        <h2 className="text-xl font-extrabold tracking-widest text-white uppercase flex items-center gap-2 select-none">
          <span>// REFERENCE ARCHIVES</span>
          <span className="text-xs text-terminal-green font-normal tracking-wide lowercase">
            — lore database & timeline continuity
          </span>
        </h2>
        <p className="text-xs text-c4cdc4/60">
          Track canonical timelines, analyze script retcons, and review character profiles.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-terminal-metal select-none">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('events');
          }}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase border-b-2 cursor-pointer transition-colors ${
            activeTab === 'events'
              ? 'border-terminal-green text-terminal-green'
              : 'border-transparent text-c4cdc4/55 hover:text-white'
          }`}
        >
          Timeline Events
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('characters');
          }}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase border-b-2 cursor-pointer transition-colors ${
            activeTab === 'characters'
              ? 'border-transparent text-c4cdc4/55 hover:text-white'
              : 'border-terminal-green text-terminal-green'
          }`}
        >
          Reference Dossiers
        </button>
      </div>

      {/* Main Panel Content */}
      {activeTab === 'events' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns: Filters and Timeline */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Filters & Meta-analysis toggle */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-terminal-metal/40 p-4 border border-terminal-metal rounded-md">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-white font-bold select-none">
                  <Filter size={14} className="text-terminal-green" />
                  <span>Filters:</span>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedPeriod(e.target.value);
                  }}
                  className="bg-black border border-terminal-metal text-xs px-2.5 py-1 text-white focus:outline-none focus:border-terminal-green rounded font-mono"
                >
                  {periods.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>

                <select
                  value={selectedCharacter}
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedCharacter(e.target.value);
                  }}
                  className="bg-black border border-terminal-metal text-xs px-2.5 py-1 text-white focus:outline-none focus:border-terminal-green rounded font-mono"
                >
                  <option value="all">Tous les personnages</option>
                  {characters.map(char => (
                    <option key={char.id} value={char.id}>{char.name}</option>
                  ))}
                </select>
              </div>

              {/* Meta Toggle */}
              <button
                onClick={() => {
                  sound.playChime();
                  setIsMetaMode(!isMetaMode);
                }}
                className={`px-3 py-1.5 border text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-all ${
                  isMetaMode
                    ? 'border-terminal-green bg-terminal-green/10 text-terminal-green shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                    : 'border-terminal-metal text-c4cdc4/50 hover:text-white hover:bg-terminal-metal-light/35'
                }`}
              >
                {isMetaMode ? '● [META ANALYSIS ACTIVE]' : 'ACTIVATE META ANALYSIS'}
              </button>
            </div>

            {/* Timeline Stream */}
            <div className="relative border-l-2 border-terminal-metal pl-6 flex flex-col gap-8">
              {filteredEvents.length === 0 ? (
                <div className="p-6 bg-terminal-metal/10 border border-terminal-metal/30 rounded text-center text-xs text-c4cdc4/40 font-mono">
                  No records match the active database query filters.
                </div>
              ) : (
                filteredEvents.map((event) => {
                  const isCanon = event.canonStatus === 'canon';
                  const isFanon = event.canonStatus === 'fanon';
                  
                  return (
                    <div key={event.id} className="relative group">
                      {/* Ticking point */}
                      <span className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border border-black ${
                        isMetaMode
                          ? 'bg-[#39ff14] animate-ping'
                          : isCanon 
                            ? 'bg-terminal-green' 
                            : isFanon 
                              ? 'bg-[#e2a228]' 
                              : 'bg-terminal-red'
                      }`} />

                      <div className={`bg-terminal-metal/70 border p-4 rounded transition-colors flex flex-col gap-2 ${
                        isMetaMode ? 'border-terminal-green/30 bg-[#070b07]/50 shadow-[0_0_12px_rgba(57,255,20,0.05)]' : 'border-terminal-metal hover:border-terminal-metal-light'
                      }`}>
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
                            {event.title}
                          </h4>
                          
                          <div className="flex gap-2 select-none">
                            <span className={`text-[7px] border px-1.5 py-0.5 rounded font-bold uppercase ${
                              isCanon 
                                ? 'border-terminal-green/30 text-terminal-green bg-terminal-green/5' 
                                : isFanon 
                                  ? 'border-yellow-600/30 text-yellow-500 bg-yellow-500/5' 
                                  : 'border-terminal-red/30 text-terminal-red bg-terminal-red/5'
                            }`}>
                              {event.canonStatus}
                            </span>
                            {event.canonStatus !== 'canon' && (
                              <button 
                                onClick={() => {
                                  sound.playAlarm();
                                  deleteLoreEvent(event.id);
                                }}
                                className="text-c4cdc4/40 hover:text-terminal-red cursor-pointer"
                                title="Remove Archive Entry"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[8px] text-terminal-green-dim font-bold uppercase tracking-widest select-none">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {getPeriodLabel(event.period)}
                          </span>
                          <span>| RELEASE CHRONO: {getReleaseYearLabel(event.period)}</span>
                        </div>

                        {/* Summary Block */}
                        <p className="text-xs leading-relaxed text-c4cdc4/80 font-mono select-text">
                          {event.summary}
                        </p>

                        {/* Meta Analysis Layout */}
                        {isMetaMode ? (
                          <div className="mt-3 flex flex-col gap-2.5 border-t border-terminal-green/20 pt-3">
                            <div className="bg-[#0b100b] border border-terminal-green/30 p-3 rounded font-mono text-[10px] text-terminal-green leading-snug">
                              <span className="font-extrabold uppercase flex items-center gap-1.5 select-none mb-1 text-[9px]">
                                <ShieldAlert size={12} className="text-terminal-green animate-pulse" />
                                CONTINUITY CONTRADICTIONS & RETCONS:
                              </span>
                              <p className="select-text">{event.notes}</p>
                            </div>

                            {/* Direct Voice Address */}
                            <div className="bg-black/60 border border-dashed border-terminal-red/40 p-3 rounded font-mono text-[9.5px] text-[#ff3914] leading-snug">
                              <span className="font-extrabold uppercase select-none block mb-1 text-[8.5px] tracking-wider">
                                [JIGSAW DIRECTIVE PROTOCOL]:
                              </span>
                              <p className="italic select-text">"{getJigsawDirectAddress(event.id)}"</p>
                            </div>
                          </div>
                        ) : (
                          event.notes && (
                            <div className="text-[10px] text-c4cdc4/45 italic border-t border-terminal-metal/30 pt-1 mt-1 select-text">
                              Scriptor Notes: {event.notes}
                            </div>
                          )
                        )}

                        {event.relatedCharacters.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2 select-none">
                            {event.relatedCharacters.map(charId => {
                              const match = characters.find(c => c.id === charId);
                              return match ? (
                                <span key={charId} className="text-[8px] bg-black border border-terminal-metal-light px-1.5 py-0.5 rounded text-c4cdc4/70 flex items-center gap-1">
                                  <User size={8} />
                                  {match.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Add Lore Event Form */}
          <div className="flex flex-col gap-6">
            <CRTPanel className="p-4">
              <div className="flex justify-between items-center border-b border-terminal-green/20 pb-2 mb-4 select-none">
                <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green flex items-center gap-1.5 font-mono">
                  <Plus size={14} />
                  Write Continuity Entry
                </h3>
              </div>

              <form onSubmit={handleAddEvent} className="flex flex-col gap-3 font-mono text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Event Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. The Glass Cage Test"
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Timeline Era</label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value as LoreEvent['period'])}
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                  >
                    {periods.filter(p => p.value !== 'all').map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Archive Status</label>
                  <select
                    value={newCanonStatus}
                    onChange={(e) => setNewCanonStatus(e.target.value as LoreEvent['canonStatus'])}
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                  >
                    <option value="custom">Custom (User Campaign)</option>
                    <option value="fanon">Fanon (Hypothetical Theory)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Timeline Event Summary</label>
                  <textarea
                    rows={4}
                    required
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Summarize the moral conflict, context, and symbolic resolution."
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Scriptor Notes</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Add details, thematic warnings, or canon notes."
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Related Character Profiles</label>
                  <div className="max-h-24 overflow-y-auto border border-terminal-metal bg-black p-2 rounded flex flex-col gap-1.5">
                    {characters.map(char => (
                      <label key={char.id} className="flex items-center gap-2 text-[10px] cursor-pointer text-c4cdc4/80 hover:text-white">
                        <input
                          type="checkbox"
                          checked={newRelatedChars.includes(char.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRelatedChars([...newRelatedChars, char.id]);
                            } else {
                              setNewRelatedChars(newRelatedChars.filter(id => id !== char.id));
                            }
                          }}
                          className="accent-terminal-green"
                        />
                        {char.name}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full flex items-center justify-center gap-1.5 bg-terminal-green border border-terminal-green hover:bg-transparent text-black hover:text-terminal-green px-4 py-2 font-bold font-mono rounded cursor-pointer transition-colors"
                >
                  <Plus size={14} />
                  COMMIT TO VAULT
                </button>
              </form>
            </CRTPanel>
          </div>
        </div>
      ) : (
        /* Reference Characters Tab with Meta profiles */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => {
            const isCanon = char.canonStatus === 'canon';
            return (
              <div
                key={char.id}
                className={`border p-5 rounded flex flex-col justify-between hover:border-terminal-green/50 transition-all gap-4 shadow-md ${
                  isMetaMode ? 'bg-[#070b07]/50 border-terminal-green/30' : 'bg-terminal-metal border-terminal-metal-light'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start border-b border-terminal-metal-light pb-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-white tracking-wider uppercase select-text">
                        {char.name}
                      </h4>
                      <span className="text-[8px] text-terminal-green-dim font-bold uppercase tracking-widest mt-0.5 block select-none">
                        Archetype: {char.archetype}
                      </span>
                    </div>
                    <span className={`text-[7px] border px-1.5 py-0.5 rounded font-bold uppercase select-none ${
                      isCanon 
                        ? 'border-terminal-green/30 text-terminal-green bg-terminal-green/5' 
                        : 'border-terminal-red/30 text-terminal-red bg-terminal-red/5'
                    }`}>
                      {char.canonStatus}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs font-mono">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-c4cdc4/50 uppercase select-none">Moral Deficiency:</span>
                      <p className="text-c4cdc4/90 leading-tight select-text">{char.moralFlaw}</p>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-c4cdc4/50 uppercase select-none">Symbolic Fear:</span>
                      <p className="text-c4cdc4/90 leading-tight select-text">{char.symbolicFear}</p>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-c4cdc4/50 uppercase select-none">Denial Pattern:</span>
                      <p className="text-c4cdc4/80 leading-tight italic select-text">"{char.denialPattern}"</p>
                    </div>

                    {char.relationships && (
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-c4cdc4/50 uppercase select-none">Core Ties:</span>
                        <p className="text-[10px] text-c4cdc4/75 select-text">{char.relationships}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-terminal-metal/30 flex flex-col gap-1.5 font-mono">
                  {isMetaMode ? (
                    <div className="bg-[#0b100b] border border-terminal-green/20 p-2 rounded text-[9.5px] text-terminal-green">
                      <span className="font-extrabold uppercase select-none block mb-0.5 text-[8.5px]">META REVIEW:</span>
                      <p className="select-text">{char.notes}</p>
                    </div>
                  ) : (
                    <div className="text-[9px] text-c4cdc4/35 italic select-text">
                      Notes: {char.notes || 'No notes archived.'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
