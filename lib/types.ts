export type ThemeName = 'india' | 'mindaro' | 'navy' | 'pink' | 'rust' | 'syracuse' | 'tea' | 'tomato';

export type ColorScheme = 'light' | 'dark';

export type StyleFormat = 'f' | 'b' | 't' | 'ts' | 'bs';
export type PaletteStyle = 'primary' | 'secondary' | 'trinary' | 'primary-compliment' | 'secondary-compliment' | 'trinary-compliment' | 'main' | 'body' | 'content' | 'divider';
export type CommonStyle = 'success' | 'hazard' | 'warning' | 'info' | 'exit' | 'active' | 'inactive' | 'neutral';
export type StyleMode = 'c' | 'i';
export type StyleName = 'none' | PaletteStyle | CommonStyle;

export interface StyleOption {
    style: StyleName;
    mode?: StyleMode;
    mono?: number;
}

export interface ThemeOptionsModifier {
    listable?: 0 | 1;
}

export interface ITheme {
    inverse: string;
    scheme: ColorScheme;
    name: string;
}

export const THEMES = new Set<ThemeName>(['india', 'mindaro', 'navy', 'pink', 'rust', 'syracuse', 'tea', 'tomato']);

export const STYLES = new Set<StyleName>([
    'active',
    'body',
    'content',
    'divider',
    'exit',
    'hazard',
    'inactive',
    'info',
    'main',
    'neutral',
    'none',
    'primary-compliment',
    'primary',
    'secondary-compliment',
    'secondary',
    'success',
    'trinary-compliment',
    'trinary',
    'warning'
]);