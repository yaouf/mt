// @ts-nocheck
import { describe, expect, it, jest } from "@jest/globals";
import { createDeviceImplementation } from "../src/url/createDevice";
console.log("Test for serverless functions");

// Mock dependencies
jest.mock("../src/utils", () => ({
  validateApiKey: jest.fn().mockReturnValue(true),
  validateUuidV4: jest.fn().mockReturnValue(true),
}));

// Mock environment variables 
jest.mock("../src/envars", () => ({
  environment: { value: "test" },
  dbUrl: { value: "mock-db-url" },
  trustedApiKey: { value: "mock-api-key" },
  dbName: { value: "mock-db-name" },
  dbUser: { value: "mock-db-user" },
  dbPassword: { value: "mock-db-password" },
  default: {
    environment: { value: "test" },
    dbUrl: { value: "mock-db-url" },
    trustedApiKey: { value: "mock-api-key" },
    dbName: { value: "mock-db-name" },
    dbUser: { value: "mock-db-user" },
    dbPassword: { value: "mock-db-password" },
  }
}));

// Mock UUID for predictable response
jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("test-device-id")
}));

describe("createDevice", () => {
  beforeEach(() => {
    // Reset mock calls before each test
    jest.clearAllMocks();
  });

  it("should create a new device successfully", async () => {
    // Create mock database
    const mockDb = jest.fn();
    
    // Mock categories table
    mockDb.mockImplementation((table) => {
      if (table === 'categories') {
        return {
          select: jest.fn().mockResolvedValue([
            { id: 1, name: "Breaking News" },
            { id: 2, name: "University News" },
            { id: 3, name: "Metro" },
            { id: 4, name: "Opinions" },
            { id: 5, name: "Arts and Culture" },
            { id: 6, name: "Sports" },
            { id: 7, name: "Science and Research" }
          ])
        };
      }
      
      // Default table handler
      return {
        where: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(null)
        }),
        insert: jest.fn().mockResolvedValue([1])
      };
    });
    
    // Add destroy method to mockDb
    mockDb.destroy = jest.fn().mockResolvedValue(undefined);
    
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
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    // Call the implementation function directly with our mock DB
    await createDeviceImplementation(req, res, mockDb);

    // Check if response was called with a deviceId
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceId: expect.any(String),
      })
    );
    
    // Verify the DB was called
    expect(mockDb).toHaveBeenCalled();
  });
});
