import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import { Platform, NativeModules } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { take } from "ramda";

import en from "../i18n/en.json";
import nl from "../i18n/nl.json";
import de from "../i18n/de.json";
import fr from "../i18n/fr.json";
// import reactotron from "reactotron-react-native";

const languageDetector = {
  type: "languageDetector",
  async: true, // flags below detection to be async
  detect: callback =>
    AsyncStorage.getItem("reduxPersist:language").then(persistedState => {
      const savedLocale = persistedState ? JSON.parse(persistedState) : false;

      if (savedLocale) {
        // For some reason redux-persist wraps json values in additional quotation marks
        callback(savedLocale.replace(/"/g, ""));
      } else {
        let fullLocale =
          Platform.OS === "android"
            ? NativeModules.I18nManager.localeIdentifier
            : NativeModules.SettingsManager.settings.AppleLocale;
        if (fullLocale == undefined) {
          fullLocale = "en"; // default language
        }
        const result = take(2, fullLocale.toLowerCase().replace("_", "-"));
        callback(result);
      }
    }),
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: "en",

    resources: {
      en: {
        ...en
      },
      nl: {
        ...nl
      },
      de: {
        ...de
      },
      fr: {
        ...fr
      }
    },

    // have a common namespace used around the full app
    ns: ["root"],
    defaultNS: "root",

    debug: false,

    // cache: {
    //   enabled: true
    // },

    react: {
      wait: true
    },

    interpolation: {
      escapeValue: false // not needed for react as it does escape per default to prevent xss!
    }
  });

export default i18n;
