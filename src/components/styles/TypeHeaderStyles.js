import { StyleSheet } from "react-native";
import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 15,
    minHeight: 70
  },
  containerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  },
  iconContainer: {
    marginRight: 20
  },
  title: {
    flex: 1,
    ...fonts.style.normal
  },
  highlightedLabel: {
    ...fonts.style.h1,
    marginRight: 5
  },
  label: {
    ...fonts.style.normal,
    marginRight: 5
  }
});
