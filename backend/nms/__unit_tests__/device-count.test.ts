import { testApiHandler } from "next-test-api-route-handler";
import { v4 as uuidv4 } from "uuid";
import db from "../dist/data/db-config";
import * as countHandler from "../pages/api/devices/count";

describe("device counting endpoints", () => {
  // Keep track of created device IDs so we can clean up after tests
  const testDeviceIds: string[] = [];
  let deviceCount = 0;

  // Counters for test devices
  let pushEnabledCount = 0;
  let breakingNewsCount = 0;
  let metroCount = 0;
  let sportsCount = 0;
  let universityNewsCount = 0;
  let scienceResearchCount = 0;
  let categorizedPushEnabledCount = 0;

  beforeAll(async () => {
    // Get current device count to compare with our test results
    const currentDevices = await db("devices").count("* as count").first();
    deviceCount = parseInt((currentDevices?.count as string) || "0");
    console.log(`Starting test with ${deviceCount} existing devices`);

    // Get categories for testing
    const categories = await db("categories").select("*");
    if (categories.length === 0) {
      throw new Error(
        "No categories found in database. Make sure migrations have been run."
      );
    }

    // Create a variety of test devices
    await setupTestDevices();
  });

  afterAll(async () => {
    // Clean up devices created during tests
    if (testDeviceIds.length > 0) {
      console.log(`Cleaning up ${testDeviceIds.length} test devices`);
      await db("devices").whereIn("id", testDeviceIds).del();
    }
  });

  // Helper function to create test devices
  async function createTestDevice(
    categoryNames: string[],
    isPushEnabled: boolean = true
  ) {
    const deviceId = uuidv4();
    await db("devices").insert({
      id: deviceId,
      device_type: "test-device",
      expo_push_token: `test-token-${deviceId.substring(0, 8)}`,
      is_push_enabled: isPushEnabled,
      date_created: new Date(),
    });

    if (categoryNames.length > 0) {
      // Get category IDs for the given names
      const categories = await db("categories")
        .whereIn("name", categoryNames)
        .select("id");

      // Add device preferences for each category
      const devicePreferences = categories.map((category) => ({
        device_id: deviceId,
        category_id: category.id,
      }));

      await db("device_preferences").insert(devicePreferences);
    }

    // Update counters
    if (isPushEnabled) {
      pushEnabledCount++;

      if (categoryNames.length > 0) {
        categorizedPushEnabledCount++;
      }

      if (categoryNames.includes("Breaking News")) {
        breakingNewsCount++;
      }

      if (categoryNames.includes("Metro")) {
        metroCount++;
      }

      if (categoryNames.includes("Sports")) {
        sportsCount++;
      }

      if (categoryNames.includes("University News")) {
        universityNewsCount++;
      }

      if (categoryNames.includes("Science and Research")) {
        scienceResearchCount++;
      }
    }

    testDeviceIds.push(deviceId);
    return deviceId;
  }

  // Setup function to create a variety of test devices
  async function setupTestDevices() {
    console.log("Creating test devices...");

    // Device with no categories
    await createTestDevice([]);

    // Devices with single categories
    await createTestDevice(["Breaking News"], true);
    await createTestDevice(["Metro"], true);
    await createTestDevice(["Sports"], true);
    await createTestDevice(["University News"], true);
    await createTestDevice(["Science and Research"], true);

    // Devices with multiple categories
    await createTestDevice(["Breaking News", "Metro"], true);
    await createTestDevice(["Metro", "University News"], true);
    await createTestDevice(["Sports", "Science and Research"], true);
    await createTestDevice(
      ["Breaking News", "Sports", "University News"],
      true
    );

    // Devices with push disabled
    await createTestDevice(["Breaking News"], false);
    await createTestDevice(["Metro", "Sports"], false);

    console.log(`Created ${testDeviceIds.length} test devices`);
    console.log(`Push enabled devices: ${pushEnabledCount}`);
    console.log(`Breaking News devices: ${breakingNewsCount}`);
    console.log(`Metro devices: ${metroCount}`);
    console.log(`Sports devices: ${sportsCount}`);
    console.log(`University News devices: ${universityNewsCount}`);
    console.log(`Science and Research devices: ${scienceResearchCount}`);
    console.log(
      `Categorized push-enabled devices: ${categorizedPushEnabledCount}`
    );
  }

  it("counts total devices correctly", async () => {
    const expectedTotalCount = deviceCount + testDeviceIds.length;

    await testApiHandler<{ count: number }>({
      pagesHandler: countHandler.default,
      requestPatcher: (req) => {
        req.headers = {
          "x-api-key": process.env.API_KEY || "test-api-key",
          authorization: "Bearer test-token",
        };
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const data = await res.json();

        // Verify we get the expected count (existing + new devices)
        expect(data.count).toBe(expectedTotalCount);
      },
    });
  });

  it("counts push-enabled devices correctly", async () => {
    // Calculate expected count of push-enabled devices
    const expectedPushEnabledCount = deviceCount + pushEnabledCount;

    await testApiHandler<{ count: number }>({
      pagesHandler: countHandler.default,
      requestPatcher: (req) => {
        req.headers = {
          "x-api-key": process.env.API_KEY || "test-api-key",
          authorization: "Bearer test-token",
        };
      },
      url: "/api/devices/count?search=is_push_enabled",
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const data = await res.json();

        // Verify count of push-enabled devices
        expect(data.count).toBe(expectedPushEnabledCount);
      },
    });
  });

  it("counts devices by category correctly", async () => {
    // Test breaking news count
    await testApiHandler<{ count: number }>({
      pagesHandler: countHandler.default,
      requestPatcher: (req) => {
        req.headers = {
          "x-api-key": process.env.API_KEY || "test-api-key",
          authorization: "Bearer test-token",
        };
      },
      url: "/api/devices/count?search=Breaking News",
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const data = await res.json();

        // Verify count of devices with Breaking News category
        expect(data.count).toBe(breakingNewsCount);
      },
    });

    // Test metro count
    await testApiHandler<{ count: number }>({
      pagesHandler: countHandler.default,
      requestPatcher: (req) => {
        req.headers = {
          "x-api-key": process.env.API_KEY || "test-api-key",
          authorization: "Bearer test-token",
        };
      },
      url: "/api/devices/count?search=Metro",
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const data = await res.json();

        // Verify count of devices with Metro category
        expect(data.count).toBe(metroCount);
      },
    });

    // Test sports count
    await testApiHandler<{ count: number }>({
      pagesHandler: countHandler.default,
      requestPatcher: (req) => {
        req.headers = {
          "x-api-key": process.env.API_KEY || "test-api-key",
          authorization: "Bearer test-token",
        };
      },
      url: "/api/devices/count?search=Sports",
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const data = await res.json();

        // Verify count of devices with Sports category
        expect(data.count).toBe(sportsCount);
      },
    });

    // Test University News count
    await testApiHandler<{ count: number }>({
      pagesHandler: countHandler.default,
      requestPatcher: (req) => {
        req.headers = {
          "x-api-key": process.env.API_KEY || "test-api-key",
          authorization: "Bearer test-token",
        };
      },
      url: "/api/devices/count?search=University News",
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const data = await res.json();

        // Verify count of devices with University News category
        expect(data.count).toBe(universityNewsCount);
      },
    });
  });

  it("counts devices with isPushEnabled parameter correctly", async () => {
    await testApiHandler<{ count: number }>({
      pagesHandler: countHandler.default,
      requestPatcher: (req) => {
        req.headers = {
          "x-api-key": process.env.API_KEY || "test-api-key",
          authorization: "Bearer test-token",
        };
      },
      url: "/api/devices/count?search=isPushEnabled",
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const data = await res.json();

        // Verify count of devices with at least one category and push enabled
        expect(data.count).toBe(categorizedPushEnabledCount);
      },
    });
  });
});
