interface Overrides {
    coloring?: string;
    dynThemes?: string;
    interactive?: string;
    layout?: string;
    styling?: string;
    themes?: string;
}

export function viteConfigAliases(overrides: Overrides = {}) {
    return {
        [overrides.coloring || '~coloring']: '@chrisofnormandy/confetti/_coloring.scss',
        [overrides.dynThemes || '~dynthemes']: '@chrisofnormandy/confetti/_dyn-themes.scss',
        [overrides.interactive || '~interactive']: '@chrisofnormandy/confetti/_interactive.scss',
        [overrides.layout || '~layout']: '@chrisofnormandy/confetti/_layout.scss',
        [overrides.styling || '~styling']: '@chrisofnormandy/confetti/_styling.scss',
        [overrides.themes || '~themes']: '@chrisofnormandy/confetti/_themes.scss'
    }
}