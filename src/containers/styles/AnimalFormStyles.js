import { Dimensions, StyleSheet } from "react-native";

import { colors } from "../../themes";

const windowWidth = Dimensions.get("window").width;
const paddingHorizontal = 20;

export default StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: colors.white
  },
  photoContainer: {
    minHeight: 140,
    backgroundColor: colors.mediumPurple,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10
  },
  datePickerBox: {
    justifyContent: "center",
    width: windowWidth - paddingHorizontal * 2,
    paddingLeft: 10,
    height: 46,
    borderWidth: 1,
    borderRadius: 28,
    borderColor: colors.mediumPurple
  },
  datePickerText: {
    color: "#C7C7CD",
    fontSize: 14
  },
  datePickerTextActive: {
    color: colors.nero
  },
  roundedBorderInput: {
    borderWidth: 1,
    borderRadius: 28,
    borderColor: colors.mediumPurple
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20
  }
});
