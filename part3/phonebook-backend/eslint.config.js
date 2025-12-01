module.exports = [
  // ignore built assets and deps
  { ignores: ["dist/**", "node_modules/**"] },

  // base config for backend JS (flat config)
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "writable",
        require: "readonly",
        console: "readonly",
        setImmediate: "readonly"
      }
    },
    rules: {}
  }
];
