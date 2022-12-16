"use strict"
const coverageEnabled = false

/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
let jestConfig = {
    testEnvironment: "node",
    testMatch: ["<rootDir>/**/*.(test|spec).(js|ts|tsx)"],
    testPathIgnorePatterns: ["<rootDir>/src/submodules/*/*"],
    modulePathIgnorePatterns: [
        "<rootDir>/node_modules",
        "<rootDir>/dist",
        "<rootDir>/coverage_dir",
        "<rootDir>/static",
        "<rootDir>/webpack"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    transformIgnorePatterns: ["dist/.*"]
}

if (coverageEnabled) {
    jestConfig = Object.assign(jestConfig, {
        collectCoverage: true,
        collectCoverageFrom: [
            "**/*.ts",
            "!**/node_modules/**"
        ],
        coverageDirectory: "coverage_dir",
        coverageReporters: ["html"]
    })
}

module.exports = jestConfig
