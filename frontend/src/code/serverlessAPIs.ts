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
  });

  console.log("creating device for expo push token", expoPushToken);

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
    "https://createdevice-h4fuv4ya3q-uc.a.run.app/",
    requestOptions
  );
  const result = await response.json();
  console.log(result);
  const deviceID = result["deviceId"];
  console.log("done creating device, device ID:", deviceID);

  return deviceID;
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
