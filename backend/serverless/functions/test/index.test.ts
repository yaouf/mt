import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import admin from "firebase-admin";
import firebaseFunctionsTest from "firebase-functions-test";
import { createDevice } from "../src/url/createDevice";

// Initialize the firebase-functions-test instance
const test = firebaseFunctionsTest();

// Set timeout for tests
jest.setTimeout(10000);

beforeAll(async () => {
  // Ensure admin is initialized only once
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: "demo-test",
    });
  }
});

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("../src/utils", () => ({
  validateApiKey: jest.fn().mockResolvedValue(true as never),
}));

describe("createDevice", () => {
  it("should create a new device successfully", async () => {
    const req = {
      body: {
        deviceType: "iOS",
        expoPushToken: "ExponentPushToken[unique-token-123]",
        "Breaking News": true,
        "University News": true,
        Metro: true,
        Opinions: true,
        "Arts and Culture": true,
        Sports: true,
        "Science and Research": true,
        isPushEnabled: true,
      },
      headers: {
        "X-API-KEY": "test-api-key",
      },
      rawBody: Buffer.from(""),
      get(header) {
        return this.headers[header];
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await createDevice(req as any, res as any);

    // Check if response was called with a deviceId
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceId: expect.any(String),
      })
    );
  });
});

// Clean up firebase-functions-test resources after tests complete
afterAll(async () => {
  // Properly close all Firebase apps
  await Promise.all(
    admin.apps
      .filter((app): app is admin.app.App => app !== null)
      .map((app) => app.delete())
  );

  // Clean up the test environment
  test.cleanup();
});
