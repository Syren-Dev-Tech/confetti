export function viteConfigCss(options) {
    return {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: [
                        `@import "@chrisofnormandy/confetti/_pack.scss";`,
                        `@import "@chrisofnormandy/confetti/_themes.scss";`,
                        options && options.scss || ''
                    ].join('\n')
                }
            }
        }
    };
}
export const palettes = [
    'indian_red',
    'mindaro',
    'navy',
    'pink',
    'rust',
    'syracuse',
    'tea_green',
    'tomato'
];
