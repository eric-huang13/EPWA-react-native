import { StyleSheet } from "react-native";
import { colors } from "../../themes";

export default StyleSheet.create({
  container: {
    backgroundColor: colors.egyptianBlue,
    borderRadius: 50,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { height: 3, width: 0 },
    elevation: 1
  }
});
