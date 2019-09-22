import { StyleSheet } from "react-native";

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
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { height: 3, width: 0 },
    elevation: 1
  },
  textWrapper: {
    // position: "absolute"
  },
  text: {
    ...fonts.style.label,
    color: colors.white,
    textAlign: "center",
    minWidth: 80
  }
});
