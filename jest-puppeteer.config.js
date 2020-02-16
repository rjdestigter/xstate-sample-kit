module.exports = {
  server: {
    command: `npm run start:e2e`,
    port: 7000,
    launchTimeout: 60000
  },
  launch: {
    headless: false,
    slowMo: 0
  }
};
