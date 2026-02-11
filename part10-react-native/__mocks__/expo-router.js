module.exports = {
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  Stack: ({ children }) => children,
  Tabs: ({ children }) => children,
};
