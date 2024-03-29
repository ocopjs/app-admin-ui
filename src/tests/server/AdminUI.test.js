// We don't want to actually run webpack, so we mock all the bits out
jest.doMock("webpack", () => {
  const mock = jest.fn(() => {});
  mock.HotModuleReplacementPlugin = jest.fn(() => {});
  mock.DefinePlugin = jest.fn(() => {});
  return mock;
});

jest.doMock("webpack-dev-middleware", () => {
  return jest.fn(() => () => {});
});

jest.doMock("webpack-hot-middleware", () => {
  return jest.fn(() => () => {});
});

jest.doMock("html-webpack-plugin", () => {
  return jest.fn(() => {});
});

const { AdminUIApp } = require("../../");

const ocop = {
  getAdminMeta: jest.fn(() => ({ lists: [], name: "test" })),
  getAdminViews: jest.fn(() => ({ hooks: {}, pages: {}, listViews: {} })),
};
const adminPath = "admin_path";

test("new AdminUIApp() - smoke test", () => {
  const adminUI = new AdminUIApp({ adminPath });
  expect(adminUI).not.toBe(null);
  expect(adminUI.adminPath).toEqual(adminPath);
});

describe("Add Middleware", () => {
  test("Smoke test", () => {
    const adminUI = new AdminUIApp({ adminPath });
    const adminMeta = adminUI.getAdminUIMeta(ocop);
    expect(adminUI.createDevMiddleware({ adminMeta, ocop })).not.toBe(null);
  });
});
