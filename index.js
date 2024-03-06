export function viteConfig() {
    return {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "confetti/_pack.scss";`
                }
            }
        }
    }
}