import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CRTPanel } from '../components/common/CRTPanel';
import {
  Download,
  Upload,
  Lock,
  Unlock,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    settings,
    updateSettings,
    runs,
    exportDatabase,
    importDatabase,
    encryptVault,
    decryptVault,
    isVaultEncrypted,
    resetAll
  } = useApp();

  const [passphrase, setPassphrase] = useState('');
  const [encryptStatus, setEncryptStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [decryptStatus, setDecryptStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);
  
  // File Import state
  const [importFileText, setImportFileText] = useState('');

  const handleExport = () => {
    const dataStr = exportDatabase();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `jigsaw_mastermind_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFileText) return;
    
    const success = importDatabase(importFileText);
    if (success) {
      alert("Backup dataset successfully restored to local vault.");
      setImportFileText('');
    } else {
      alert("Failed to import database. Please verify the integrity of the JSON payload.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        if (event.target?.result) {
          setImportFileText(event.target.result as string);
        }
      };
    }
  };

  const handleEncryptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase) return;

    setEncryptStatus('idle');
    const success = await encryptVault(passphrase);
    if (success) {
      setEncryptStatus('success');
      setPassphrase('');
    } else {
      setEncryptStatus('fail');
    }
  };

  const handleDecryptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase) return;

    setDecryptStatus('idle');
    const success = await decryptVault(passphrase);
    if (success) {
      setDecryptStatus('success');
      setPassphrase('');
    } else {
      setDecryptStatus('fail');
    }
  };

  const handleReset = () => {
    if (confirm("CRITICAL WARNING: This will completely wipe all local database files, including custom campaigns, characters, tests, and simulation logs. This action cannot be undone. Proceed?")) {
      resetAll();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-terminal-metal/40 pb-4">
        <h2 className="text-xl font-extrabold tracking-widest text-white uppercase flex items-center gap-2">
          <span>// LOCAL PARAMETERS Vault</span>
          <span className="text-xs text-terminal-green font-normal tracking-wide lowercase">
            — offline-first configurations
          </span>
        </h2>
        <p className="text-xs text-c4cdc4/60">
          Adjust CRT styling options, export JSON database files, review case records, and toggle local passphrase protection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: UI configurations */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CRTPanel className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green border-b border-terminal-green/20 pb-2 mb-4">
              Terminal UI Adjustments
            </h3>

            <div className="flex flex-col gap-4 font-mono text-xs">
              {/* Theme Selection */}
              <div className="flex justify-between items-center border-b border-terminal-metal/30 pb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white uppercase">Console Color Palette</span>
                  <span className="text-[10px] text-c4cdc4/45">Visual color mapping</span>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value as any })}
                  className="bg-black border border-terminal-metal text-xs p-1.5 text-white rounded font-mono focus:outline-none focus:border-terminal-green"
                >
                  <option value="industrial-dark">Industrial Dark (Default Green)</option>
                  <option value="monochrome-dark">Monochrome Grey (Terminal Classic)</option>
                  <option value="clinical-green">Clinical Green (Hospital Sickly)</option>
                </select>
              </div>

              {/* CRT Noise Toggle */}
              <div className="flex justify-between items-center border-b border-terminal-metal/30 pb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white uppercase">CRT Screen Noise overlay</span>
                  <span className="text-[10px] text-c4cdc4/45">Toggles flickering and scanlines</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.visualNoise}
                  onChange={(e) => updateSettings({ visualNoise: e.target.checked })}
                  className="accent-terminal-green w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Narrative Intensity selection */}
              <div className="flex justify-between items-center border-b border-terminal-metal/30 pb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white uppercase">Simulation narrative Speed</span>
                  <span className="text-[10px] text-c4cdc4/45">Typewriter printing speed</span>
                </div>
                <select
                  value={settings.narrativeIntensity}
                  onChange={(e) => updateSettings({ narrativeIntensity: e.target.value as any })}
                  className="bg-black border border-terminal-metal text-xs p-1.5 text-white rounded font-mono focus:outline-none focus:border-terminal-green"
                >
                  <option value="light">Fast Typewriter (Light Delay)</option>
                  <option value="dark">Standard Typewriter (Tense Pacing)</option>
                </select>
              </div>

              {/* Safety Mode toggle */}
              <div className="flex justify-between items-center pb-1">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white uppercase">Strict Input Safety Filter</span>
                  <span className="text-[10px] text-c4cdc4/45">Validates campaigns & rewrites violence</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.strictSafetyMode}
                  onChange={(e) => updateSettings({ strictSafetyMode: e.target.checked })}
                  className="accent-terminal-green w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </CRTPanel>

          {/* Backup Database Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Export */}
            <div className="bg-terminal-metal border border-terminal-metal-light p-5 rounded flex flex-col justify-between h-[180px]">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Backup Archive Logs
                </h4>
                <p className="text-[10px] text-c4cdc4/55 leading-relaxed">
                  Export your compiled campaigns, subject dossiers, tests, and simulation history to a local JSON file.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-1.5 bg-terminal-green border border-terminal-green hover:bg-transparent text-black hover:text-terminal-green py-2 text-xs font-bold font-mono rounded cursor-pointer transition-colors"
              >
                <Download size={14} />
                DOWNLOAD EXPORT FILE
              </button>
            </div>

            {/* Import */}
            <div className="bg-terminal-metal border border-terminal-metal-light p-5 rounded flex flex-col justify-between h-[180px]">
              <form onSubmit={handleImport} className="flex flex-col justify-between h-full w-full">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Restore Vault Backup
                  </h4>
                  <p className="text-[10px] text-c4cdc4/55 leading-relaxed mb-3">
                    Load a database backup JSON file to populate your campaigns.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="text-[10px] font-mono text-c4cdc4/60 file:bg-black file:border file:border-terminal-metal file:text-white file:text-[9px] file:py-1 file:px-2 file:rounded file:cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!importFileText}
                  className={`w-full flex items-center justify-center gap-1.5 border py-2 text-xs font-bold font-mono rounded transition-colors ${
                    importFileText
                      ? 'bg-terminal-green text-black border-terminal-green hover:bg-transparent hover:text-terminal-green cursor-pointer'
                      : 'border-terminal-metal-light text-c4cdc4/20 cursor-not-allowed'
                  }`}
                >
                  <Upload size={14} />
                  RESTORE VAULT DATA
                </button>
              </form>
            </div>

          </div>

          {/* Collapsible Simulation history reports */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-l-2 border-terminal-green pl-2">
              Historical Case Archives ({runs.length})
            </h3>
            
            {runs.length === 0 ? (
              <div className="p-6 bg-terminal-metal/10 border border-terminal-metal/30 text-center rounded text-xs text-c4cdc4/40 font-mono">
                No past simulation case reports logged in storage vault.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {runs.map((run) => {
                  const isExpanded = expandedRunId === run.id;
                  const isRed = run.endingType.includes('Denial') || run.endingType.includes('Collapse');
                  
                  return (
                    <div
                      key={run.id}
                      className="bg-terminal-metal border border-terminal-metal-light rounded overflow-hidden"
                    >
                      {/* Accordion trigger row */}
                      <button
                        onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-terminal-metal-light/35 transition-colors cursor-pointer text-left"
                      >
                        <div className="font-mono text-xs">
                          <span className="text-[10px] text-c4cdc4/40 block">Run Date: {new Date(run.endedAt).toLocaleString()}</span>
                          <span className="font-bold text-white uppercase">ID: {run.id}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[8px] border px-2 py-0.5 rounded font-bold uppercase ${
                            isRed 
                              ? 'border-terminal-red/30 text-terminal-red bg-terminal-red/5' 
                              : 'border-terminal-green/30 text-terminal-green bg-terminal-green/5'
                          }`}>
                            {run.endingType}
                          </span>
                          
                          {isExpanded ? <EyeOff size={14} className="text-c4cdc4/60" /> : <Eye size={14} className="text-c4cdc4/60" />}
                        </div>
                      </button>

                      {/* Expanding details panel */}
                      {isExpanded && (
                        <div className="p-4 border-t border-terminal-metal-light bg-[#050605] select-text">
                          <div className="font-mono text-[10px] whitespace-pre-wrap leading-relaxed text-c4cdc4/90 bg-black p-3 border border-terminal-metal rounded max-h-60 overflow-y-auto mb-2 select-text selection:bg-terminal-green selection:text-black">
                            {run.report}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Encrypted Vault protection & reset */}
        <div className="flex flex-col gap-6">
          {/* Encryption configuration */}
          <CRTPanel className="p-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green border-b border-terminal-green/20 pb-2">
              Passphrase Crypto-Lock
            </h3>

            <p className="text-[10px] text-c4cdc4/55 leading-relaxed">
              Enable local 256-bit AES-GCM encryption on the database records. Plaintext storage is encrypted on disk. You will be required to input the passphrase next time you visit.
            </p>

            {isVaultEncrypted ? (
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2 text-terminal-green text-xs font-bold border border-terminal-green/20 bg-terminal-green/5 p-2 rounded">
                  <Lock size={16} />
                  <span>VAULT IS CURRENTLY LOCKED</span>
                </div>
                
                <form onSubmit={handleDecryptSubmit} className="flex flex-col gap-2">
                  <input
                    type="password"
                    required
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter passphrase to unlock..."
                    className="bg-black border border-terminal-metal text-xs p-2 text-white rounded font-mono focus:outline-none focus:border-terminal-green"
                  />
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1 bg-terminal-green text-black border border-terminal-green hover:bg-transparent hover:text-terminal-green py-1.5 text-xs font-bold rounded cursor-pointer transition-colors"
                  >
                    <Unlock size={12} />
                    DECRYPT VAULT PAYLOAD
                  </button>
                </form>
                {decryptStatus === 'fail' && (
                  <span className="text-[9px] text-terminal-red font-bold uppercase">Decryption Error. Wrong Key?</span>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2 text-c4cdc4/40 text-xs font-bold border border-terminal-metal p-2 rounded">
                  <Unlock size={16} />
                  <span>UNPROTECTED FILE VAULT</span>
                </div>
                
                <form onSubmit={handleEncryptSubmit} className="flex flex-col gap-2">
                  <input
                    type="password"
                    required
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Set vault lock passphrase..."
                    className="bg-black border border-terminal-metal text-xs p-2 text-white rounded font-mono focus:outline-none focus:border-terminal-green"
                  />
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1 bg-terminal-green text-black border border-terminal-green hover:bg-transparent hover:text-terminal-green py-1.5 text-xs font-bold rounded cursor-pointer transition-colors"
                  >
                    <Lock size={12} />
                    ENCRYPT AND LOCK VAULT
                  </button>
                </form>
                {encryptStatus === 'success' && (
                  <span className="text-[9px] text-terminal-green font-bold uppercase">Vault encrypted. Clear text removed.</span>
                )}
              </div>
            )}
          </CRTPanel>

          {/* Reset Database */}
          <div className="bg-terminal-metal border border-terminal-red/30 p-4 rounded flex flex-col gap-3">
            <h4 className="text-xs font-bold text-terminal-red uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={14} className="animate-pulse" />
              Destructive Protocols
            </h4>
            <p className="text-[9px] text-c4cdc4/55 leading-relaxed">
              Resetting will wipe all local data buffers and restore default preloaded campaigns (The Ledger Room, The Glass Confession, The Quiet Scale).
            </p>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-1.5 bg-terminal-red/10 border border-terminal-red/50 hover:bg-terminal-red hover:text-black text-terminal-red py-2 text-xs font-bold font-mono rounded cursor-pointer transition-all"
            >
              <Trash2 size={12} />
              FACTORY RESET SYSTEM
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
