import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SymbolicTest, ChoiceBranch } from '../types';
import { CRTPanel } from '../components/common/CRTPanel';
import { Plus, Trash2, Edit } from 'lucide-react';
import { getPuzzleControl, isPuzzleAnswerCorrect } from '../services/simulationRules';

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
  const [puzzleData, setPuzzleData] = useState<SymbolicTest['puzzleData']>({});
  const [formError, setFormError] = useState('');
  
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
    setPuzzleData(test.puzzleData);
    setFormError('');
    setCluesStr(test.clues.join('\n'));
    setTimerSeconds(test.timerSeconds);

    // Load branch choices
    const branchA = test.choices[0];
    setChoiceA_Text(branchA?.text ?? '');
    setChoiceA_Impact(branchA?.narrativeImpact ?? '');
    setChoiceA_Truth(branchA?.scoresEffect.truth ?? 0);
    setChoiceA_Responsibility(branchA?.scoresEffect.responsibility ?? 0);
    setChoiceA_Denial(branchA?.scoresEffect.denial ?? 0);
    const branchB = test.choices[1];
    setChoiceB_Text(branchB?.text ?? '');
    setChoiceB_Impact(branchB?.narrativeImpact ?? '');
    setChoiceB_Truth(branchB?.scoresEffect.truth ?? 0);
    setChoiceB_Responsibility(branchB?.scoresEffect.responsibility ?? 0);
    setChoiceB_Denial(branchB?.scoresEffect.denial ?? 0);

    setView('test-new');
  };

  const resetForm = () => {
    setCampaignId('');
    setCharacterId('');
    setTitle('');
    setOpeningTape('');
    setRules('');
    setPuzzleType('logic');
    setPuzzleData({});
    setFormError('');
    setMoralTheme('Truth vs. Reputation');
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
    const original = isEditing ? tests.find(test => test.id === editId) : undefined;
    if (!campaignId || !characterId || !title.trim() || !openingTape.trim() || !rules.trim() || !choiceA_Text.trim() || (!original && !choiceB_Text.trim())) {
      setFormError('Complétez la campagne, le participant, les consignes et les choix.');
      return;
    }
    if (!Number.isInteger(timerSeconds) || timerSeconds < 30 || timerSeconds > 600 ||
      ![choiceA_Truth, choiceA_Responsibility, choiceA_Denial, choiceB_Truth, choiceB_Responsibility, choiceB_Denial].every(Number.isFinite)) {
      setFormError('Choisissez une durée entière de 30 à 600 secondes et des effets numériques valides.');
      return;
    }
    const definition = { puzzleType, puzzleData, rules };
    const explicit = puzzleData.correctAnswer?.trim();
    if (puzzleType === 'confession') {
      const options = puzzleData.confessionOptions ?? [];
      if (!options.length || options.some(option => !option.id.trim() || !option.text.trim() || !Number.isFinite(option.truthScore)) ||
        new Set(options.map(option => option.id.trim().toLowerCase())).size !== options.length ||
        options.filter(option => isPuzzleAnswerCorrect(definition, option.id)).length !== 1) {
        setFormError('La confession doit proposer des options distinctes et une seule réponse valide : son identifiant explicite ou un score de vérité maximal unique.');
        return;
      }
    } else if (puzzleType !== 'choice' && !explicit && getPuzzleControl(definition).kind !== 'scale') {
      setFormError('Indiquez une réponse exacte pour rendre cette énigme jouable.');
      return;
    }

    const clues = original && cluesStr === original.clues.join('\n') ? original.clues : cluesStr.split('\n').filter(line => line.trim() !== '');
    const originalA = original?.choices[0], originalB = original?.choices[1];
    const effects = (existing: ChoiceBranch | undefined, truth: number, responsibility: number, denial: number) => {
      const result = { ...(existing?.scoresEffect ?? {}) };
      for (const [key, value] of [['truth', truth], ['responsibility', responsibility], ['denial', denial]] as const) {
        if (!existing || value !== (existing.scoresEffect[key] ?? 0)) result[key] = value;
      }
      return result;
    };
    const branchA: ChoiceBranch = {
      ...originalA,
      id: originalA?.id ?? 'choice-a-' + Math.random().toString(36).substr(2, 5),
      text: choiceA_Text,
      narrativeImpact: choiceA_Impact,
      scoresEffect: { ...effects(originalA, choiceA_Truth, choiceA_Responsibility, choiceA_Denial),
        ...(!originalA ? { courage: Math.max(0, choiceA_Truth) } : {}) },
    };

    const branchB: ChoiceBranch = {
      ...originalB,
      id: originalB?.id ?? 'choice-b-' + Math.random().toString(36).substr(2, 5),
      text: choiceB_Text,
      narrativeImpact: choiceB_Impact,
      scoresEffect: { ...effects(originalB, choiceB_Truth, choiceB_Responsibility, choiceB_Denial),
        ...(!originalB ? { acceptance: choiceB_Denial > 0 ? -10 : 10 } : {}) },
    };

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
      choices: [branchA, ...(choiceB_Text.trim() ? [branchB] : []), ...(original?.choices.slice(2) ?? [])],
      safetyNote: original?.safetyNote ?? 'Fictional script. Consequence calculations are software narratives.'
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
  const editingTest = isEditing ? tests.find(test => test.id === editId) : undefined;

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
            {formError && <p role="alert" className="border border-terminal-red p-3 rounded text-terminal-red">{formError}</p>}
            
            {/* Top row: Campaign and Character selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="designer-campaign" className="text-[9px] font-bold uppercase text-c4cdc4/60">Select Campaign</label>
                <select id="designer-campaign"
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
                <label htmlFor="designer-subject" className="text-[9px] font-bold uppercase text-c4cdc4/60">Assign Subject Character</label>
                <select id="designer-subject"
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
                <label htmlFor="designer-title" className="text-[9px] font-bold uppercase text-c4cdc4/60">Test Title</label>
                <input id="designer-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Balance of Ledger"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="designer-type" className="text-[9px] font-bold uppercase text-c4cdc4/60">Puzzle Type</label>
                <select id="designer-type"
                  value={puzzleType}
                  onChange={(e) => {
                    const nextType = e.target.value as SymbolicTest['puzzleType'];
                    setPuzzleType(nextType);
                    if (nextType === 'confession' && !puzzleData.confessionOptions?.length) {
                      setPuzzleData({ ...puzzleData, confessionOptions: [
                        { id: 'option-a', text: '', truthScore: 0 },
                        { id: 'option-b', text: '', truthScore: 0 },
                      ] });
                    }
                  }}
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                >
                  <option value="logic">Logical Puzzle</option>
                  <option value="confession">Moral Confession</option>
                  <option value="sacrifice">Symbolic Sacrifice</option>
                  <option value="choice">Branching Path</option>
                  <option value="maze">Gear Alignment / Maze</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="designer-timer" className="text-[9px] font-bold uppercase text-c4cdc4/60">Timer Duration (Seconds)</label>
                <input id="designer-timer"
                  type="number"
                  required
                  min={30}
                  max={600}
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Number(e.target.value))}
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>
            </div>

            <fieldset className="border border-terminal-metal-light p-3 rounded flex flex-col gap-3 min-w-0">
              <legend className="text-xs text-terminal-green px-2">Configuration de l’énigme</legend>
              <label htmlFor="designer-question">Question présentée au joueur</label>
              <input id="designer-question" value={puzzleData.question ?? ''}
                onChange={event => setPuzzleData({ ...puzzleData, question: event.target.value })}
                className="w-full min-w-0 bg-black border border-terminal-metal p-2 rounded text-white" />
              <label htmlFor="designer-answer">Réponse exacte{puzzleType === 'choice' ? ' (facultative pour un choix direct)' : ''}</label>
              <input id="designer-answer" value={puzzleData.correctAnswer ?? ''}
                onChange={event => {
                  const next = { ...puzzleData };
                  if (event.target.value) next.correctAnswer = event.target.value;
                  else delete next.correctAnswer;
                  setPuzzleData(next);
                }}
                aria-describedby="designer-answer-help"
                className="w-full min-w-0 bg-black border border-terminal-metal p-2 rounded text-white" />
              <p id="designer-answer-help" className="text-[10px] text-c4cdc4/60">
                {puzzleType === 'confession'
                  ? 'Utilisez l’identifiant d’une option, ou laissez vide si un score de vérité désigne une seule meilleure option.'
                  : puzzleType === 'sacrifice'
                    ? 'Valeur ou code exact. Une règle de seuil historique reconnue reste valable sans réponse explicite.'
                    : puzzleType === 'maze'
                      ? 'Somme cible des engrenages ou code à saisir. Les cibles hors des engrenages disponibles utilisent une saisie libre.'
                      : 'Texte, code, coordonnée ou date au format AAAA-MM-JJ. Le Théâtre propose un contrôle adapté.'}
              </p>
              {(puzzleType === 'logic' || puzzleType === 'choice') && <>
                <label htmlFor="designer-items">Réponses proposées (une par ligne, facultatif)</label>
                <textarea id="designer-items" rows={3} value={puzzleData.items?.join('\n') ?? ''}
                  onChange={event => setPuzzleData({ ...puzzleData, items: event.target.value.split('\n').filter(item => item.trim()) })}
                  className="w-full min-w-0 bg-black border border-terminal-metal p-2 rounded text-white" />
              </>}
              {puzzleType === 'confession' && <div className="flex flex-col gap-3">
                {(puzzleData.confessionOptions ?? []).map((option, index) => <fieldset key={index} className="border border-terminal-metal p-2 rounded grid gap-2 min-w-0">
                  <legend className="text-[10px] px-1">Option {index + 1}</legend>
                  <label>Identifiant de l’option {index + 1}<input value={option.id} required
                    onChange={event => setPuzzleData({ ...puzzleData, confessionOptions: puzzleData.confessionOptions!.map((item, position) => position === index ? { ...item, id: event.target.value } : item) })}
                    className="block w-full min-w-0 bg-black border border-terminal-metal p-2 rounded text-white" /></label>
                  <label>Texte de l’option {index + 1}<input value={option.text} required
                    onChange={event => setPuzzleData({ ...puzzleData, confessionOptions: puzzleData.confessionOptions!.map((item, position) => position === index ? { ...item, text: event.target.value } : item) })}
                    className="block w-full min-w-0 bg-black border border-terminal-metal p-2 rounded text-white" /></label>
                  <label>Score de vérité de l’option {index + 1}<input type="number" value={option.truthScore} required
                    onChange={event => setPuzzleData({ ...puzzleData, confessionOptions: puzzleData.confessionOptions!.map((item, position) => position === index ? { ...item, truthScore: Number(event.target.value) } : item) })}
                    className="block w-full min-w-0 bg-black border border-terminal-metal p-2 rounded text-white" /></label>
                  <button type="button" onClick={() => setPuzzleData({ ...puzzleData, confessionOptions: puzzleData.confessionOptions!.filter((_, position) => position !== index) })}
                    className="text-left text-terminal-red text-[10px]">Supprimer cette option</button>
                </fieldset>)}
                <button type="button" onClick={() => setPuzzleData({ ...puzzleData, confessionOptions: [...(puzzleData.confessionOptions ?? []), { id: '', text: '', truthScore: 0 }] })}
                  className="border border-terminal-metal p-2 rounded text-left">Ajouter une option</button>
              </div>}
            </fieldset>

            {/* Tape message and Rules */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <label htmlFor="designer-tape" className="text-[9px] font-bold uppercase text-c4cdc4/60">Fictional Cassette Tape Message</label>
                <span className="text-[8px] text-terminal-green-dim italic">Use cold, philosophical, and ceremonial phrasing.</span>
              </div>
              <textarea id="designer-tape"
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
                <label htmlFor="designer-rules" className="text-[9px] font-bold uppercase text-c4cdc4/60">Rules Statement</label>
                <input id="designer-rules"
                  type="text"
                  required
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="e.g. Choose whether to click mirror B or shatter the console."
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="designer-clues" className="text-[9px] font-bold uppercase text-c4cdc4/60">Clues Database (One per line)</label>
                <textarea id="designer-clues"
                  rows={3}
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
                    aria-label="Choice A text" value={choiceA_Text}
                    onChange={(e) => setChoiceA_Text(e.target.value)}
                    placeholder="e.g. Confess to falsifying the records"
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-[10px] p-2 text-white rounded font-mono"
                  />
                  <input
                    type="text"
                    aria-label="Choice A consequence" value={choiceA_Impact}
                    onChange={(e) => setChoiceA_Impact(e.target.value)}
                    placeholder="Narrative impact (e.g., Victor submits File B, auditors are notified)"
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-[10px] p-2 text-white rounded font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Truth Delta</span>
                    <input type="number" aria-label="Choice A truth delta" value={choiceA_Truth} onChange={(e)=>setChoiceA_Truth(Number(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Resp Delta</span>
                    <input type="number" aria-label="Choice A responsibility delta" value={choiceA_Responsibility} onChange={(e)=>setChoiceA_Responsibility(Number(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Denial Delta</span>
                    <input type="number" aria-label="Choice A denial delta" value={choiceA_Denial} onChange={(e)=>setChoiceA_Denial(Number(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                </div>
              </div>

              {/* Branch B (Negative/Denial Choice) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-terminal-red uppercase">Option B: The Path of Denial</span>
                  <input
                    type="text"
                    required={!editingTest || editingTest.choices.length > 1}
                    aria-label="Choice B text" value={choiceB_Text}
                    onChange={(e) => setChoiceB_Text(e.target.value)}
                    placeholder="e.g. Suppress the logs to save reputation"
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-[10px] p-2 text-white rounded font-mono"
                  />
                  <input
                    type="text"
                    aria-label="Choice B consequence" value={choiceB_Impact}
                    onChange={(e) => setChoiceB_Impact(e.target.value)}
                    placeholder="Narrative impact (e.g., Victor destroys records, vault locks shut)"
                    className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-[10px] p-2 text-white rounded font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Truth Delta</span>
                    <input type="number" aria-label="Choice B truth delta" value={choiceB_Truth} onChange={(e)=>setChoiceB_Truth(Number(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Resp Delta</span>
                    <input type="number" aria-label="Choice B responsibility delta" value={choiceB_Responsibility} onChange={(e)=>setChoiceB_Responsibility(Number(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-c4cdc4/50">Denial Delta</span>
                    <input type="number" aria-label="Choice B denial delta" value={choiceB_Denial} onChange={(e)=>setChoiceB_Denial(Number(e.target.value))} className="bg-black border border-terminal-metal text-[10px] p-1 text-white text-center font-mono" />
                  </div>
                </div>
              </div>
              {editingTest && editingTest.choices.length > 2 && <p className="text-[10px] text-c4cdc4/60">Les {editingTest.choices.length - 2} autres choix existants sont conservés avec leurs conséquences.</p>}

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
              onClick={() => { resetForm(); setView('test-new'); }}
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
