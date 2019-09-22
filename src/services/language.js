// Array of available languages - used with Picker component
// TODO: Solve issue completely instead of relying on workarounds
// Workaround - on Android if the new active item happen to no be the first item in the array, onValueChange will be triggered with value of first item of the array
// The result is that if user changes from EN to NL it will change and after rerender it will change back to EN.
export const getLanguageSelectItems = (language, t) =>
  language === "en"
    ? [
        { label: t("language.en"), value: "en", key: "en" },
        { label: t("language.nl"), value: "nl", key: "nl" }
      ]
    : [
        { label: t("language.nl"), value: "nl", key: "nl" },
        { label: t("language.en"), value: "en", key: "en" }
      ];

export default {
  getLanguageSelectItems
};
