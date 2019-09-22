import { Platform, StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center"
  },
  iconWrapper: {
    borderRadius: 56 / 2,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.white
  },
  activeIconWrapper: {
    // borderColor: colors.lima
  },
  text: {
    ...fonts.style.label,
    color: colors.white,
    textAlign: "center",
    opacity: 0.7,
    minWidth: 80
  },
  countWrapper: {
    position: "absolute",
    right: Platform.OS === "android" ? -7 : -10,
    top: Platform.OS === "android" ? -7 : -15,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32 / 2,
    backgroundColor: colors.egyptianBlue
  },
  countLabel: {
    ...fonts.style.cta,
    color: colors.white
  }
});
