// Array of available languages - used with Picker component
// TODO: Solve issue completely instead of relying on workarounds
// Workaround - on Android if the new active item happen to no be the first item in the array, onValueChange will be triggered with value of first item of the array
// The result is that if user changes from EN to NL it will change and after rerender it will change back to EN.
export const getLanguageSelectItems = (language, t) => {
  let languageData = [
    { label: t("language.en"), value: "en", key: "en" },
    { label: t("language.nl"), value: "nl", key: "nl" },
    { label: t("language.de"), value: "de", key: "de" },
    { label: t("language.fr"), value: "fr", key: "fr" }
  ];
  switch (language) {
    case "en":
      break;
    case "nl":
      languageData = [
        { label: t("language.nl"), value: "nl", key: "nl" },
        { label: t("language.en"), value: "en", key: "en" },
        { label: t("language.de"), value: "de", key: "de" },
        { label: t("language.fr"), value: "fr", key: "fr" }
      ];
      break;
    case "de":
      languageData = [
        { label: t("language.de"), value: "de", key: "de" },
        { label: t("language.en"), value: "en", key: "en" },
        { label: t("language.nl"), value: "nl", key: "nl" },
        { label: t("language.fr"), value: "fr", key: "fr" }
      ];
      break;
    case "fr":
      languageData = [
        { label: t("language.fr"), value: "fr", key: "fr" },
        { label: t("language.en"), value: "en", key: "en" },
        { label: t("language.nl"), value: "nl", key: "nl" },
        { label: t("language.de"), value: "de", key: "de" }
      ];
      break;
    default:
      break;
  }
  return languageData;
};

export default {
  getLanguageSelectItems
};
