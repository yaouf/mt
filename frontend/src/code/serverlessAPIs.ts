import { Platform } from "react-native";

// wrap in try catch when call!!

/**
 * Constructs JSON Body that contains device info and push token to send a POST
 * request to APi endpoint
 */
export const createDevice = async (
  breaking: boolean,
  weekly: boolean,
  daily: boolean,
  expoPushToken: string
): Promise<string> => {
  const body = JSON.stringify({
    deviceType: Platform.OS,
    "Breaking News": breaking,
    "Weekly Summary": weekly,
    "Daily Summary": daily,
    expoPushToken: expoPushToken,
    isPushEnabled: true,
  });
  // TODO: CHECK TO SEE IF PUSHENABLED

  console.log("creating device for expo push token", expoPushToken);

  console.log("API Key:", process.env.EXPO_PUBLIC_API_KEY);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.EXPO_PUBLIC_API_KEY,
    },
    body: body,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://createdevice-h4fuv4ya3q-uc.a.run.app/",
      requestOptions
    );

    // Check if the response is okay
    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}`);
      const errorText = await response.text();
      console.log("Error response body:", errorText);
      throw new Error(`Request failed with status ${response.status}`);
    }

    // Check if the response content type is JSON
    const contentType = response.headers.get("content-type");
    let result;
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
      console.log("Parsed JSON response:", result);
    } else {
      const responseText = await response.text();
      console.log("Non-JSON response:", responseText);
      throw new Error("Response is not JSON");
    }

    const deviceID = result["deviceId"];
    console.log("done creating device, device ID:", deviceID);

    return deviceID;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error; // Re-throw the error after logging it
  }
};

/**
 * Constructs JSON Body that contains device id and setting(s) to update
 */
export const updateSettings = async (
  deviceId: string,
  breaking?: boolean,
  weekly?: boolean,
  daily?: boolean
) => {
  const body = JSON.stringify({
    deviceId: deviceId,
    "Breaking News": breaking,
    "Weekly Summary": weekly,
    "Daily Summary": daily,
  });

  console.log("updating settings for device", deviceId);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.EXPO_PUBLIC_API_KEY,
    },
    body: body,
    redirect: "follow",
  };

  const response = await fetch(
    "https://updatesettings-h4fuv4ya3q-uc.a.run.app/",
    requestOptions
  );

  if (response.status !== 200) {
    console.log("response code:", response.status);
  } else {
    console.log("success");
  }
};
