interface Overrides {
    coloring?: string;
    interactive?: string;
    layout?: string;
    styling?: string;
    themes?: string;
}

const PACKAGE_NAME = '@dead-harbour/scss-rigging';
const keys = ['coloring', 'interactive', 'layout', 'styling', 'themes'] as const;

export function viteConfigAliases(overrides?: Overrides) {
    return Object.fromEntries(
        keys.map(key => [
            overrides?.[key] ?? `~${key}`,
            `${PACKAGE_NAME}/_${key}.scss`
        ])
    );
}
