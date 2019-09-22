import { StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    minHeight: 50,
    backgroundColor: colors.black
  },
  tabWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: colors.egyptianBlue
  },
  tab: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.egyptianBlue,
    opacity: 0.7
  },
  activeTab: {
    opacity: 1
  },
  activeBorder: {
    borderBottomColor: colors.lima
  },
  text: {
    ...fonts.style.normal,
    color: colors.white
  }
});
