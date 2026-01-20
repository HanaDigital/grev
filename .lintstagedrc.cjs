// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const buildEslintCommand = (filenames) =>
    `eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(" ")}`;

module.exports = {
    "*.{js,jsx,ts,tsx}": [
        buildEslintCommand,
        "prettier --ignore-unknown --write",
    ],
    "!(*.{js,jsx,ts,tsx})": ["prettier --ignore-unknown --write"],
};
