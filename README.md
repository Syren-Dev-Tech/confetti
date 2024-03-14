# CoNfetti

Why does this "package" exist?

Basically, I'm tired of writing the same set of preset styles over and over.

So, here we are. A collection of SCSS stylesheets for everyday styles.

## Getting Started

Super simple.

`yarn add https://github.com/ChrisOfNormandy/confetti`

This is designed for React Vite, so all you need to do is import the config in `index.js`.

That would make the `vite.config.js` file something like:

```js
export default defineConfig({
    ...viteConfig(),
    // Etc...
}
```

This imports the `_pack.scss` file as global.

### Config Options

If you want to add more SCSS imports, add the option:

```json
{
    "scss": "...scss string..."
}
```

For example, to include a new palette:

```js
...viteConfig({ scss: `:root { @include def-palette('test', #ff0000, #ffff00, #00ff00, #00ffff, #0000ff); }` })
```

## Palettes

I'm not a palette or design concept artist.

You can use something like this site: https://coolors.co/generate

... to generate basic color palettes.

Palettes here are defined per file like:

```scss
@use 'sass:map';

$theme_map: (
    0: #ff0000,
    1: #ffff00,
    2: #00ff00,
    3: #00ffff,
    4: #0000ff
);

@function theme($color) {
    @return map.get($theme_map, $color);
}
```

Because I suck at coming up with theme names, I just call them the first or second "Crayola" colors on the list.

I supply all palettes in a map for "easy looping."

```scss
$palettes: (
    'name': $theme_map
);

$clr: palette($paletteName, $n);

$clr: palette-inverse($paletteName, $n);

$clr: palette-compliment($paletteName, $n);
```