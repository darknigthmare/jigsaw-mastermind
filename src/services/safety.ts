// Safety Blocklist Rules and Rewrite Mappings

const BLOCKED_PATTERNS = [
  // Violence and Weapons
  /\b(knife|blade|gun|pistol|rifle|revolver|bomb|dynamite|c4|grenade|explosive|acid|poison|toxin|cyanide|arsenic|venom)\b/i,
  /\b(strangle|choke|murder|kill|assassinate|slaughter|torture|mutilate|amputate|bleed|decapitate|electrocute|incinerate)\b/i,
  /\b(sharp object|razor|saw off|slit|stab|shoot|poisoning|kidnap|abduct|hostage|captive|drown)\b/i,
  
  // Real world tracking and coercion
  /\b(stalk|spy|track location|gps tracking|hack webcam|phone tap|surveillance camera|real address|ip address|home address)\b/i,
  /\b(doxx|doxxing|blackmail|extort|harass|intimidate|threaten)\b/i
];

const REWRITE_MAP: Record<string, string> = {
  "piège": "épreuve symbolique",
  "trap": "symbolic test",
  "tuer": "confronter narrativement",
  "kill": "narratively confront",
  "torturer": "évaluer moralement",
  "torture": "moral evaluation",
  "kidnapper": "inviter à la simulation",
  "kidnap": "invite to the simulation",
  "bombe": "horloge logique",
  "bomb": "logical clock",
  "sang": "vérité",
  "blood": "truth",
  "couteau": "clé logique",
  "knife": "logical key",
  "arme": "dilemme",
  "weapon": "dilemma",
  "victime": "sujet fictif",
  "victim": "fictional subject",
  "acid": "corrosive choice",
  "poison": "dilemma"
};

export interface SafetyCheckResult {
  isSafe: boolean;
  blockedTerm?: string;
  explanation?: string;
  suggestedRewrite?: string;
}

/**
 * Scans a given string for unsafe keywords and patterns.
 */
export function checkTextSafety(text: string): SafetyCheckResult {
  if (!text) {
    return { isSafe: true };
  }

  // Scan against blocklist
  for (const pattern of BLOCKED_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const term = match[0];
      return {
        isSafe: false,
        blockedTerm: term,
        explanation: `The term "${term}" is associated with real-world violence, weaponry, or coercion. The application enforces a strict safety layer: only symbolic, psychological, and non-violent escape-room elements are permitted.`,
        suggestedRewrite: autoRewrite(text)
      };
    }
  }

  return { isSafe: true };
}

/**
 * Attempts to replace unsafe terms with safe, psychological equivalents.
 */
export function autoRewrite(text: string): string {
  let rewritten = text;
  
  // Replace direct matching words from our rewrite map
  Object.entries(REWRITE_MAP).forEach(([dangerWord, safeWord]) => {
    const regex = new RegExp(`\\b${dangerWord}\\b`, 'gi');
    rewritten = rewritten.replace(regex, safeWord);
  });

  // Strip generic physical violence verbs if found
  rewritten = rewritten.replace(/\b(kill|stab|shoot|strangle|abduct) him\b/gi, "confront him narratively");
  rewritten = rewritten.replace(/\b(kill|stab|shoot|strangle|abduct) her\b/gi, "confront her narratively");
  rewritten = rewritten.replace(/\b(kill|stab|shoot|strangle|abduct) them\b/gi, "confront them narratively");

  return rewritten;
}

/**
 * Performs deep safety checks on an entire campaign, sanitizing titles, descriptions, and rules.
 */
export function sanitizeCampaignData(data: {
  title: string;
  objective: string;
  fictionalLocation: string;
}): { isSafe: boolean; sanitized: typeof data; blockedTerm?: string } {
  const titleCheck = checkTextSafety(data.title);
  if (!titleCheck.isSafe) {
    return {
      isSafe: false,
      blockedTerm: titleCheck.blockedTerm,
      sanitized: {
        title: autoRewrite(data.title),
        objective: autoRewrite(data.objective),
        fictionalLocation: autoRewrite(data.fictionalLocation)
      }
    };
  }

  const objCheck = checkTextSafety(data.objective);
  if (!objCheck.isSafe) {
    return {
      isSafe: false,
      blockedTerm: objCheck.blockedTerm,
      sanitized: {
        title: autoRewrite(data.title),
        objective: autoRewrite(data.objective),
        fictionalLocation: autoRewrite(data.fictionalLocation)
      }
    };
  }

  const locCheck = checkTextSafety(data.fictionalLocation);
  if (!locCheck.isSafe) {
    return {
      isSafe: false,
      blockedTerm: locCheck.blockedTerm,
      sanitized: {
        title: autoRewrite(data.title),
        objective: autoRewrite(data.objective),
        fictionalLocation: autoRewrite(data.fictionalLocation)
      }
    };
  }

  return {
    isSafe: true,
    sanitized: data
  };
}
