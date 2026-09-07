import { backgroundStyle, borderStyle, boxShadowStyle, textShadowStyle, textStyle } from './helpers';
import type { StyleName, StyleOption, ThemeOptionsModifier } from './types';

class ThemeOptions {
    private background?: StyleOption;
    private border?: StyleOption;
    private text?: StyleOption;
    private textShadow?: StyleOption;
    private boxShadow?: StyleOption;

    private getClasses(modifier?: ThemeOptionsModifier) {
        const classes: string[] = [];

        if (modifier?.listable === 1) classes.push('li');
        if (this.background) classes.push(backgroundStyle(this.background));
        if (this.border) classes.push(borderStyle(this.border));
        if (this.text) classes.push(textStyle(this.text));
        if (this.textShadow) classes.push(textShadowStyle(this.textShadow));
        if (this.boxShadow) classes.push(boxShadowStyle(this.boxShadow));

        return classes;
    }

    toClassName(modifier?: ThemeOptionsModifier) {
        const classes = this.getClasses(modifier);

        return classes.join(' ');
    }

    merge(options: ThemeOptions | undefined) {
        if (!options) return this;

        if (options.background) this.background = options.background;
        if (options.border) this.border = options.border;
        if (options.text) this.text = options.text;
        if (options.textShadow) this.textShadow = options.textShadow;
        if (options.boxShadow) this.boxShadow = options.boxShadow;

        return this;
    }

    conditional(flag: boolean, a: ThemeOptions | undefined, b: ThemeOptions | undefined) {
        if (flag) return this.merge(a);

        return this.merge(b);
    }

    withBackground(style: StyleName) {
        this.background = {
            ...this.background,
            style
        };

        return this;
    }

    withBorder(style: StyleName) {
        this.border = {
            ...this.border,
            style
        };

        return this;
    }

    withTextColor(style: StyleName) {
        this.text = {
            ...this.text,
            style
        };

        return this;
    }

    withTextShadow(style: StyleName) {
        this.textShadow = {
            ...this.textShadow,
            style
        };

        return this;
    }

    withBoxShadow(style: StyleName) {
        this.boxShadow = {
            ...this.boxShadow,
            style
        };

        return this;
    }
}

export { type ThemeOptions };

export function theme() {
    return new ThemeOptions();
}

export interface ThemeProps {
    theme?: ThemeOptions;
}