import fetchMock from 'jest-fetch-mock';

global.fetch = fetchMock;

// Test log is being spammed with console outputs
global.console = {
  ...global.console,
  error: jest.fn(),
  log: jest.fn(),
};
