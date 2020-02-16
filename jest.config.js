module.exports = {
  preset: 'jest-puppeteer',
  testRegex: './*\\.e2e\\.ts?$',
  transform: {
		"^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  }
};
