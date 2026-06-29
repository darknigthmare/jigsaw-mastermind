import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SymbolicTest, ChoiceBranch } from '../types';
import { CRTPanel } from '../components/common/CRTPanel';
import { Plus, Trash2, Edit } from 'lucide-react';

export const TestDesigner: React.FC = () => {
  const {
    tests,
    campaigns,
    characters,
    currentView,
    setView,
    addTest,
    updateTest,
    deleteTest
  } = useApp();

  const [campaignId, setCampaignId] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [title, setTitle] = useState('');
  const [moralTheme, setMoralTheme] = useState('Truth vs. Reputation');
  const [openingTape, setOpeningTape] = useState('');
  const [rules, setRules] = useState('');
  const [puzzleType, setPuzzleType] = useState<SymbolicTest['puzzleType']>('logic');
  
  // Clues (parsed as lines)
  const [cluesStr, setCluesStr] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(120);

  // Simple two-branch editor state
  const [choiceA_Text, setChoiceA_Text] = useState('');
  const [choiceA_Impact, setChoiceA_Impact] = useState('');
  const [choiceA_Truth, setChoiceA_Truth] = useState(10);
  const [choiceA_Responsibility, setChoiceA_Responsibility] = useState(10);
  const [choiceA_Denial, setChoiceA_Denial] = useState(-10);

  const [choiceB_Text, setChoiceB_Text] = useState('');
  const [choiceB_Impact, setChoiceB_Impact] = useState('');
  const [choiceB_Truth, setChoiceB_Truth] = useState(-15);
  const [choiceB_Responsibility, setChoiceB_Responsibility] = useState(-15);
  const [choiceB_Denial, setChoiceB_Denial] = useState(20);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleEditClick = (test: SymbolicTest) => {
    setIsEditing(true);
    setEditId(test.id);
    setCampaignId(test.campaignId);
    setCharacterId(test.characterId);
    setTitle(test.title);
    setMoralTheme(test.moralTheme);
    setOpeningTape(test.openingTape);
    setRules(test.rules);
    setPuzzleType(test.puzzleType);
    setCluesStr(test.clues.join('\n'));
    setTimerSeconds(test.timerSeconds);

    // Load branch choices
    const branchA = test.choices[0];
    if (branchA) {
      setChoiceA_Text(branchA.text);
      setChoiceA_Impact(branchA.narrativeImpact);
      setChoiceA_Truth(branchA.scoresEffect.truth || 0);
      setChoiceA_Responsibility(branchA.scoresEffect.responsibility || 0);
      setChoiceA_Denial(branchA.scoresEffect.denial || 0);
    }
    const branchB = test.choices[1];
    if (branchB) {
      setChoiceB_Text(branchB.text);
      setChoiceB_Impact(branchB.narrativeImpact);
      setChoiceB_Truth(branchB.scoresEffect.truth || 0);
      setChoiceB_Responsibility(branchB.scoresEffect.responsibility || 0);
      setChoiceB_Denial(branchB.scoresEffect.denial || 0);
    }

    setView('test-new');
  };

  const resetForm = () => {
    setCampaignId('');
    setCharacterId('');
    setTitle('');
    setOpeningTape('');
    setRules('');
    setPuzzleType('logic');
    setCluesStr('');
    setTimerSeconds(120);

    setChoiceA_Text('');
    setChoiceA_Impact('');
    setChoiceA_Truth(10);
    setChoiceA_Responsibility(10);
    setChoiceA_Denial(-10);

    setChoiceB_Text('');
    setChoiceB_Impact('');
    setChoiceB_Truth(-15);
    setChoiceB_Responsibility(-15);
    setChoiceB_Denial(20);
    
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignId || !characterId || !title || !openingTape || !rules || !choiceA_Text || !choiceB_Text) {
      alert("Please ensure all critical fields are completed.");
      return;
    }

    const clues = cluesStr.split('\n').filter(line => line.trim() !== '');

    const branchA: ChoiceBranch = {
      id: 'choice-a-' + Math.random().toString(36).substr(2, 5),
      text: choiceA_Text,
      narrativeImpact: choiceA_Impact,
      scoresEffect: {
        truth: choiceA_Truth,
        responsibility: choiceA_Responsibility,
        denial: choiceA_Denial,
        courage: Math.max(0, choiceA_Truth) // automatic small side effects
      }
    };

    const branchB: ChoiceBranch = {
      id: 'choice-b-' + Math.random().toString(36).substr(2, 5),
      text: choiceB_Text,
      narrativeImpact: choiceB_Impact,
      scoresEffect: {
        truth: choiceB_Truth,
        responsibility: choiceB_Responsibility,
        denial: choiceB_Denial,
        acceptance: choiceB_Denial > 0 ? -10 : 10
      }
    };

    // Fictional logic config placeholders
    const puzzleData = puzzleType === 'logic' ? {
      question: 'Identify the authentic ledger timestamp.',
      items: ['File #1 (Forged)', 'File #2 (Truth Log)', 'File #3 (Empty Log)'],
      correctAnswer: 'File #2 (Truth Log)'
    } : {};

    const payload = {
      campaignId,
      characterId,
      title,
      moralTheme,
      openingTape,
      rules,
      puzzleType,
      puzzleData,
      clues,
      timerSeconds,
      choices: [branchA, branchB],
      safetyNote: 'Fictional script. Consequence calculations are software narratives.'
    };

    if (isEditing && editId) {
      updateTest(editId, payload);
    } else {
      addTest(payload);
    }

    resetForm();
    setView('tests');
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this symbolic test design? Associated campaigns will lose this puzzle layer.")) {
      deleteTest(id);
    }
  };

  const isFormView = currentView === 'test-new';

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-terminal-metal/40 pb-4">
        <h2 className="text-xl font-extrabold tracking-widest text-white uppercase flex items-center gap-2">
          <span>// TEST CHAMBER</span>
          <span className="text-xs text-terminal-green font-normal tracking-wide lowercase">
            — symbolic test designer
          </span>
        </h2>
        <p className="text-xs text-c4cdc4/60">
          Construct moral puzzles, generate cassette tapes, set logic countdown timers, and outline moral consequences.
        </p>
      </div>

      {isFormView ? (
        /* Create/Edit Test Form Panel */
        <CRTPanel className="max-w-3xl mx-auto w-full p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green border-b border-terminal-green/20 pb-2 mb-4">
            {isEditing ? 'MODIFY SYMBOLIC CONFIGURATION' : 'DESIGN SYMBOLIC CONFLICT'}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
            
            {/* Top row: Campaign and Character selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Select Campaign</label>
                <select
                  required
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                >
                  <option value="">-- Choose Campaign --</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Assign Subject Character</label>
                <select
                  required
                  value={characterId}
                  onChange={(e) => setCharacterId(e.target.value)}
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                >
                  <option value="">-- Choose Character --</option>
                  {characters.map(char => (
                    <option key={char.id} value={char.id}>{char.name} ({char.archetype})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title, Theme, Puzzle and Timer */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Test Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Balance of Ledger"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Puzzle Type</label>
                <select
                  value={puzzleType}
                  onChange={(e) => setPuzzleType(e.target.value as SymbolicTest['puzzleType'])}
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                >
                  <option value="logic">Logical Puzzle</option>
                  <option value="confession">Moral Confession</option>
                  <option value="sacrifice">Symbolic Sacrifice</option>
                  <option value="choice">Branching Path</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Timer Duration (Seconds)</label>
                <input
                  type="number"
                  required
                  min={30}
                  max={600}
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>
            </div>

            {/* Tape message and Rules */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Fictional Cassette Tape Message</label>
                <span className="text-[8px] text-terminal-green-dim italic">Use cold, philosophical, and ceremonial phrasing.</span>
              </div>
              <textarea
                rows={4}
                required
                value={openingTape}
                onChange={(e) => setOpeningTape(e.target.value)}
                placeholder="Hello, subject. You have spent your life escaping... now, the scales are set. (NO violence or graphic descriptions)."
                className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Rules Statement</label>
                <input
                  type="text"
                  required
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="e.g. Choose whether to click mirror B or shatter the console."
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Clues Database (One per line)</label>
                <input
                  type="text"
                  value={cluesStr}
                  onChange={(e) => setCluesStr(e.target.value)}
                  placeholder="Clue #1: The override occurred on 2024-04-12"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>
            </div>

            {/* BRANCH A & B DESIGNERS */}
            <div className="border border-terminal-metal-light p-3 bg-black/35 rounded flex flex-col gap-4">
              <span className="text-[9px] font-extrabold text-white uppercase tracking-wider">
                Branching Decisions Logic
              </span>

              {/* Branch A (Positive/Redemption Choice) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-terminal-metal/30 pb-3">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-terminal-green uppercase">Option A: The Path of Truth</span>
                  <input
                    type="text"
                    required
                    value={choiceA_Text}
                    onChange={(e) => setChoiceA_Text(e.target.value)}
                    placeholder="e.g. Confess to falsifying the records"
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-[10px] p-2 text-white rounded font-mono"
                  />
                  <input
                    type="text"
                    value={choiceA_Impact}
                    onChange={(e) => setChoiceA_Impact(e.target.value)}
                    placeholder="Narrative impact (e.g., Victor submits File B, auditors are notified)"
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-[10px] p-2 text-white rounded font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Truth Delta</span>
                    <input type="number" value={choiceA_Truth} onChange={(e)=>setChoiceA_Truth(parseInt(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Resp Delta</span>
                    <input type="number" value={choiceA_Responsibility} onChange={(e)=>setChoiceA_Responsibility(parseInt(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Denial Delta</span>
                    <input type="number" value={choiceA_Denial} onChange={(e)=>setChoiceA_Denial(parseInt(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                </div>
              </div>

              {/* Branch B (Negative/Denial Choice) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-terminal-red uppercase">Option B: The Path of Denial</span>
                  <input
                    type="text"
                    required
                    value={choiceB_Text}
                    onChange={(e) => setChoiceB_Text(e.target.value)}
                    placeholder="e.g. Suppress the logs to save reputation"
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-[10px] p-2 text-white rounded font-mono"
                  />
                  <input
                    type="text"
                    value={choiceB_Impact}
                    onChange={(e) => setChoiceB_Impact(e.target.value)}
                    placeholder="Narrative impact (e.g., Victor destroys records, vault locks shut)"
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-[10px] p-2 text-white rounded font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Truth Delta</span>
                    <input type="number" value={choiceB_Truth} onChange={(e)=>setChoiceB_Truth(parseInt(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Resp Delta</span>
                    <input type="number" value={choiceB_Responsibility} onChange={(e)=>setChoiceB_Responsibility(parseInt(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Denial Delta</span>
                    <input type="number" value={choiceB_Denial} onChange={(e)=>setChoiceB_Denial(parseInt(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end border-t border-terminal-metal pt-3">
              <button
                type="button"
                onClick={() => { resetForm(); setView('tests'); }}
                className="px-4 py-2 border border-terminal-metal bg-transparent hover:bg-terminal-metal text-c4cdc4 font-bold font-mono rounded cursor-pointer transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-terminal-green bg-terminal-green text-black hover:bg-transparent hover:text-terminal-green font-bold font-mono rounded cursor-pointer transition-colors"
              >
                SAVE TEST LAYER
              </button>
            </div>
          </form>
        </CRTPanel>
      ) : (
        /* Tests list view */
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-terminal-metal/20 p-4 border border-terminal-metal rounded-md">
            <span className="text-xs text-c4cdc4/60">Configure symbolic tests. You must associate a test to a campaign before running it.</span>
            <button
              onClick={() => setView('test-new')}
              className="flex items-center gap-1.5 bg-terminal-green border border-terminal-green hover:bg-transparent text-black hover:text-terminal-green px-3 py-1.5 text-xs font-bold font-mono rounded cursor-pointer transition-all"
            >
              <Plus size={14} />
              NEW TEST DESIGN
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => {
              const matchingCamp = campaigns.find(c => c.id === test.campaignId);
              const matchingChar = characters.find(c => c.id === test.characterId);
              const isCanon = matchingChar?.canonStatus === 'canon';
              
              return (
                <div
                  key={test.id}
                  className="bg-terminal-metal border border-terminal-metal-light p-5 rounded flex flex-col justify-between hover:border-terminal-green/20 transition-all gap-4"
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-start border-b border-terminal-metal-light pb-2">
                      <div>
                        <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                          {test.title}
                        </h4>
                        <span className="text-[7.5px] text-terminal-green-dim font-bold uppercase tracking-widest mt-0.5 block">
                          Campaign: {matchingCamp?.title || 'Unassigned Campaign'}
                        </span>
                      </div>
                      <span className="text-[7px] text-c4cdc4/50 border border-terminal-metal-light px-1.5 py-0.5 rounded font-bold uppercase">
                        {test.puzzleType}
                      </span>
                    </div>

                    <div className="text-xs flex flex-col gap-2">
                      <div>
                        <span className="text-[8px] font-bold text-c4cdc4/50 uppercase">Subject Bound:</span>
                        <p className="text-white font-bold">{matchingChar?.name || 'Unassigned Subject'}</p>
                      </div>

                      <div>
                        <span className="text-[8px] font-bold text-c4cdc4/50 uppercase">Cassette Transcript snippet:</span>
                        <p className="text-c4cdc4/80 line-clamp-3 italic">"{test.openingTape}"</p>
                      </div>

                      <div className="flex justify-between text-[9px] text-c4cdc4/40 mt-1">
                        <span>Timer: {test.timerSeconds}s</span>
                        <span>Clues stored: {test.clues.length}</span>
                      </div>
                    </div>
                  </div>

                  {!isCanon && (
                    <div className="flex gap-2 pt-3 border-t border-terminal-metal/30">
                      <button
                        onClick={() => handleEditClick(test)}
                        className="flex-1 flex items-center justify-center gap-1 bg-terminal-bg border border-terminal-metal hover:border-terminal-green text-c4cdc4 hover:text-terminal-green py-1 text-[10px] font-bold font-mono rounded cursor-pointer transition-colors"
                      >
                        <Edit size={10} />
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-terminal-bg border border-terminal-metal hover:border-terminal-red text-c4cdc4 hover:text-terminal-red py-1 text-[10px] font-bold font-mono rounded cursor-pointer transition-colors"
                      >
                        <Trash2 size={10} />
                        DELETE
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
