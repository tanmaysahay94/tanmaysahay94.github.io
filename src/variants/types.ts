// Shared variant/theme vocabulary (separate file keeps components fast-refreshable).
export type Variant = 'ledger' | 'paper' | 'terminal';
export const VARIANTS: Variant[] = ['ledger', 'paper', 'terminal'];

// The paise-banao design-swarm palettes, orthogonal to layout.
export type Theme = 'native' | 'brockmann' | 'bulldog' | 'hanko' | 'vanderbilt' | 'aftermarket';
export const THEMES: Theme[] = ['native', 'brockmann', 'bulldog', 'hanko', 'vanderbilt', 'aftermarket'];

export const NATIVE_VT: Record<Variant, string> = {
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
