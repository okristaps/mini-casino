module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.test.tsx"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
