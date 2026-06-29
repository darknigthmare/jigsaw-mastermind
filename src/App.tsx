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

const App: React.FC = () => {
  const { currentView } = useApp();

  // If in Theatre Mode, render full-screen simulation directly
  if (currentView === 'theatre') {
    return <TheatreMode />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
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
        return <Dashboard />;
    }
  };

  return (
    <AppShell>
      {renderActiveView()}
    </AppShell>
  );
};

export default App;
