import { StyleSheet } from "react-native";
import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    minHeight: 70,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  },
  row: {
    flexDirection: "row",
    paddingLeft: 25,
    paddingRight: 15
  },
  icon: {
    marginRight: 26
  },
  title: {
    flex: 1,
    paddingRight: 5,
    ...fonts.style.normal
  },
  time: {
    marginRight: 5,
    ...fonts.style.normal
  },
  label: {
    ...fonts.style.normal,
    marginRight: 5
  },
  labelBig: {
    ...fonts.style.normal,
    fontSize: 32,
    marginRight: 5
  },
  note: {
    ...fonts.style.italic,
    paddingTop: 10,
    paddingLeft: 45
  }
});
