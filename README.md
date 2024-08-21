# CoNfetti

Why does this "package" exist?

Basically, I'm tired of writing the same set of preset styles over and over.

So, here we are - a collection of SCSS stylesheets for everyday styles.

## Installation

Super simple:

`yarn add https://github.com/ChrisOfNormandy/confetti`

> :point_up: To install a specific branch, such as `dev`, add `.git#dev` to the end!

## Usage

I wrote this with the intended use with React+Vite, so I've provided `index.ts` (`index.js`) to define basic Vite config content.

In the Vite config, you can supply aliases like:

```ts
import { viteConfigAliases } from '@chrisofnormandy/confetti';

export default defineConfig({
    // ...
    resolve: {
        alias: {
            ...viteConfigAliases()
        }
    },
    // ...
});
```

There is an optional argument that defines a set of aliases returned by this `viteConfigAliases` function.
The value of each becomes the alias, such that `{layout: '~banana'}` would define `~banana` as the alias for the "layout" import.

In the SCSS files, to use this content, "import" (use) as:

```scss
@use '~layout' as layout;

.example {
    @use layout.flex;
}
```

There is some basic "boilerplate" CSS content defined in `main.scss`.

To include this, and to import and use the preset theme content:

```scss
@use '~themes' as themes;
@use '@chrisofnormandy/confetti/main.scss';

@include themes.themeify();
```

**Only import `main.scss` once.**