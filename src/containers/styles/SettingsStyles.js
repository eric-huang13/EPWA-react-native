import { StyleSheet } from "react-native";

import { colors, fonts, fragments } from "../../themes";

export default StyleSheet.create({
  screenContainer: {
    ...fragments.screen.screenContainer,
    backgroundColor: colors.white
  },
  photoContainer: {
    height: 140,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10
  },
  langContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 90,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  },
  field: {
    justifyContent: "center",
    paddingTop: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  },
  fieldLabel: {
    ...fonts.style.label
  },
  fieldInput: {
    marginLeft: 10
  },
  buttonContainer: {
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10
  },
  button: {
    width: 240
  }
});
