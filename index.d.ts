type ConfigOptions = {
    scss?: string;
};
export declare function viteConfigCss(options: ConfigOptions): {
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: string;
            };
        };
    };
};
export declare const palettes: string[];
export {};
