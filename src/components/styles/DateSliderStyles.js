import { StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  date: {
    ...fonts.style.h4,
    color: colors.nero
  },
  arrowLeft: {
    marginRight: 30
  },
  arrowRight: {
    marginLeft: 30
  }
});
