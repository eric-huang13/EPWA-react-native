import { StyleSheet } from "react-native";
import { fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    minHeight: 70,
    justifyContent: "center"
  },
  text: {
    ...fonts.style.h4
  }
});
