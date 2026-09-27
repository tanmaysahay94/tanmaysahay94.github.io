// Shared variant/theme vocabulary (separate file keeps components fast-refreshable).
export type Variant = 'heritage' | 'ledger' | 'paper' | 'terminal';
export const VARIANTS: Variant[] = ['heritage', 'ledger', 'paper', 'terminal'];
// Every visitor lands on this one; `?v=` or the switcher pins another.
export const DEFAULT_VARIANT: Variant = 'heritage';

// The full paise-banao theme roster, orthogonal to layout. 'native' = each
// variant's own palette; 'auto' resolves to light/dark via prefers-color-scheme.
export type Theme =
  | 'native' | 'auto' | 'light' | 'dark' | 'midnight' | 'terminal'
  | 'brockmann' | 'bulldog' | 'hanko' | 'vanderbilt' | 'aftermarket';
export const THEMES: Theme[] = [
  'native', 'auto', 'light', 'dark', 'midnight', 'terminal',
  'brockmann', 'bulldog', 'hanko', 'vanderbilt', 'aftermarket',
];

export const NATIVE_VT: Record<Variant, string> = {
  heritage: 'vt-heritage',
  ledger: 'vt-ledger',
  paper: 'vt-paper',
  terminal: 'vt-term',
};

export const isVariant = (v: string | null): v is Variant => VARIANTS.includes(v as Variant);
export const isTheme = (t: string | null): t is Theme => THEMES.includes(t as Theme);

export interface VariantProps {
  variant: Variant;
  vtClass: string;
  onSwitch: (v: Variant) => void;
}
