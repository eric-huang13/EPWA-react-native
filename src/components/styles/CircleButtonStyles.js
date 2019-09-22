import { StyleSheet } from "react-native";
import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.nero,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { height: 3, width: 0 },
    elevation: 1
  }
});
