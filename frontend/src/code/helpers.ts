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
  previousData: any,
  item: any,
  save: boolean,
  setFunction: Dispatch<SetStateAction<any>>
) {
  let updatedSaved;
  if (save) {
    updatedSaved = [...previousData, item];
  } else {
    // remove
    updatedSaved = previousData.filter((e: any) => e !== item);
  }

  setFunction(updatedSaved);
  await setAsync(key, JSON.stringify(updatedSaved));
}
