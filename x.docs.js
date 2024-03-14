import fs from 'fs/promises';

const SCSS_PATTERN = /_?([\w*]+)\.scss/;
const DEFINITION_PATTERN_G = /(\/\*\*\n(\s*\*\s*(.+))*\n\s*\*\/\n)?(@(\w+)\s([\w-]+)\((.*)\))\s\{/g;
const DEFINITION_PATTERN = /(\/\*\*\n(\s*\*\s*(.+))*\n\s*\*\/\n)?(@(\w+)\s([\w-]+)\((.*)\))\s\{/;
const ARG_COMMENT_PART = /\s*\*\s*(\w+)\s*:\s*((.*)\n?(\s*\*\s*:\s*.*\n)*)/;
const DEF_COMMENT_PART = /\s*\*\s*(.+)\n/;
const COMMENT_PADDING = /\s*\*\s*:\s*/g
const COLOR_PATTERN = /#[a-f0-9]{3,6}/g;
const COMMENT_HEAD = /\/\*\*\n/;
const COMMENT_FOOT = /\s*\*\/\s*/;

console.log('Generating documentation...');

const START_DIR = "styles";
const TOC = [];

function heading(h, n) {
    TOC.push(' '.repeat(4 * (n - 1)) + `- [${h}](#${h})`);

    return `${'#'.repeat(n)} ${h}`;
}

function colorLink(clr) {
    return `![#${clr}](https://placehold.co/15x15/${clr}/${clr}.png) \`#${clr}\``
}

const lines = [
    heading('Documentation', 1),
    '',
    '<TOC>',
    ''
];

/**
 * 
 * @param {string} def 
 */
function handleDefinition(def) {
    const parts = [];

    const m = def.match(DEFINITION_PATTERN);

    let comment = m[1];
    const defType = m[5];
    const defName = m[6];
    const args = m[7];

    parts.push(
        '',
        `**${defName}**`,
        ''
    );

    parts.push('```scss');

    if (defType === 'mixin')
        parts.push(`@include ${defName}(${args});`);
    else if (defType === 'function')
        parts.push(`$var: ${defName}(${args});`);
    else
        parts.push(`${defName}(${args})`);

    parts.push('```');

    if (comment) {
        parts.push('');

        comment = comment.replace(COMMENT_HEAD, '').replace(COMMENT_FOOT, '');

        const argsComments = [];

        let c = comment.match(ARG_COMMENT_PART);
        while (c) {
            const arg = c[1];
            let cmt = c[2].replace(COMMENT_PADDING, '').trim();

            console.log(`${arg} ---> ${cmt}...<END>`);

            argsComments.push(`- \`${arg}\`: ${cmt}`);

            comment = comment.replace(c[0], '');
            c = comment.match(ARG_COMMENT_PART);
        }

        const defComment = comment.match(DEF_COMMENT_PART);
        if (defComment)
            parts.push(`> ${defComment[1]}`, '');

        parts.push(...argsComments);
    }

    return parts;
}

/**
 * 
 * @param {string[]} path 
 * @param {number} nested 
 */
async function docSection(path = [], nested = 2) {
    const p = path.join('/');
    const list = await fs.readdir(p);

    const sect = [
        heading(path.slice(-1), nested),
        '',
    ];

    const stylesheets = list.filter((name) => SCSS_PATTERN.test(name))
    const folders = list.filter((name) => !SCSS_PATTERN.test(name));

    const stylesheetParts = await Promise.all((stylesheets).map(async (file) => {
        const buffer = await fs.readFile(`${p}/${file}`)
        let text = buffer.toString();

        const partHeading = file.match(SCSS_PATTERN)[1];

        const definitions = text.match(DEFINITION_PATTERN_G) || [];

        const part = [
            heading(partHeading, nested + 1),
            '',
            ...definitions.map((def) => handleDefinition(def)).flat(1)
        ];

        return part.join('\n');
    }))

    lines.push(
        ...sect,
        ...stylesheetParts,
        ''
    );

    await Promise.all(folders.map(async (folder) => {
        await docSection([...path, folder], nested + 1)
    }));
}

async function main() {
    await docSection(['.', START_DIR]);

    let text = lines
        .join('\n')
        .replace('<TOC>', TOC.join('\n'));

    let colors = text.match(COLOR_PATTERN);
    const colorSet = new Set(colors);

    colorSet.forEach((color) => {
        text = text.replace(color, colorLink(color.replace('#', '')))
    })

    await fs.writeFile('./DOCUMENTATION.md', text);
}

main().catch(console.error);