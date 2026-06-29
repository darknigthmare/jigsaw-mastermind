import React, { useState } from 'react';
import { CRTPanel } from '../components/common/CRTPanel';
import { Copy, Check, FileCode, ShieldAlert } from 'lucide-react';

interface PromptItem {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export const WriterRoom: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const prompts: PromptItem[] = [
    {
      id: 'prompt-character',
      title: 'Générer un Dossier Sujet Fictif',
      description: 'Génère un personnage original avec un défaut moral et un secret, conçu pour une épreuve d\'escape-room sans violence.',
      prompt: `Tu es un scénariste d'escape-room interactives.
Génère un dossier de personnage fictif complet dans un format JSON compatible avec la structure suivante.
Le personnage doit avoir un conflit moral profond, mais sans aucune implication de violence physique.

Garde-fous éthiques stricts :
- Pas de violence, pas de blessure physique, pas d'allusions sanglantes.
- Tout doit être formulé comme une simulation narrative.
- Pas de noms ou détails de vraies personnes.

Champs JSON attendus :
{
  "name": "[Nom Inventé]",
  "role": "[Poste Professionnel / Social]",
  "archetype": "[Nom d'archétype, ex: Le Bureaucrate Blindé]",
  "moralFlaw": "[Défaut moral lié à l'égoïsme, le mensonge ou l'exploitation]",
  "symbolicFear": "[Peur psychologique ou sociale symbolique]",
  "redemptionGoal": "[Ce que le personnage doit confesser ou sacrifier symboliquement pour se racheter]",
  "denialPattern": "[L'excuse qu'il se raconte à lui-même]",
  "relationships": "[Lien avec un autre personnage inventé ou témoin de son défaut]"
}`
    },
    {
      id: 'prompt-test',
      title: 'Générer une Épreuve Symbolique',
      description: 'Génère un puzzle logique, un choix à embranchements ou un dilemme moral non-physique.',
      prompt: `Tu es un concepteur de jeux d'escape-room de thriller psychologique.
Génère une épreuve/énigme symbolique non violente pour un personnage fictif. 
L'épreuve doit être un puzzle logique, un choix textuel ou une confession d'une faute passée.

Garde-fous éthiques stricts :
- AUCUNE violence physique, aucun piège tranchant, aucun poison réel, aucun danger mécanique.
- Le "risque" en cas d'échec doit être purement narratif (ex: la publication d'un e-mail d'aveux, la perte d'un privilège fictif).
- Reste dans le thème de l'acceptation de la responsabilité.

Format attendu :
- **Titre de l'épreuve** : Métaphorique (ex: La Balance Muette)
- **Concept** : Le puzzle logique ou le choix à faire
- **Option A (Rédemption/Vérité)** : Choix difficile de vérité (+ impact narratif, + deltas de scores moral)
- **Option B (Déni/Facilité)** : Choix de dissimulation (+ impact narratif, + deltas de scores moral)
- **Indices** : 2 indices cryptiques pour aider à résoudre le puzzle`
    },
    {
      id: 'prompt-tape',
      title: 'Générer un Message de Cassette',
      description: 'Génère un discours d\'introduction cérémoniel et froid, inspiré du lore mais 100% original.',
      prompt: `Tu es un scénariste d'escape-room psychologiques inspiré de la franchise Saw.
Génère le script d'une cassette audio fictive d'introduction pour un sujet. 
Le ton doit être froid, méthodique, cérémoniel et philosophique, soulignant le défaut du personnage.

Garde-fous éthiques stricts :
- Pas de menaces de mort, pas de violence physique, pas de sang.
- Remplace le danger physique par un choix de réputation ou un dilemme de vérité.
- Ne pas recopier de phrases exactes des films, créer un texte 100% original.

Structure attendue :
1. Salutation froide (ex: "Bonjour Victor. Je veux faire un jeu avec toi.")
2. Rappel du défaut moral (ex: "Tu as falsifié ces chiffres pour conserver ton bonus...")
3. Métaphore mécanique ou horlogère (ex: "Les rouages ne mentent pas...")
4. Présentation du choix symbolique (ex: "Devant toi se trouvent deux chemins...")
5. Règle du jeu simple (ex: "Choisis ton image ou ta conscience...")
6. Phrase finale marquante et originale.`
    },
    {
      id: 'prompt-twist',
      title: 'Générer un Twist Narratif Moral',
      description: 'Génère un rebondissement dans la campagne où les choix du sujet révèlent un lien inattendu.',
      prompt: `Tu es un scénariste de thriller psychologique offline-first.
Génère une idée de rebondissement narratif (twist) pour une campagne interactive d'escape-room.

Garde-fous éthiques stricts :
- Aucun twist impliquant de vraies personnes ou des actes réels criminels.
- Le twist doit reposer sur des relations de cause à effet morales (ex: l'archétype découvre que le document qu'il a détruit contenait en réalité la preuve de son propre rachat).
- Reste intellectuel, symbolique et axé sur la philosophie du choix.`
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-terminal-metal/40 pb-4">
        <h2 className="text-xl font-extrabold tracking-widest text-white uppercase flex items-center gap-2">
          <span>// WRITER'S ROOM</span>
          <span className="text-xs text-terminal-green font-normal tracking-wide lowercase">
            — local ai prompt laboratory
          </span>
        </h2>
        <p className="text-xs text-c4cdc4/60">
          Structured writer prompts with built-in ethical safety boundaries. Copy these directly to feed into local LLM configurations (like Ollama).
        </p>
      </div>

      <div className="bg-[#120e0d] border border-terminal-green/20 p-4 rounded text-xs leading-relaxed text-c4cdc4/80 flex items-start gap-3">
        <ShieldAlert size={20} className="text-terminal-green animate-pulse flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block uppercase mb-1">Notice Éthique de Génération :</strong>
          Ces prompts intègrent des instructions d'auto-modération conçues pour forcer les modèles de langage à respecter les règles de non-violence, d'expression clinique et de scénarisation purement fictive. Tout est structuré localement.
        </div>
      </div>

      {/* Prompts list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompts.map((p) => {
          const isCopied = copiedId === p.id;
          return (
            <CRTPanel key={p.id} className="p-5 flex flex-col justify-between h-[340px]">
              <div>
                <div className="flex items-center gap-2 text-terminal-green border-b border-terminal-green/20 pb-2 mb-3">
                  <FileCode size={16} />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-white">
                    {p.title}
                  </h3>
                </div>
                <p className="text-[10px] text-c4cdc4/60 mb-4 h-12 overflow-hidden leading-relaxed">
                  {p.description}
                </p>

                {/* Text preview */}
                <div className="bg-black/60 border border-terminal-metal p-3 rounded font-mono text-[9px] text-c4cdc4/75 h-36 overflow-y-auto leading-relaxed select-text select-all whitespace-pre-wrap">
                  {p.prompt}
                </div>
              </div>

              <button
                onClick={() => handleCopy(p.id, p.prompt)}
                className={`mt-4 w-full flex items-center justify-center gap-2 border py-2 text-xs font-bold font-mono rounded cursor-pointer transition-all ${
                  isCopied
                    ? 'bg-terminal-green/10 border-terminal-green text-terminal-green'
                    : 'bg-terminal-green text-black border-terminal-green hover:bg-transparent hover:text-terminal-green'
                }`}
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                {isCopied ? 'PROMPT COPIED' : 'COPY WRITER PROMPT'}
              </button>
            </CRTPanel>
          );
        })}
      </div>
    </div>
  );
};
