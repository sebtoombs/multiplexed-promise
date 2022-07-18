module.exports = {
  extends: ["airbnb-base", "prettier"],
  overrides: [
    {
      files: ["*.ts"],

      extends: ["airbnb-typescript/base", "prettier"],

      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
  ],
};
