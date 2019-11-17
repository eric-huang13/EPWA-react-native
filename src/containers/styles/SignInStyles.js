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
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 30
  },
  googleBtn: {
    marginRight: 10,
    minWidth: 120,
    justifyContent: "center"
  },
  facebookBtn: {
    minWidth: 120
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
  }
});
