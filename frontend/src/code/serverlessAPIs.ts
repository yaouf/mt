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

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.API_KEY,
    },
    body: body,
    redirect: "follow",
  };

  console.log(process.env.API_KEY);

  const response = await fetch(
    "https://createdevice-h4fuv4ya3q-uc.a.run.app/",
    requestOptions
  );
  console.log(response);
  const result = await response.json();
  console.log(result);
  const deviceID = result["deviceId"];
  console.log("Device ID:", deviceID);

  return deviceID;
};
