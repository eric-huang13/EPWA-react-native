import { StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 110
  },
  iconWrapper: {
    borderRadius: 50,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "flex-end",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { height: 3, width: 0 },
    elevation: 1
  },
  text: {
    ...fonts.style.cta,
    color: colors.white,
    textAlign: "center"
  }
});
