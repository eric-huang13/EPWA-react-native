import { StyleSheet } from "react-native";
import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    borderWidth: 2,
    borderColor: colors.lima,
    borderStyle: "dotted"
  },
  text: {
    ...fonts.style.h1,
    color: colors.lima
  }
});
