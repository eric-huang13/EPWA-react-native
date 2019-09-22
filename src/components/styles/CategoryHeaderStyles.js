import { StyleSheet } from "react-native";
import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingLeft: 65,
    minHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  },
  text: {
    ...fonts.style.h4
  }
});
