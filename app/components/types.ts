// ── Language data ─────────────────────────────────────────────────────────

export type Lang = {
  code: string;
  name: string;
  native: string;
  region: string;
  tts: boolean;
  provider: string;
};

export const LANGS: Lang[] = [
  { code:"lug", name:"Luganda",    native:"Luganda",    region:"Uganda",       tts:true,  provider:"Sunbird"     },
  { code:"ach", name:"Acholi",     native:"Acholi",     region:"Uganda",       tts:true,  provider:"Sunbird"     },
  { code:"teo", name:"Ateso",      native:"Ateso",      region:"Uganda",       tts:true,  provider:"Sunbird"     },
  { code:"nyn", name:"Runyankore", native:"Runyankore", region:"Uganda",       tts:true,  provider:"Sunbird"     },
  { code:"lgg", name:"Lugbara",    native:"Lugbara",    region:"Uganda",       tts:true,  provider:"Sunbird"     },
  { code:"yo",  name:"Yoruba",     native:"Yoruba",     region:"Nigeria",      tts:false, provider:"Khaya"       },
  { code:"tw",  name:"Twi",        native:"Twi",        region:"Ghana",        tts:false, provider:"Khaya"       },
  { code:"ee",  name:"Ewe",        native:"Ewe",        region:"Ghana/Togo",   tts:false, provider:"Khaya"       },
  { code:"gaa", name:"Ga",         native:"Ga",         region:"Ghana",        tts:false, provider:"Khaya"       },
  { code:"dag", name:"Dagbani",    native:"Dagbani",    region:"Ghana",        tts:false, provider:"Khaya"       },
  { code:"ki",  name:"Kikuyu",     native:"Gikuyu",     region:"Kenya",        tts:false, provider:"Khaya"       },
  { code:"luo", name:"Luo",        native:"Dholuo",     region:"Kenya",        tts:false, provider:"Khaya"       },
  { code:"mer", name:"Kimeru",     native:"Kimeru",     region:"Kenya",        tts:false, provider:"Khaya"       },
  { code:"kus", name:"Kusaal",     native:"Kusaal",     region:"Ghana",        tts:false, provider:"Khaya"       },
  { code:"sw",  name:"Swahili",    native:"Kiswahili",  region:"East Africa",  tts:false, provider:"HuggingFace" },
  { code:"fr",  name:"French",     native:"Français",   region:"Francophone",  tts:false, provider:"HuggingFace" },
  { code:"ar",  name:"Arabic",     native:"العربية",    region:"North Africa", tts:false, provider:"HuggingFace" },
  { code:"af",  name:"Afrikaans",  native:"Afrikaans",  region:"South Africa", tts:false, provider:"HuggingFace" },
];

export const PROVIDER_BADGE: Record<string, string> = {
  Sunbird:     "badge-sunbird",
  Khaya:       "badge-khaya",
  HuggingFace: "badge-huggingface",
  Grok:        "badge-grok",
};

export const PROVIDER_DOT: Record<string, string> = {
  Sunbird:     "dot-sunbird",
  Khaya:       "dot-khaya",
  HuggingFace: "dot-huggingface",
};

// ── Message types ─────────────────────────────────────────────────────────

export type Mode = "translate" | "chat";

export type TranslateMsg = {
  id: string;
  kind: "translate";
  input: string;
  translation?: string;
  error?: string;
  provider?: string;
  quality?: number;
  latency?: number;
  lang: Lang;
};

export type ChatMsg = {
  id: string;
  kind: "chat";
  role: "user" | "assistant";
  english: string;
  translated?: string;
  error?: string;
  provider?: string;
  quality?: number;
  latency?: number;
  lang: Lang;
  loading?: boolean;
};

export type Msg = TranslateMsg | ChatMsg;

// ── History entry ─────────────────────────────────────────────────────────

export type HistoryEntry = {
  id: string;
  input: string;
  output: string;
  lang: Lang;
  mode: Mode;
  timestamp: number;
};

export function uid() { return Math.random().toString(36).slice(2, 10); }
