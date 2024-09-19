export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/test"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};