import { StyleSheet } from "react-native";
import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  },
  photoContainer: {
    borderRadius: 50,
    marginRight: 15,
    overflow: "hidden"
  },
  placeholderContainer: {
    borderRadius: 50 / 2,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.mediumPurple
  },
  photoSize: {
    height: 50,
    width: 50
  },
  text: {
    flex: 1,
    paddingRight: 5,
    ...fonts.style.h4
  },
  icon: {}
});
