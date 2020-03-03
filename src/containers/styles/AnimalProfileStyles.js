import { Dimensions, StyleSheet } from "react-native";

import { colors } from "../../themes";

const windowWidth = Dimensions.get("window").width;
const paddingHorizontal = 20;

export default StyleSheet.create({
  screenContainer: {
    flex: 0,
    minHeight: "100%",
    backgroundColor: colors.white
  },
  photoContainer: {
    minHeight: 220,
    backgroundColor: colors.mediumPurple,
    alignItems: "center",
    justifyContent: "center"
    // paddingBottom: 10
  },
  fieldText: {
    width: windowWidth - paddingHorizontal * 3
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    minHeight: 62.7
  },
  imageContainer: {
    width: windowWidth,
    height: 220
  }
});
