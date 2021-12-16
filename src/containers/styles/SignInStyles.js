import { StyleSheet } from "react-native";

import { colors, fragments } from "../../themes";

export default StyleSheet.create({
  imageBackground: {
    width: "100%",
    height: "100%"
  },
  screenContainer: {
    ...fragments.screen.screenContainer,
    justifyContent: "center",
    alignItems: "center"
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  socialWrapper: {
    flexDirection: "column",
    marginBottom: 20
  },
  googleBtn: {
    marginTop: 15,
    minWidth: 240,
    justifyContent: "center"
  },
  facebookBtn: {
    marginTop: 15,
    minWidth: 240,
    justifyContent: "center"
  },
  appleBtn: {
    marginTop: 15,
    minWidth: 240,
    justifyContent: "center"
  },
  dividerText: {
    marginBottom: 60
  },
  forgottenPassword: {
    marginTop: 30,
    color: colors.white
  },
  register: {
    color: colors.white,
    marginBottom: 20
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
});
