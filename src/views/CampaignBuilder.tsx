import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Campaign } from '../types';
import { CRTPanel } from '../components/common/CRTPanel';
import { Plus, Trash2, Edit, Play } from 'lucide-react';

export const CampaignBuilder: React.FC = () => {
  const {
    campaigns,
    characters,
    tests,
    currentView,
    setView,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    startSimulation
  } = useApp();

  const [title, setTitle] = useState('');
  const [timelinePeriod, setTimelinePeriod] = useState('saw-x-interquel');
  const [tone, setTone] = useState('');
  const [moralTheme, setMoralTheme] = useState('Truth vs. Reputation');
  const [fictionalLocation, setFictionalLocation] = useState('');
  const [objective, setObjective] = useState('');
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const themes = [
    'Truth vs. Reputation',
    'Social Image vs. Responsibility',
    'Exploitation vs. Empathy',
    'Gratitude vs. Neglect',
    'Deceit vs. Integrity',
    'Vengeance vs. Forgiveness',
    'Hypocrisy vs. Authenticity',
    'Sacrifice vs. Selfishness'
  ];

  const periods = [
    { value: 'pre-saw-i', label: 'Avant Saw I' },
    { value: 'saw-i', label: 'Saw I' },
    { value: 'saw-x-interquel', label: 'Saw X Interquel' },
    { value: 'saw-i-ii-interval', label: 'Intervalle Saw I-II' },
    { value: 'saw-ii', label: 'Saw II' },
    { value: 'saw-iii-iv', label: 'Saw III / IV' },
    { value: 'posthumous', label: 'Héritage Posthume' },
    { value: 'fan-campaigns', label: 'Non-canon / Fan Campaign' }
  ];

  const handleEditClick = (camp: Campaign) => {
    setIsEditing(true);
    setEditId(camp.id);
    setTitle(camp.title);
    setTimelinePeriod(camp.timelinePeriod);
    setTone(camp.tone);
    setMoralTheme(camp.moralTheme);
    setFictionalLocation(camp.fictionalLocation);
    setObjective(camp.objective);
    setSelectedChars(camp.characterIds);
    setView('campaign-new'); // Show form view
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !objective || !fictionalLocation) return;

    const campaignPayload = {
      title,
      timelinePeriod,
      tone,
      moralTheme,
      fictionalLocation,
      objective,
      status: 'draft' as const,
      characterIds: selectedChars,
      testIds: isEditing && editId ? campaigns.find(c => c.id === editId)?.testIds || [] : []
    };

    if (isEditing && editId) {
      updateCampaign(editId, campaignPayload);
    } else {
      addCampaign(campaignPayload);
    }

    // Reset Form
    setTitle('');
    setTone('');
    setFictionalLocation('');
    setObjective('');
    setSelectedChars([]);
    setIsEditing(false);
    setEditId(null);
    setView('campaigns'); // Return to campaigns list
  };

  const handleCancel = () => {
    setTitle('');
    setTone('');
    setFictionalLocation('');
    setObjective('');
    setSelectedChars([]);
    setIsEditing(false);
    setEditId(null);
    setView('campaigns');
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this campaign profile? Associated logs remain archived, but the campaign configuration will be deleted.")) {
      deleteCampaign(id);
    }
  };

  const isFormView = currentView === 'campaign-new';

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-terminal-metal/40 pb-4">
        <h2 className="text-xl font-extrabold tracking-widest text-white uppercase flex items-center gap-2">
          <span>// GAME ARCHITECT</span>
          <span className="text-xs text-terminal-green font-normal tracking-wide lowercase">
            — narrative campaign designer
          </span>
        </h2>
        <p className="text-xs text-c4cdc4/60">
          Design structural moral conflicts, establish locations, assign fictional subjects, and prepare tests.
        </p>
      </div>

      {isFormView ? (
        /* Campaign Editor Form Panel */
        <CRTPanel className="max-w-2xl mx-auto w-full p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green border-b border-terminal-green/20 pb-2 mb-4">
            {isEditing ? 'MODIFY CASE SCHEMATIC' : 'CREATE NEW NARRATIVE SCHEMATIC'}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Quiet Scale"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Moral Conflict Theme</label>
                <select
                  value={moralTheme}
                  onChange={(e) => setMoralTheme(e.target.value)}
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                >
                  {themes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Timeline Era</label>
                <select
                  value={timelinePeriod}
                  onChange={(e) => setTimelinePeriod(e.target.value)}
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                >
                  {periods.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Atmospheric Tone</label>
                <input
                  type="text"
                  required
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g. Rusted, heavy, industrial, silent"
                  className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Fictional Location Setting</label>
              <input
                type="text"
                required
                value={fictionalLocation}
                onChange={(e) => setFictionalLocation(e.target.value)}
                placeholder="e.g. Abandoned weighing station at Pier 14, industrial scales"
                className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Primary Moral Objective</label>
              <textarea
                rows={3}
                required
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Detail what the participant has done, and what truth they must narratively acknowledge to balance the scale."
                className="bg-black border border-terminal-metal focus:outline-none focus:border-terminal-green text-xs p-2 text-white rounded font-mono resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-c4cdc4/60">Assign Fictional Subject Profiles</label>
              <div className="border border-terminal-metal bg-black p-3 rounded flex flex-col gap-2 max-h-36 overflow-y-auto">
                {characters.length === 0 ? (
                  <span className="text-[10px] text-c4cdc4/40">No subject dossiers available. Create one in Dossiers first.</span>
                ) : (
                  characters.map((char) => (
                    <label key={char.id} className="flex items-center gap-2 cursor-pointer text-[10px] text-c4cdc4 hover:text-white">
                      <input
                        type="checkbox"
                        checked={selectedChars.includes(char.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedChars([...selectedChars, char.id]);
                          } else {
                            setSelectedChars(selectedChars.filter(id => id !== char.id));
                          }
                        }}
                        className="accent-terminal-green"
                      />
                      <span className="font-bold">{char.name}</span>
                      <span className="text-c4cdc4/40">({char.archetype})</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-terminal-metal pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-terminal-metal bg-transparent hover:bg-terminal-metal text-c4cdc4 font-bold font-mono rounded cursor-pointer transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-terminal-green bg-terminal-green text-black hover:bg-transparent hover:text-terminal-green font-bold font-mono rounded cursor-pointer transition-colors"
              >
                {isEditing ? 'APPLY CHANGES' : 'INITIALIZE CAMPAIGN'}
              </button>
            </div>
          </form>
        </CRTPanel>
      ) : (
        /* Campaigns List Panel */
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-terminal-metal/20 p-4 border border-terminal-metal rounded-md">
            <span className="text-xs text-c4cdc4/60">Select, review, or write campaigns. Ensure a test is bound before starting.</span>
            <button
              onClick={() => setView('campaign-new')}
              className="flex items-center gap-1 bg-terminal-green border border-terminal-green hover:bg-transparent text-black hover:text-terminal-green px-3 py-1.5 text-xs font-bold font-mono rounded cursor-pointer transition-all"
            >
              <Plus size={14} />
              NEW CAMPAIGN
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => {
              const campTests = tests.filter(t => t.campaignId === camp.id);
              const isReady = campTests.length > 0;
              const hasSimulated = camp.status === 'simulated';

              return (
                <div
                  key={camp.id}
                  className="bg-terminal-metal border border-terminal-metal-light p-5 rounded flex flex-col justify-between hover:border-terminal-green/30 transition-all gap-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start border-b border-terminal-metal-light pb-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                          {camp.title}
                        </h4>
                        <span className="text-[7px] text-terminal-green-dim font-bold uppercase tracking-widest block mt-0.5">
                          Theme: {camp.moralTheme}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[7px] border px-1.5 py-0.5 rounded font-bold uppercase ${
                          isReady 
                            ? 'border-terminal-green/30 text-terminal-green bg-terminal-green/5' 
                            : 'border-yellow-600/30 text-yellow-500 bg-yellow-500/5'
                        }`}>
                          {isReady ? 'Ready' : 'No Test'}
                        </span>
                        
                        {hasSimulated && (
                          <span className="text-[6px] text-white/50 bg-black border border-white/10 px-1 py-0.2 rounded font-bold uppercase">
                            Simulated
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-xs">
                      <p className="text-c4cdc4/80 leading-relaxed line-clamp-3">
                        {camp.objective}
                      </p>
                      
                      <div className="text-[9px] text-c4cdc4/55">
                        <strong className="text-white">Location: </strong>{camp.fictionalLocation}
                      </div>

                      <div className="text-[9px] text-c4cdc4/55">
                        <strong className="text-white">Subject Profiles: </strong>
                        {camp.characterIds.length === 0 ? (
                          <span className="text-terminal-red">No subjects assigned</span>
                        ) : (
                          camp.characterIds.map((charId, idx) => {
                            const char = characters.find(c => c.id === charId);
                            return char ? (
                              <span key={charId}>
                                {char.name}{idx < camp.characterIds.length - 1 ? ', ' : ''}
                              </span>
                            ) : null;
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-terminal-metal/30">
                    {isReady && (
                      <button
                        onClick={() => startSimulation(camp.id)}
                        className="w-full flex items-center justify-center gap-1.5 bg-terminal-green border border-terminal-green hover:bg-transparent text-black hover:text-terminal-green py-1.5 text-xs font-bold font-mono rounded cursor-pointer transition-colors"
                      >
                        <Play size={12} fill="currentColor" />
                        SIMULATE CASE
                      </button>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(camp)}
                        className="flex-1 flex items-center justify-center gap-1 bg-terminal-bg border border-terminal-metal hover:border-terminal-green text-c4cdc4 hover:text-terminal-green py-1 text-[10px] font-bold font-mono rounded cursor-pointer transition-colors"
                      >
                        <Edit size={10} />
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDelete(camp.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-terminal-bg border border-terminal-metal hover:border-terminal-red text-c4cdc4 hover:text-terminal-red py-1 text-[10px] font-bold font-mono rounded cursor-pointer transition-colors"
                      >
                        <Trash2 size={10} />
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
