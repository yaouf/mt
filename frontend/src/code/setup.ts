import { MenuItem } from "../types/types";
import { setAsync } from "./helpers";
import { Dispatch, SetStateAction } from "react";
import * as Notifications from "expo-notifications";
import { createDevice } from "./serverlessAPIs";

// for the horizontal section menu
// TODO: are we including post, multimedia, special projects ... and what order
export const menuItems: MenuItem[] = [
  { id: 3, title: "opinions", slug: "opinions" },
  { id: 4, title: "university news", slug: "university-news" },
  { id: 5, title: "arts & culture", slug: "arts-culture" },
  { id: 6, title: "metro", slug: "metro" },
  { id: 7, title: "sports", slug: "sports" },
  { id: 8, title: "science & research", slug: "science-research" },
  { id: 9, title: "podcast", slug: "podcast" },
];

/**
 * initialize default values for some things in async storage
 * and sync notification statuses
 *
 * returns the device id after calling createDevice
 */
export const setUpDevice = async (
  setBreaking: Dispatch<SetStateAction<boolean>>,
  setWeekly: Dispatch<SetStateAction<boolean>>,
  setDaily: Dispatch<SetStateAction<boolean>>,
  systemPermissionStatus: string,
  breaking?: boolean,
  weekly?: boolean,
  daily?: boolean
): Promise<string> => {
  
  setAsync("hasOnboarded", "true");  
  let deviceID: string = "";

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "51f97ce3-1a0c-4159-abc3-4b04e2e1db8b",
    })
  ).data;

  console.log("PERMISSION", systemPermissionStatus);

  try {
    if (systemPermissionStatus === "granted") {
      setAsync("breakingNotifs", JSON.stringify(breaking));
      setAsync("weeklyNotifs", JSON.stringify(weekly));
      setAsync("dailyNotifs", JSON.stringify(daily));
      deviceID = await createDevice(false, false, false, token);
      console.log("push token", token);
    } else {
      setBreaking(false);
      setWeekly(false);
      setDaily(false);
      setAsync("breakingNotifs", JSON.stringify(false));
      setAsync("weeklyNotifs", JSON.stringify(false));
      setAsync("dailyNotifs", JSON.stringify(false));
      deviceID = await createDevice(breaking, weekly, daily, token);
      console.log("push token", token);
    }
  } catch (error) {
    console.log("error creating device", error);
  }

  setAsync("deviceID", deviceID);
  return deviceID;
};
