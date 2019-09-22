import { StyleSheet } from "react-native";

import { fragments } from "../../themes";

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
  button: {
    width: 240
  }
});
