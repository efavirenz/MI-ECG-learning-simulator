export interface ThemeOption {
  id: string;
  name: string;
  mode: 'bright' | 'dark';
  colorPreview: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  appBg: string;
  navBg: string;
  cardBg: string;
  cardSubBg: string;
  cardBorder: string;
  borderCol: string;
  textColor: string;
  subtextColor: string;
  headingColor: string;
  accentText: string;
  accentBg: string;
  accentHoverBg: string;
  accentBorder: string;
  accentRing: string;
  paperMode: 'dark' | 'paper';
}

export const THEMES: ThemeOption[] = [
  // 5 Bright Themes
  {
    id: 'bright-paper',
    name: 'Pink ECG Paper',
    mode: 'bright',
    colorPreview: '#f43f5e',
    badgeBg: 'bg-rose-100',
    badgeBorder: 'border-rose-300',
    badgeText: 'text-rose-700',
    appBg: 'bg-[#fff9f5]',
    navBg: 'bg-[#fff1f2]/95',
    cardBg: 'bg-white',
    cardSubBg: 'bg-rose-50/70',
    cardBorder: 'border-rose-200',
    borderCol: 'border-rose-200',
    textColor: 'text-slate-800',
    subtextColor: 'text-slate-600',
    headingColor: 'text-slate-900',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-600 text-white',
    accentHoverBg: 'hover:bg-rose-500',
    accentBorder: 'border-rose-400',
    accentRing: 'focus:ring-rose-500',
    paperMode: 'paper'
  },
  {
    id: 'bright-slate',
    name: 'Clinical White',
    mode: 'bright',
    colorPreview: '#0284c7',
    badgeBg: 'bg-sky-100',
    badgeBorder: 'border-sky-300',
    badgeText: 'text-sky-700',
    appBg: 'bg-slate-50',
    navBg: 'bg-white/95',
    cardBg: 'bg-white',
    cardSubBg: 'bg-slate-100/70',
    cardBorder: 'border-slate-200',
    borderCol: 'border-slate-200',
    textColor: 'text-slate-800',
    subtextColor: 'text-slate-600',
    headingColor: 'text-slate-900',
    accentText: 'text-sky-600',
    accentBg: 'bg-sky-600 text-white',
    accentHoverBg: 'hover:bg-sky-500',
    accentBorder: 'border-sky-400',
    accentRing: 'focus:ring-sky-500',
    paperMode: 'paper'
  },
  {
    id: 'bright-emerald',
    name: 'Mint Health',
    mode: 'bright',
    colorPreview: '#10b981',
    badgeBg: 'bg-emerald-100',
    badgeBorder: 'border-emerald-300',
    badgeText: 'text-emerald-700',
    appBg: 'bg-[#f0fdf4]',
    navBg: 'bg-emerald-50/95',
    cardBg: 'bg-white',
    cardSubBg: 'bg-emerald-50/70',
    cardBorder: 'border-emerald-200',
    borderCol: 'border-emerald-200',
    textColor: 'text-slate-800',
    subtextColor: 'text-slate-600',
    headingColor: 'text-slate-900',
    accentText: 'text-emerald-700',
    accentBg: 'bg-emerald-600 text-white',
    accentHoverBg: 'hover:bg-emerald-500',
    accentBorder: 'border-emerald-400',
    accentRing: 'focus:ring-emerald-500',
    paperMode: 'paper'
  },
  {
    id: 'bright-sky',
    name: 'Sky Pediatric',
    mode: 'bright',
    colorPreview: '#0284c7',
    badgeBg: 'bg-sky-100',
    badgeBorder: 'border-sky-300',
    badgeText: 'text-sky-700',
    appBg: 'bg-[#f0f9ff]',
    navBg: 'bg-sky-50/95',
    cardBg: 'bg-white',
    cardSubBg: 'bg-sky-50/70',
    cardBorder: 'border-sky-200',
    borderCol: 'border-sky-200',
    textColor: 'text-slate-800',
    subtextColor: 'text-slate-600',
    headingColor: 'text-slate-900',
    accentText: 'text-cyan-700',
    accentBg: 'bg-cyan-600 text-white',
    accentHoverBg: 'hover:bg-cyan-500',
    accentBorder: 'border-cyan-400',
    accentRing: 'focus:ring-cyan-500',
    paperMode: 'paper'
  },
  {
    id: 'bright-amber',
    name: 'Warm Clinic',
    mode: 'bright',
    colorPreview: '#d97706',
    badgeBg: 'bg-amber-100',
    badgeBorder: 'border-amber-300',
    badgeText: 'text-amber-800',
    appBg: 'bg-[#fffbeb]',
    navBg: 'bg-amber-50/95',
    cardBg: 'bg-white',
    cardSubBg: 'bg-amber-50/70',
    cardBorder: 'border-amber-200',
    borderCol: 'border-amber-200',
    textColor: 'text-slate-800',
    subtextColor: 'text-slate-600',
    headingColor: 'text-slate-900',
    accentText: 'text-amber-700',
    accentBg: 'bg-amber-600 text-white',
    accentHoverBg: 'hover:bg-amber-500',
    accentBorder: 'border-amber-400',
    accentRing: 'focus:ring-amber-500',
    paperMode: 'paper'
  },

  // 5 Dark Themes
  {
    id: 'dark-navy',
    name: 'Telemetry Navy',
    mode: 'dark',
    colorPreview: '#22d3ee',
    badgeBg: 'bg-slate-900',
    badgeBorder: 'border-slate-700',
    badgeText: 'text-cyan-400',
    appBg: 'bg-slate-950',
    navBg: 'bg-slate-950/90',
    cardBg: 'bg-slate-900',
    cardSubBg: 'bg-slate-950/80',
    cardBorder: 'border-slate-800',
    borderCol: 'border-slate-800',
    textColor: 'text-slate-200',
    subtextColor: 'text-slate-400',
    headingColor: 'text-white',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-600 text-white',
    accentHoverBg: 'hover:bg-cyan-500',
    accentBorder: 'border-cyan-500',
    accentRing: 'focus:ring-cyan-500',
    paperMode: 'dark'
  },
  {
    id: 'dark-obsidian',
    name: 'Obsidian Cath-Lab',
    mode: 'dark',
    colorPreview: '#f43f5e',
    badgeBg: 'bg-zinc-900',
    badgeBorder: 'border-zinc-700',
    badgeText: 'text-rose-400',
    appBg: 'bg-zinc-950',
    navBg: 'bg-zinc-950/90',
    cardBg: 'bg-zinc-900',
    cardSubBg: 'bg-zinc-950/80',
    cardBorder: 'border-zinc-800',
    borderCol: 'border-zinc-800',
    textColor: 'text-zinc-200',
    subtextColor: 'text-zinc-400',
    headingColor: 'text-white',
    accentText: 'text-rose-400',
    accentBg: 'bg-rose-600 text-white',
    accentHoverBg: 'hover:bg-rose-500',
    accentBorder: 'border-rose-500',
    accentRing: 'focus:ring-rose-500',
    paperMode: 'dark'
  },
  {
    id: 'dark-emerald',
    name: 'Bio-Monitor Green',
    mode: 'dark',
    colorPreview: '#10b981',
    badgeBg: 'bg-[#022c22]',
    badgeBorder: 'border-emerald-800',
    badgeText: 'text-emerald-400',
    appBg: 'bg-[#021f18]',
    navBg: 'bg-[#021f18]/90',
    cardBg: 'bg-[#062e24]',
    cardSubBg: 'bg-[#022c22]/80',
    cardBorder: 'border-emerald-900/60',
    borderCol: 'border-emerald-900/60',
    textColor: 'text-emerald-100',
    subtextColor: 'text-emerald-300/80',
    headingColor: 'text-white',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-600 text-white',
    accentHoverBg: 'hover:bg-emerald-500',
    accentBorder: 'border-emerald-500',
    accentRing: 'focus:ring-emerald-500',
    paperMode: 'dark'
  },
  {
    id: 'dark-cobalt',
    name: 'Deep Cobalt ICU',
    mode: 'dark',
    colorPreview: '#3b82f6',
    badgeBg: 'bg-[#071739]',
    badgeBorder: 'border-blue-800',
    badgeText: 'text-blue-400',
    appBg: 'bg-[#030b1e]',
    navBg: 'bg-[#030b1e]/90',
    cardBg: 'bg-[#071739]',
    cardSubBg: 'bg-[#030b1e]/80',
    cardBorder: 'border-blue-900/60',
    borderCol: 'border-blue-900/60',
    textColor: 'text-blue-100',
    subtextColor: 'text-blue-300/80',
    headingColor: 'text-white',
    accentText: 'text-blue-400',
    accentBg: 'bg-blue-600 text-white',
    accentHoverBg: 'hover:bg-blue-500',
    accentBorder: 'border-blue-500',
    accentRing: 'focus:ring-blue-500',
    paperMode: 'dark'
  },
  {
    id: 'dark-amethyst',
    name: 'Critical Care Violet',
    mode: 'dark',
    colorPreview: '#a855f7',
    badgeBg: 'bg-[#1a0e36]',
    badgeBorder: 'border-purple-800',
    badgeText: 'text-purple-400',
    appBg: 'bg-[#0f0720]',
    navBg: 'bg-[#0f0720]/90',
    cardBg: 'bg-[#1a0e36]',
    cardSubBg: 'bg-[#0f0720]/80',
    cardBorder: 'border-purple-900/60',
    borderCol: 'border-purple-900/60',
    textColor: 'text-purple-100',
    subtextColor: 'text-purple-300/80',
    headingColor: 'text-white',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-600 text-white',
    accentHoverBg: 'hover:bg-purple-500',
    accentBorder: 'border-purple-500',
    accentRing: 'focus:ring-purple-500',
    paperMode: 'dark'
  }
];

export const DEFAULT_THEME_ID = 'dark-navy';

export function getTheme(id: string): ThemeOption {
  return THEMES.find(t => t.id === id) || THEMES[5];
}
