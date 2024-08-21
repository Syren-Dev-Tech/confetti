interface Overrides {
    coloring?: string;
    dynThemes?: string;
    interactive?: string;
    layout?: string;
    styling?: string;
    themes?: string;
}
export declare function viteConfigAliases(overrides?: Overrides): {
    [x: string]: string;
};
export {};
