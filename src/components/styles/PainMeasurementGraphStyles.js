import { StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: 20,
    borderBottomColor: colors.darkFilter,
    borderBottomWidth: 1
  },
  title: {
    marginLeft: 20,
    ...fonts.style.h4,
    flexGrow: 1
  },
  score: {
    color: colors.egyptianBlue,
    ...fonts.style.h2
  }
});
