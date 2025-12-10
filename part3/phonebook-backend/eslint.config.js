module.exports = [
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  {
    files: ["*.js", "models/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        console: "readonly",
        setImmediate: "readonly",
      }
    },
    rules: {}
  }
];
  