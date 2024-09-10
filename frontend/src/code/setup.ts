import * as Notifications from "expo-notifications";
import { Dispatch, SetStateAction } from "react";
import { MenuItem } from "../types/other";
import { setAsync } from "./helpers";
import { createDevice } from "./serverlessAPIs";

// for the horizontal section menu
// TODO: are we including post, multimedia, special projects ... and what order
export const menuItems: MenuItem[] = [
  { id: 3, title: "university news", slug: "university-news" },
  { id: 4, title: "metro", slug: "metro" },
  { id: 5, title: "opinions", slug: "opinions" },
  { id: 6, title: "arts & culture", slug: "arts-culture" },
  { id: 7, title: "sports", slug: "sports" },
  { id: 8, title: "science & research", slug: "science-research" },
  // { id: 9, title: "podcasts", slug: "podcasts" },
];

/**
 * initialize default values for some things in async storage
 * and sync notification statuses
 *
 * returns the device id after calling createDevice
 */
export const setUpDevice = async (
  setBreaking: Dispatch<SetStateAction<boolean>>,
  setUniversityNews: Dispatch<SetStateAction<boolean>>,
  setMetro: Dispatch<SetStateAction<boolean>>,
  systemPermissionStatus: string,
  breaking?: boolean,
  universityNews?: boolean,
  metro?: boolean
): Promise<string> => {
  setAsync("hasOnboarded", "true");
  let deviceID: string = "";

  let token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "2f15114e-2295-4fe6-bd82-606b41277acc",
    })
  ).data;
  // token = token.replace("ExponentPushToken[", "").replace("]", "");
  console.log("PERMISSION", systemPermissionStatus);

  try {
    if (systemPermissionStatus === "granted") {
      setAsync("breakingNotifs", JSON.stringify(breaking));
      setAsync("universityNewsNotifs", JSON.stringify(universityNews));
      setAsync("metroNotifs", JSON.stringify(metro));
      deviceID = await createDevice(
        breaking as boolean,
        universityNews as boolean,
        metro as boolean,
        token
      );
      console.log("push token", token);
    } else {
      setBreaking(false);
      setUniversityNews(false);
      setMetro(false);
      setAsync("breakingNotifs", JSON.stringify(false));
      setAsync("universityNewsNotifs", JSON.stringify(false));
      setAsync("metroNotifs", JSON.stringify(false));
      deviceID = await createDevice(false, false, false, token);
      console.log("deviceID being set in line 65 of setup.ts", deviceID);
      console.log("push token", token);
    }
  } catch (error) {
    console.log("error creating device", error);
  }

  setAsync("deviceID", deviceID);
  setAsync("savedArticles", JSON.stringify({}));
  setAsync("sectionMenu", JSON.stringify(menuItems));
  return deviceID;
};
