export type ThemeName = string;
export declare const THEMES: Set<string>;
export declare const DARK_THEMES: Set<string>;
export declare const LIGHT_THEMES: Set<string>;
export type ColorScheme = 'light' | 'dark';
export type PaletteStyle = 'primary' | 'secondary' | 'trinary' | 'primary-compliment' | 'secondary-compliment' | 'trinary-compliment' | 'main' | 'body' | 'content' | 'divider';
export type CommonStyle = 'success' | 'hazard' | 'warning' | 'info' | 'exit' | 'active' | 'inactive' | 'neutral';
export type StyleMode = 'c' | 'i';
export type StyleName = 'none' | PaletteStyle | CommonStyle;
export declare const STYLES: Set<StyleName>;
type ThemeListener = (theme: ThemeName, colorScheme: ColorScheme) => void;
interface IThemeOption {
    style?: StyleName;
    mode?: StyleMode;
    mono?: number;
}
type ThemeOption = IThemeOption & {
    style: StyleName;
};
export interface ThemeOptions<T extends IThemeOption> {
    background?: T;
    border?: T;
    color?: T;
}
export interface ThemeProps {
    theme?: ThemeOptions<ThemeOption>;
}
declare class Theme {
    private readonly themes;
    private defaultTheme?;
    private listeners;
    private readonly themeAnimationDelay;
    private themeChangeTimeout?;
    private defaultColorScheme?;
    private LOCALSTORAGE_THEME_KEY;
    private LOCALSTORAGE_COLOR_SCHEME_KEY;
    getStyles(theme?: ThemeOptions<ThemeOption>): string;
    getBasicStyling(style: StyleName, theme?: ThemeOptions<IThemeOption>): string;
    private updateTheme;
    private onColorSchemeChange;
    addListener(key: string, listener: ThemeListener): void;
    removeListener(key: string): void;
    getColorScheme(): ColorScheme;
    getDefaultTheme(colorScheme?: ColorScheme): string | undefined;
    getTheme(): string | undefined;
    setTheme(theme: ThemeName): void;
    setColorScheme(colorScheme?: ColorScheme): void;
    getThemeColorScheme(theme?: ThemeName): ColorScheme;
    getThemeList(colorScheme?: ColorScheme): string[];
    init(defaultColorScheme?: ColorScheme, defaultTheme?: ThemeName, allowedThemes?: Set<ThemeName>): this;
    constructor();
}
export declare const themes: Theme;
export {};
