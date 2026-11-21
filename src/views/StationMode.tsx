import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Expand, Keyboard, LoaderCircle, RotateCcw, ScanLine, Smartphone } from 'lucide-react';
import { initialStationProgress, updateStationProgress } from '../services/stationProgress';
import { recordOrionConfirmed } from '../services/orionMarker';
import { clearStationSession, readStationSession, saveStationSession, toStationSession, type StationSession } from '../services/stationSession';
import { StationPlan } from './StationPlan';
import './StationMode.css';

interface StationModeProps {
  onExit: () => void;
}

type StationStatus = 'loading' | 'ready' | 'delayed' | 'error';

const stationPath = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}godot-station/index.html`;

export function StationMode({ onExit }: StationModeProps) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<StationStatus>('loading');
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [progress, setProgress] = useState(initialStationProgress);
  const [session, setSession] = useState<StationSession | null>(readStationSession);
  const [fullscreenNotice, setFullscreenNotice] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const viewRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    let ready = false;
    const frame = iframeRef.current;
    const frameFailed = () => { ready = false; setStatus('error'); };
    const timer = window.setTimeout(() => {
      if (!ready) setStatus(current => current === 'loading' ? 'delayed' : current);
    }, 45000);

    const receiveGameStatus = (event: MessageEvent<unknown>) => {
      const frameWindow = iframeRef.current?.contentWindow;
      if (!frameWindow || event.origin !== window.location.origin || event.source !== frameWindow) return;
      const payload = event.data;
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return;
      if (!('channel' in payload) || payload.channel !== 'jigsaw-station') return;
      if ('type' in payload && payload.type === 'ready') {
        ready = true;
        window.clearTimeout(timer);
        setStatus('ready');
      } else if (ready) {
        setProgress(current => updateStationProgress(current, payload));
      }
    };

    window.addEventListener('message', receiveGameStatus);
    frame?.addEventListener('error', frameFailed);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('message', receiveGameStatus);
      frame?.removeEventListener('error', frameFailed);
    };
  }, [attempt]);

  useEffect(() => {
    // The workshop detour outlives the iframe; Le Dernier Relais reads it as a
    // dossier piece. Only the completed diagnostic (register then witness) counts.
    if (progress.workshop === 'open') recordOrionConfirmed();
  }, [progress.workshop]);

  useEffect(() => {
    // Keep the report, not the room state: a reload must say what the last
    // crossing achieved instead of silently starting from zero.
    const saved = toStationSession(progress);
    if (!saved) return;
    saveStationSession(saved);
    setSession(saved);
  }, [progress]);

  const restart = () => {
    clearStationSession();
    setSession(null);
    setStatus('loading');
    setDocumentLoaded(false);
    setProgress(initialStationProgress);
    setAttempt(current => current + 1);
  };

  const leave = () => {
    if (document.fullscreenElement && viewRef.current?.contains(document.fullscreenElement)) {
      void document.exitFullscreen().catch(() => {});
    }
    document.exitPointerLock?.();
    onExit();
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (viewRef.current?.requestFullscreen) await viewRef.current.requestFullscreen();
      else setFullscreenNotice('Le plein écran n’est pas disponible ici. Vous pouvez jouer dans cette fenêtre.');
    } catch {
      setFullscreenNotice('Le plein écran n’a pas pu s’ouvrir. Vous pouvez jouer dans cette fenêtre.');
    }
  };

  const lastRun = session && !progress.started ? session : null;
  const lastRunMoment = lastRun ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(lastRun.recordedAt)) : '';

  const statusText = status === 'ready' ? 'Station prête'
    : status === 'error' ? 'Ouverture impossible'
      : status === 'delayed' ? 'Chargement prolongé'
        : documentLoaded ? 'Préparation de la station…' : 'Chargement de la station…';

  return (
    <section className="station-view" ref={viewRef} aria-labelledby="station-heading">
      <header className="station-toolbar">
        <button className="station-secondary-button station-exit" onClick={leave}><ArrowLeft size={17} aria-hidden="true" /><span>Tableau de bord</span></button>
        <div className="station-toolbar-title"><span className="station-eyebrow">EXPÉRIENCE ORIGINALE</span><h1 id="station-heading" ref={headingRef} tabIndex={-1}>Station de contrôle</h1></div>
        <div className="station-toolbar-actions">
          <button className="station-secondary-button" onClick={() => void toggleFullscreen()}><Expand size={16} aria-hidden="true" /><span>Plein écran</span></button>
          <button className="station-secondary-button" onClick={restart}><RotateCcw size={16} aria-hidden="true" /><span>Recommencer</span></button>
        </div>
      </header>

      <div className={`station-loading-status station-loading-status--${status}`}>
        {status === 'ready' ? <CheckCircle2 size={16} aria-hidden="true" /> : status === 'loading' ? <LoaderCircle size={16} className="station-spinner" aria-hidden="true" /> : <ScanLine size={16} aria-hidden="true" />}
        <span role="status">{statusText}</span>
        {status === 'delayed' && <span className="station-status-hint">Vous pouvez patienter ou réessayer.</span>}
        {status === 'error' && <span className="station-status-hint">Réessayez ou revenez au tableau de bord.</span>}
        {(status === 'error' || status === 'delayed') && <button className="station-inline-retry" onClick={restart}>Réessayer</button>}
        <a className="station-plan-link" href="#station-plan">Plan de la station</a>
      </div>

      <div className="station-run-mode" aria-live="polite">
        <span className="station-mode-badge">{progress.mode === 'defi' ? 'Défi · 3 min' : progress.mode === 'visite' ? 'Visite · sans limite de temps' : 'Visite ou défi · choisissez dans la station'}</span>
        <span>{progress.mode === 'defi' ? 'Validez les cinq objectifs avant la fin du temps imparti.' : 'Explorez quatre espaces, avec un détour facultatif par l’atelier.'}</span>
      </div>

      {lastRun && <section className="station-last-session" aria-labelledby="station-last-session-heading">
        <div>
          <span className="station-eyebrow">DERNIÈRE TRAVERSÉE</span>
          <h2 id="station-last-session-heading">{lastRun.status === 'sortie-validee' ? 'Sortie validée' : lastRun.status === 'delai-expire' ? 'Délai écoulé' : 'Traversée interrompue'}</h2>
          <p>{`${lastRun.mode === 'defi' ? 'Défi · 3 min' : 'Visite'} · ${lastRun.completed} / 5 objectifs · ${lastRunMoment}. Seul ce bilan est conservé : la position et l’état des portes ne le sont pas, une nouvelle traversée repart du sas.`}</p>
        </div>
        <button className="station-secondary-button" onClick={restart}>Nouvelle traversée</button>
      </section>}

      <div className="station-stage" aria-busy={status === 'loading' || status === 'delayed'}>
        <iframe
          key={attempt}
          ref={iframeRef}
          className="station-game-frame"
          src={stationPath}
          title="Station de contrôle — exploration à la première personne"
          loading="lazy"
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          onLoad={() => setDocumentLoaded(true)}
        />
      </div>

      {progress.outcome && <section className={`station-run-outcome station-run-outcome--${progress.outcome}`} role={progress.outcome === 'delai-expire' ? 'alert' : 'status'}>
        <div>
          <h2>{progress.outcome === 'delai-expire' ? 'Délai écoulé' : 'Sortie validée'}</h2>
          <p>{progress.outcome === 'delai-expire'
            ? `Le défi est terminé. ${progress.completed} / 5 objectifs atteints. Rejouez dans la station pour conserver ce mode, ou choisissez une nouvelle traversée.`
            : 'Les cinq objectifs sont validés. Vous pouvez rejouer dans ce mode ou choisir une nouvelle traversée.'}</p>
        </div>
        <button className="station-secondary-button" onClick={restart}>Choisir une nouvelle traversée</button>
      </section>}

      {fullscreenNotice && <p className="station-fullscreen-notice" role="status">{fullscreenNotice}</p>}

      <div className="station-field-guide">
        <StationPlan progress={progress} />
        <details className="station-controls" open>
          <summary>Commandes</summary>
          <div className="station-controls-grid">
            <p><Keyboard size={18} aria-hidden="true" /><span><strong>ZQSD / WASD</strong> pour avancer · <strong>souris ou flèches</strong> pour regarder · <strong>E</strong> pour interagir · <strong>P / Échap</strong> pour la pause.</span></p>
            <p><Smartphone size={18} aria-hidden="true" /><span><strong>Tactile :</strong> glissez sur la moitié gauche pour vous déplacer, sur la moitié droite pour regarder. Utilisez les boutons <strong>Examiner</strong> et <strong>Pause</strong>.</span></p>
          </div>
        </details>
      </div>
    </section>
  );
}
