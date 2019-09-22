import { StyleSheet } from "react-native";
import { colors } from "../../themes";

export default StyleSheet.create({
  touchable: { borderRadius: 28 },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    paddingHorizontal: 30,
    paddingVertical: 10
  },
  label: {
    flex: 1,
    textAlign: "center"
  }
});

export const btnFullWidth = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: colors.mediumPurple,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    marginVertical: 20
  }
});
