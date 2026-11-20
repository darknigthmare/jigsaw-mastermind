import React from 'react';
import { useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './views/Dashboard';
import { CampaignBuilder } from './views/CampaignBuilder';
import { Dossiers } from './views/Dossiers';
import { TestDesigner } from './views/TestDesigner';
import { LoreTimeline } from './views/LoreTimeline';
import { WriterRoom } from './views/WriterRoom';
import { Settings } from './views/Settings';
import { TheatreMode } from './views/TheatreMode';
import { StationMode } from './views/StationMode';

const App: React.FC = () => {
  const { currentView } = useApp();
  const [stationOpen, setStationOpen] = React.useState(false);

  const closeStation = () => {
    setStationOpen(false);
    window.requestAnimationFrame(() => document.getElementById('station-launch')?.focus());
  };

  if (stationOpen) {
    return <StationMode onExit={closeStation} />;
  }

  // If in Theatre Mode, render full-screen simulation directly
  if (currentView === 'theatre') {
    return <TheatreMode />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onOpenStation={() => setStationOpen(true)} />;
      case 'campaigns':
      case 'campaign-new':
        return <CampaignBuilder />;
      case 'characters':
      case 'character-new':
        return <Dossiers />;
      case 'tests':
      case 'test-new':
        return <TestDesigner />;
      case 'timeline':
        return <LoreTimeline />;
      case 'writer-room':
        return <WriterRoom />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onOpenStation={() => setStationOpen(true)} />;
    }
  };

  return (
    <div className="station-app-shell">
      <AppShell>
        {renderActiveView()}
      </AppShell>
    </div>
  );
};

export default App;
