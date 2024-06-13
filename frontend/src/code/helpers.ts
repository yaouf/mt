import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction } from "react";

/**
 * sets an item in Async storage to the given value
 * @param key the key name of the item in Async storage
 * @param value the value to set that item to
 */
export async function setAsync(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.log(err);
  }
}

/**
 * gets the key from Async storage and parses json
 * @param key the key name of the item in Async storage
 */
export async function getAsync(key: string) {
  try {
    const storedItem = await AsyncStorage.getItem(key);
    if (storedItem !== null) {
      return JSON.parse(storedItem);
    }
  } catch (error) {
    console.error("Error loading data: ", error);
  }
}

/**
 * removes the key from Async storage
 * @param key the key name of the item in Async storage
 */
export async function removeAsync(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(err);
  }
}

export async function updateAsync(
  key: string,
  dict: Object,
  uuid: string,
  save: boolean,
  setFunction: Dispatch<SetStateAction<any>>,
  slug: string,
  date: string
) {
  if (save) {
    dict[uuid] = [slug, date];
  } else {
    // remove
    delete dict[uuid];
  }

  setFunction(dict);
  await setAsync(key, JSON.stringify(dict));
}
