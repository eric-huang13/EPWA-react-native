import { StyleSheet } from "react-native";

import { colors, fonts, fragments } from "../../themes";

export default StyleSheet.create({
  ...fragments.screen,
  imageBackground: {
    width: "100%",
    height: "100%"
  },
  screen: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkFilter
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    marginBottom: 20
  },
  logoText: {
    marginBottom: 30
  },
  description: {
    ...fonts.style.h4,
    color: colors.white,
    marginBottom: 30
  },
  actionContainer: {
    paddingHorizontal: 30
  },
  painMeasurementBtn: {
    marginBottom: 20,
    minWidth: 200,
    backgroundColor: colors.egyptianBlue
  },
  loginBtn: {
    minWidth: 200,
    marginBottom: 20
  }
});
