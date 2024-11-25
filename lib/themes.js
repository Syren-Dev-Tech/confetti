export const THEMES = new Set(['india', 'mindaro', 'navy', 'pink', 'rust', 'syracuse', 'tea', 'tomato']);
export const DARK_THEMES = new Set(['india', 'navy', 'rust']);
export const LIGHT_THEMES = new Set(['mindaro', 'pink', 'syracuse', 'tea', 'tomato']);
export const STYLES = new Set(['none', 'active', 'body', 'content', 'divider', 'exit', 'hazard', 'inactive', 'info', 'main', 'neutral', 'primary', 'primary-compliment', 'secondary', 'secondary-compliment', 'success', 'trinary', 'trinary-compliment', 'warning']);
function getStyleClass(format, style, mode, mono) {
    if (style === 'none')
        return '';
    let styleClass = `${format}-${style}`;
    if (mono) {
        if (mono < 0)
            styleClass += `-d${-mono}`;
        else
            styleClass += `-l${mono}`;
    }
    if (mode)
        return styleClass + `-${mode}`;
    return styleClass;
}
function backgroundStyle(style, mode, mono) {
    return getStyleClass('f', style, mode, mono);
}
function borderStyle(style, mode, mono) {
    return getStyleClass('b', style, mode, mono);
}
function colorStyle(style, mode, mono) {
    return getStyleClass('c', style, mode, mono);
}
const THEME_CHANGE_CLASS = '__theme-change';
const COLOR_SCHEME_DARK = '(prefers-color-scheme: dark)';
const COLOR_SCHEME_LIGHT = '(prefers-color-scheme: light)';
class Theme {
    themes = new Set();
    defaultTheme;
    listeners = new Map();
    themeAnimationDelay = 2000;
    themeChangeTimeout;
    defaultColorScheme;
    LOCALSTORAGE_THEME_KEY;
    LOCALSTORAGE_COLOR_SCHEME_KEY;
    getStyles(theme) {
        if (!theme)
            return '';
        const list = [];
        if (theme.background)
            list.push(backgroundStyle(theme.background.style, theme.background.mode, theme.background.mono));
        if (theme.border)
            list.push(borderStyle(theme.border.style, theme.border.mode, theme.border.mono));
        if (theme.color)
            list.push(colorStyle(theme.color.style, theme.color.mode, theme.color.mono));
        if (list.length === 0)
            return '';
        return list.join(' ');
    }
    getBasicStyling(style, theme) {
        return this.getStyles({ background: { style, ...theme?.background }, border: { style, mono: 1, ...theme?.border }, ...theme?.color });
    }
    updateTheme(theme) {
        console.debug('Update theme to:', theme);
        document.body.classList.remove(...this.getThemeList());
        document.body.classList.add(theme, THEME_CHANGE_CLASS);
        clearTimeout(this.themeChangeTimeout);
        this.themeChangeTimeout = setTimeout(() => {
            document.body.classList.remove(THEME_CHANGE_CLASS);
            this.themeChangeTimeout = undefined;
        }, this.themeAnimationDelay);
        this.listeners.forEach((listener) => listener(theme, this.getColorScheme()));
    }
    onColorSchemeChange() {
        console.debug('On color scheme change...');
        let theme = this.getTheme();
        console.debug('Current theme:', theme);
        if (!theme || !this.themes.has(theme)) {
            console.warn('Theme is undefined or not in supported list; getting default theme');
            theme = this.getDefaultTheme();
        }
        if (!theme)
            throw Error('Failed to get theme on color scheme change');
        const colorScheme = this.getColorScheme();
        if (colorScheme === 'dark' && !DARK_THEMES.has(theme)) {
            theme = Array.from(LIGHT_THEMES)[0];
            console.warn('Using dark color scheme but selected theme is not in list; setting to', theme);
        }
        else if (colorScheme === 'light' && !LIGHT_THEMES.has(theme)) {
            theme = Array.from(DARK_THEMES)[0];
            console.warn('Using light color scheme but selected theme is not in list; setting to', theme);
        }
        if (!theme)
            throw new Error('Failed to get theme on color scheme change after selecting defaults');
        this.setTheme(theme);
    }
    addListener(key, listener) {
        this.listeners.set(key, listener);
    }
    removeListener(key) {
        this.listeners.delete(key);
    }
    getColorScheme() {
        const colorScheme = window.localStorage.getItem(this.LOCALSTORAGE_COLOR_SCHEME_KEY);
        if (colorScheme) {
            if (colorScheme !== 'dark' && colorScheme !== 'light')
                window.localStorage.removeItem(this.LOCALSTORAGE_COLOR_SCHEME_KEY);
            else
                return colorScheme;
        }
        if (window.matchMedia(COLOR_SCHEME_DARK).matches)
            return 'dark';
        if (window.matchMedia(COLOR_SCHEME_LIGHT).matches)
            return 'light';
        return this.defaultColorScheme || 'dark';
    }
    getDefaultTheme(colorScheme) {
        if (this.defaultTheme)
            return this.defaultTheme;
        const cs = colorScheme || this.getColorScheme();
        if (cs === 'dark')
            return Array.from(DARK_THEMES)[0];
        return Array.from(LIGHT_THEMES)[0];
    }
    getTheme() {
        const theme = window.localStorage.getItem(this.LOCALSTORAGE_THEME_KEY);
        console.debug('Get theme; have:', theme);
        if (!theme || !this.themes.has(theme)) {
            console.warn('No theme or not in supported list; getting default theme...');
            window.localStorage.removeItem(this.LOCALSTORAGE_THEME_KEY);
            return this.getDefaultTheme();
        }
        return theme;
    }
    setTheme(theme) {
        console.debug('Set theme:', theme);
        if (this.themes.has(theme)) {
            window.localStorage.setItem(this.LOCALSTORAGE_THEME_KEY, theme);
            this.updateTheme(theme);
        }
        else {
            console.warn('Theme is not in supported list; getting current theme');
            const currentTheme = this.getTheme();
            if (currentTheme)
                this.updateTheme(currentTheme);
        }
    }
    setColorScheme(colorScheme) {
        if (!colorScheme)
            window.localStorage.removeItem(this.LOCALSTORAGE_COLOR_SCHEME_KEY);
        else
            window.localStorage.setItem(this.LOCALSTORAGE_COLOR_SCHEME_KEY, colorScheme);
        this.onColorSchemeChange();
    }
    getThemeColorScheme(theme) {
        const currentTheme = this.getTheme();
        const useTheme = theme || currentTheme;
        if (!useTheme)
            return 'dark';
        return DARK_THEMES.has(useTheme) && 'dark' || 'light';
    }
    getThemeList(colorScheme) {
        if (!colorScheme)
            return Array.from(this.themes);
        if (colorScheme === 'dark')
            return Array.from(this.themes).filter((theme) => DARK_THEMES.has(theme));
        return Array.from(this.themes).filter((theme) => LIGHT_THEMES.has(theme));
    }
    init(defaultColorScheme, defaultTheme, allowedThemes) {
        this.defaultColorScheme = defaultColorScheme;
        this.defaultTheme = defaultTheme;
        console.debug('Init themes with:', this.defaultColorScheme, this.defaultTheme);
        const useAllThemes = allowedThemes === undefined || allowedThemes.size === 0;
        if (useAllThemes) {
            console.debug('Using all themes...');
            THEMES.forEach((t) => this.themes.add(t));
        }
        else {
            console.debug('Allowed themes', allowedThemes);
            if (defaultTheme)
                this.themes.add(defaultTheme);
            allowedThemes.forEach((t) => this.themes.add(t));
        }
        try {
            if (window.matchMedia) {
                window.matchMedia(COLOR_SCHEME_DARK).addEventListener('change', this.onColorSchemeChange);
                window.matchMedia(COLOR_SCHEME_LIGHT).addEventListener('change', this.onColorSchemeChange);
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            this.onColorSchemeChange();
        }
        return this;
    }
    constructor() {
        this.LOCALSTORAGE_COLOR_SCHEME_KEY = 'color_scheme';
        this.LOCALSTORAGE_THEME_KEY = 'theme';
        this.onColorSchemeChange = this.onColorSchemeChange.bind(this);
    }
}
export const themes = new Theme();
