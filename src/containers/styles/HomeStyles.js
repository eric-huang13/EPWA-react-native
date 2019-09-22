import { StyleSheet } from "react-native";

import { colors, fonts, fragments } from "../../themes";

export default StyleSheet.create({
  screenContainer: {
    ...fragments.screen.screenContainer,
    backgroundColor: colors.white
  },
  imageBackground: {
    width: "100%",
    height: "100%"
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  },
  text: {
    ...fonts.style.h2,
    marginBottom: 25,
    color: colors.white,
    textAlign: "center"
  },
  btn: {
    width: 250,
    marginBottom: 25
  }
});
