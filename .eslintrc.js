"use strict"
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    env: {
        browser: true,
        es2022: true
    },
    extends: "standard-with-typescript",
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname
    },
    rules: {
        indent: ["error", 4, { SwitchCase: 1 }],
        quotes: ["error", "double", { avoidEscape: true }],
        "@typescript-eslint/quotes": ["error", "double", { avoidEscape: true }],
        "@typescript-eslint/indent": ["error", 4, { SwitchCase: 1 }],
        "@typescript-eslint/explicit-function-return-type": "off"
    },
    ignorePatterns: ["node_modules", "src/submodules"]
}
