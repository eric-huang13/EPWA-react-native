import AsyncStorage from "@react-native-community/async-storage";

class AsyncStorageUtil {
  static async getFromAsyncStorage(key) {
    return await AsyncStorage.getItem(key).then((response) => {
      return response;
    });
  }

  static async setInAsyncStorage(key, value) {
    await AsyncStorage.setItem(key, value).catch((err) => {});
  }

  static async removeFromAsyncstorage(key) {
    return await AsyncStorage.removeItem(key).then((response) => {
      return response;
    });
  }

  static async clearAllStorageElement() {
    return await AsyncStorage.clear().then((response) => {
      return response;
    });
  }
}
export default AsyncStorageUtil;
