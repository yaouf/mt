import { describe, expect, it } from "@jest/globals";
import { createDevice } from "../src/url/createDevice";
process.env.ENV = "test";
console.log("Test for serverless functions");

jest.mock("../src/utils", () => ({
  validateApiKey: jest.fn().mockResolvedValue(true),
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
