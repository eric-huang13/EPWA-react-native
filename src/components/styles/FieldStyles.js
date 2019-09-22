import { Dimensions, StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

const windowWidth = Dimensions.get("window").width;
const paddingHorizontal = 20;

export default StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  },
  labelContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  leftLabel: {
    flex: 1,
    color: colors.nero,
    ...fonts.style.label
  },
  requiredFieldSymbol: {
    ...fonts.style.label,
    color: colors.mediumPurple
  },
  rightLabel: {
    ...fonts.style.label,
    color: colors.mediumPurple
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth - paddingHorizontal * 2
  }
});
