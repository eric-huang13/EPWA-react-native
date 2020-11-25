import { StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: colors.mediumPurple
  },
  headerRow: {
    flexDirection: "row"
  },
  headerLeftIcon: {
    marginHorizontal: 20
  },
  headerContent: {
    flex: 1,
    alignItems: "center"
  },
  headerPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20
  },
  headerText: {
    ...fonts.style.h4,
    color: colors.white,
    width: "100%",
    textAlign: "center"
  },
  footerText: {
    ...fonts.style.span,
    color: colors.nero,
    marginTop: 40,
    width: "100%",
    textAlign: "center"
  },
  footerLogo: {
    width: "30%",
    height: 100
  },
  headerRightIcon: {
    marginHorizontal: 20
  }
});
