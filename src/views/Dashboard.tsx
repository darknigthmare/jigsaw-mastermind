import React from 'react';
import { useApp } from '../context/AppContext';
import { CRTPanel } from '../components/common/CRTPanel';
import { Play, Clipboard, Compass, FolderOpen, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { campaigns, characters, runs, setView, startSimulation } = useApp();

  const activeCampaigns = campaigns.filter(c => c.status === 'ready');
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');
  const recentRuns = runs.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-terminal-metal/40 pb-4">
        <h2 className="text-xl font-extrabold tracking-widest text-white uppercase flex items-center gap-2">
          <span>// CONTROL ROOM</span>
          <span className="text-xs text-terminal-green font-normal tracking-wide lowercase">
            — dashboard simulation console
          </span>
        </h2>
        <p className="text-xs text-c4cdc4/60">
          Manage local fictional campaigns, view dossiers, and launch psychological escape-room tests.
        </p>
      </div>

      {/* Grid: Quick Actions and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Console Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CRTPanel className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green mb-4 border-b border-terminal-green/20 pb-2">
              Console Launchpads
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setView('campaign-new')}
                className="flex flex-col items-center justify-center p-4 bg-terminal-metal hover:bg-terminal-green/5 border border-terminal-metal-light hover:border-terminal-green rounded transition-all group text-center gap-2 cursor-pointer"
              >
                <FolderOpen size={24} className="text-c4cdc4/75 group-hover:text-terminal-green transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Nouvelle Campagne
                </span>
                <span className="text-[9px] text-c4cdc4/40">
                  Write a new scenario
                </span>
              </button>

              <button
                onClick={() => setView('characters')}
                className="flex flex-col items-center justify-center p-4 bg-terminal-metal hover:bg-terminal-green/5 border border-terminal-metal-light hover:border-terminal-green rounded transition-all group text-center gap-2 cursor-pointer"
              >
                <Clipboard size={24} className="text-c4cdc4/75 group-hover:text-terminal-green transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Dossiers Sujets
                </span>
                <span className="text-[9px] text-c4cdc4/40">
                  Inspect fictional subjects
                </span>
              </button>

              <button
                onClick={() => setView('timeline')}
                className="flex flex-col items-center justify-center p-4 bg-terminal-metal hover:bg-terminal-green/5 border border-terminal-metal-light hover:border-terminal-green rounded transition-all group text-center gap-2 cursor-pointer"
              >
                <Compass size={24} className="text-c4cdc4/75 group-hover:text-terminal-green transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Archives Timeline
                </span>
                <span className="text-[9px] text-c4cdc4/40">
                  Explore continuity logs
                </span>
              </button>

              <button
                onClick={() => setView('writer-room')}
                className="flex flex-col items-center justify-center p-4 bg-terminal-metal hover:bg-terminal-green/5 border border-terminal-metal-light hover:border-terminal-green rounded transition-all group text-center gap-2 cursor-pointer"
              >
                <Calendar size={24} className="text-c4cdc4/75 group-hover:text-terminal-green transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Writer's Room
                </span>
                <span className="text-[9px] text-c4cdc4/40">
                  Access safe writer prompts
                </span>
              </button>
            </div>
          </CRTPanel>

          {/* Active / Ready Campaigns */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-l-2 border-terminal-green pl-2">
              Ready Campaigns (Select to Simulate)
            </h3>
            
            {activeCampaigns.length === 0 ? (
              <div className="p-6 bg-terminal-metal/40 border border-terminal-metal text-center rounded text-xs text-c4cdc4/40">
                No campaigns are currently marked as "Ready". Ensure a campaign has at least one symbolic test to simulate it.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="bg-terminal-metal border border-terminal-metal-light p-4 rounded flex flex-col justify-between hover:border-terminal-green/60 transition-colors gap-3"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white tracking-wider uppercase truncate max-w-[150px]">
                          {camp.title}
                        </h4>
                        <span className="text-[8px] bg-terminal-green/10 text-terminal-green border border-terminal-green/30 px-1.5 py-0.5 rounded font-bold uppercase">
                          Ready
                        </span>
                      </div>
                      <p className="text-[10px] text-c4cdc4/70 mt-2 line-clamp-2">
                        {camp.objective}
                      </p>
                      <div className="text-[8px] text-c4cdc4/40 mt-1 uppercase">
                        Location: {camp.fictionalLocation.split(',')[0]}
                      </div>
                    </div>

                    <button
                      onClick={() => startSimulation(camp.id)}
                      className="w-full flex items-center justify-center gap-2 bg-terminal-green-dim/20 hover:bg-terminal-green/20 text-terminal-green border border-terminal-green/50 hover:border-terminal-green px-3 py-1.5 text-xs font-bold font-mono rounded cursor-pointer transition-colors"
                    >
                      <Play size={12} fill="currentColor" />
                      SIMULATE (THEATRE MODE)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Console Metrics & Logs */}
        <div className="flex flex-col gap-6">
          {/* Stats Panel */}
          <CRTPanel className="p-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green border-b border-terminal-green/20 pb-2">
              System Indicators
            </h3>

            <div className="flex flex-col gap-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-c4cdc4/60">Campaigns Stored:</span>
                <span className="text-white font-bold">{campaigns.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-c4cdc4/60">↳ Active/Ready:</span>
                <span className="text-terminal-green font-bold">{activeCampaigns.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-c4cdc4/60">↳ Drafts/Pending:</span>
                <span className="text-[#e2a228] font-bold">{draftCampaigns.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-c4cdc4/60">Dossiers Loaded:</span>
                <span className="text-white font-bold">{characters.length}</span>
              </div>
              <div className="flex justify-between border-t border-terminal-metal-light pt-2">
                <span className="text-c4cdc4/60">Simulation Runs:</span>
                <span className="text-terminal-green font-bold">{runs.length}</span>
              </div>
            </div>
          </CRTPanel>

          {/* Recent Runs Logs */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-l-2 border-terminal-red pl-2">
              Recent Case Logs
            </h3>
            
            {recentRuns.length === 0 ? (
              <div className="p-4 bg-terminal-metal/40 border border-terminal-metal text-center rounded text-[10px] text-c4cdc4/40">
                No simulation runs logged yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentRuns.map((run) => {
                  const camp = campaigns.find(c => c.id === run.campaignId);
                  const isRed = run.endingType.includes('Denial') || run.endingType.includes('Collapse');
                  
                  return (
                    <button
                      key={run.id}
                      onClick={() => setView('settings')} // Can click to inspect or manage settings
                      className="w-full text-left bg-terminal-metal/80 hover:bg-terminal-metal border border-terminal-metal-light hover:border-terminal-metal-light p-2.5 rounded flex items-center justify-between text-xs transition-colors cursor-pointer group"
                    >
                      <div className="truncate max-w-[170px]">
                        <div className="font-bold text-white group-hover:text-terminal-green transition-colors truncate">
                          {camp?.title || 'Unknown Campaign'}
                        </div>
                        <div className="text-[8px] text-c4cdc4/45 mt-0.5">
                          {new Date(run.endedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`text-[8px] border px-1.5 py-0.5 rounded font-bold uppercase ${
                        isRed 
                          ? 'border-terminal-red/35 text-terminal-red bg-terminal-red/5' 
                          : 'border-terminal-green/35 text-terminal-green bg-terminal-green/5'
                      }`}>
                        {run.endingType.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
