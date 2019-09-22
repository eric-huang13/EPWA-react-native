import { StyleSheet } from "react-native";
import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  },
  iconContainer: {
    marginRight: 15,
    overflow: "hidden"
  },
  text: {
    flex: 1,
    ...fonts.style.h4
  },
  icon: {}
});
