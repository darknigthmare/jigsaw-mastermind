import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { CharacterProfile } from '../types';
import { CRTPanel } from '../components/common/CRTPanel';
import { Trash2, Edit, UserPlus } from 'lucide-react';

export const Dossiers: React.FC = () => {
  const {
    characters,
    currentView,
    setView,
    addCharacter,
    updateCharacter,
    deleteCharacter
  } = useApp();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [archetype, setArchetype] = useState('');
  const [timelinePeriod, setTimelinePeriod] = useState('fan-campaigns');
  const [moralFlaw, setMoralFlaw] = useState('');
  const [symbolicFear, setSymbolicFear] = useState('');
  const [redemptionGoal, setRedemptionGoal] = useState('');
  const [denialPattern, setDenialPattern] = useState('');
  const [relationships, setRelationships] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleEditClick = (char: CharacterProfile) => {
    if (char.canonStatus === 'canon') {
      alert("Canonical profiles are write-protected in system storage. Please construct a custom profile.");
      return;
    }
    setIsEditing(true);
    setEditId(char.id);
    setName(char.name);
    setRole(char.role);
    setArchetype(char.archetype);
    setTimelinePeriod(char.timelinePeriod);
    setMoralFlaw(char.moralFlaw);
    setSymbolicFear(char.symbolicFear);
    setRedemptionGoal(char.redemptionGoal);
    setDenialPattern(char.denialPattern);
    setRelationships(char.relationships);
    setNotes(char.notes);
    setView('character-new');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !moralFlaw || !symbolicFear) return;

    const payload = {
      name,
      role,
      archetype,
      timelinePeriod,
      moralFlaw,
      symbolicFear,
      redemptionGoal,
      denialPattern,
      relationships,
      notes,
      canonStatus: 'custom' as const
    };

    if (isEditing && editId) {
      updateCharacter(editId, payload);
    } else {
      addCharacter(payload);
    }

    // Reset
    resetForm();
    setView('characters');
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setArchetype('');
    setMoralFlaw('');
    setSymbolicFear('');
    setRedemptionGoal('');
    setDenialPattern('');
    setRelationships('');
    setNotes('');
    setIsEditing(false);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    const target = characters.find(c => c.id === id);
    if (!target) return;
    if (target.canonStatus === 'canon') {
      alert("Canonical files are read-only.");
      return;
    }
    if (confirm("Delete this subject dossier? This will remove them from all campaigns.")) {
      deleteCharacter(id);
    }
  };

  const isFormView = currentView === 'character-new';

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-terminal-metal/40 pb-4">
        <h2 className="text-xl font-extrabold tracking-widest text-white uppercase flex items-center gap-2">
          <span>// DOSSIERS SUJETS</span>
          <span className="text-xs text-terminal-green font-normal tracking-wide lowercase">
            — participant character dossiers
          </span>
        </h2>
        <p className="text-xs text-c4cdc4/60">
          Archived and editable subject files. Define flaws, core conflicts, and denial patterns for escape-room simulations.
        </p>
      </div>

      {isFormView ? (
        /* Create Character Form Panel */
        <CRTPanel className="max-w-2xl mx-auto w-full p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green border-b border-terminal-green/20 pb-2 mb-4">
            {isEditing ? 'UPDATE SUBJECT PROFILE' : 'ARCHIVE NEW SUBJECT DOSSIER'}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Subject Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Victor Hale"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Subject Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Corporate Archivist"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Subject Archetype</label>
                <input
                  type="text"
                  required
                  value={archetype}
                  onChange={(e) => setArchetype(e.target.value)}
                  placeholder="e.g. The Shielded Bureaucrat"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Historical Era Group</label>
                <select
                  value={timelinePeriod}
                  onChange={(e) => setTimelinePeriod(e.target.value)}
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                >
                  <option value="saw-x-interquel">Saw X Period</option>
                  <option value="fan-campaigns">Fanon / Custom Campaign Era</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Deficiency / Moral Flaw</label>
                <textarea
                  rows={2}
                  required
                  value={moralFlaw}
                  onChange={(e) => setMoralFlaw(e.target.value)}
                  placeholder="What is their primary moral failure? (e.g., shifts blame to secure job status)"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Symbolic Fear</label>
                <textarea
                  rows={2}
                  required
                  value={symbolicFear}
                  onChange={(e) => setSymbolicFear(e.target.value)}
                  placeholder="What is their greatest fear? (e.g., exposure of errors, financial loss)"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Redemption Goal</label>
                <input
                  type="text"
                  required
                  value={redemptionGoal}
                  onChange={(e) => setRedemptionGoal(e.target.value)}
                  placeholder="e.g. Confess override signature and reimburse team"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Denial Pattern / Excuse</label>
                <input
                  type="text"
                  required
                  value={denialPattern}
                  onChange={(e) => setDenialPattern(e.target.value)}
                  placeholder="What lie do they tell themselves? (e.g., 'it was for the project survival')"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Interpersonal Relationships</label>
              <input
                type="text"
                value={relationships}
                onChange={(e) => setRelationships(e.target.value)}
                placeholder="e.g. Evelyn Carter (dismissed coworker, estranged)"
                className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Scriptor Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about their response, vulnerability, or history."
                className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
              />
            </div>

            <div className="flex gap-3 justify-end border-t border-terminal-metal pt-3">
              <button
                type="button"
                onClick={() => { resetForm(); setView('characters'); }}
                className="px-4 py-2 border border-terminal-metal bg-transparent hover:bg-terminal-metal text-c4cdc4 font-bold font-mono rounded cursor-pointer transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-terminal-green bg-terminal-green text-black hover:bg-transparent hover:text-terminal-green font-bold font-mono rounded cursor-pointer transition-colors"
              >
                {isEditing ? 'COMMIT EDITS' : 'SAVE DOSSIER'}
              </button>
            </div>
          </form>
        </CRTPanel>
      ) : (
        /* Characters List Panel */
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-terminal-metal/20 p-4 border border-terminal-metal rounded-md">
            <span className="text-xs text-c4cdc4/60">
              Browse profiles. Canon records are locked; custom files can be customized and modified.
            </span>
            <button
              onClick={() => setView('character-new')}
              className="flex items-center gap-1.5 bg-terminal-green border border-terminal-green hover:bg-transparent text-black hover:text-terminal-green px-3 py-1.5 text-xs font-bold font-mono rounded cursor-pointer transition-all"
            >
              <UserPlus size={14} />
              NEW DOSSIER
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => {
              const isCanon = char.canonStatus === 'canon';
              return (
                <div
                  key={char.id}
                  className="bg-terminal-metal border border-terminal-metal-light p-5 rounded flex flex-col justify-between hover:border-terminal-green/20 transition-all gap-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start border-b border-terminal-metal-light pb-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                          {char.name}
                        </h4>
                        <span className="text-[7.5px] text-terminal-green-dim font-bold uppercase tracking-widest mt-0.5 block">
                          {char.role}
                        </span>
                      </div>
                      <span className={`text-[7px] border px-1.5 py-0.5 rounded font-bold uppercase ${
                        isCanon 
                          ? 'border-terminal-green/30 text-terminal-green bg-terminal-green/5' 
                          : 'border-terminal-red/30 text-terminal-red bg-terminal-red/5'
                      }`}>
                        {char.canonStatus}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-xs">
                      <div>
                        <span className="text-[8px] font-bold text-c4cdc4/50 uppercase">Deficiency:</span>
                        <p className="text-c4cdc4/80 mt-0.5">{char.moralFlaw}</p>
                      </div>

                      <div>
                        <span className="text-[8px] font-bold text-c4cdc4/50 uppercase">Fear Element:</span>
                        <p className="text-c4cdc4/80 mt-0.5">{char.symbolicFear}</p>
                      </div>

                      <div>
                        <span className="text-[8px] font-bold text-c4cdc4/50 uppercase">Escapist Excuse:</span>
                        <p className="text-c4cdc4/75 italic mt-0.5">"{char.denialPattern}"</p>
                      </div>
                    </div>
                  </div>

                  {!isCanon && (
                    <div className="flex gap-2 pt-3 border-t border-terminal-metal/30">
                      <button
                        onClick={() => handleEditClick(char)}
                        className="flex-1 flex items-center justify-center gap-1 bg-terminal-bg border border-terminal-metal hover:border-terminal-green text-c4cdc4 hover:text-terminal-green py-1 text-[10px] font-bold font-mono rounded cursor-pointer transition-colors"
                      >
                        <Edit size={10} />
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDelete(char.id)}
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
