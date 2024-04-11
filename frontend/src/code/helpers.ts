import AsyncStorage from "@react-native-async-storage/async-storage";

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