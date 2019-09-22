import { StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    minHeight: 70,
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomColor: colors.darkFilter,
    borderBottomWidth: 1
  },
  // Make sure text after the icon will be aligned no matter how wide the actual icon is
  iconContainer: {
    minWidth: 35
  },
  date: {
    marginLeft: 20,
    ...fonts.style.h4,
    fontSize: 20,
    flexGrow: 1
  },
  score: {
    color: colors.egyptianBlue,
    ...fonts.style.h2
  }
});
