import { StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 46,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.mediumPurple
  },
  text: {
    flex: 1,
    ...fonts.style.medium
  }
});
