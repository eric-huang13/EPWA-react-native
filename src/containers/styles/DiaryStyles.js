import { StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.white
  },
  scrollContainer: {
    flexGrow: 1
  },
  animalNameBevel: {
    ...fonts.style.h4,
    color: colors.black,
    paddingHorizontal: 5,
    position: "absolute",
    top: 101
  },
  animalName: {
    ...fonts.style.h4,
    color: colors.white,
    paddingHorizontal: 5,
    position: "absolute",
    bottom: 50
  },
  editIconContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: 50,
    paddingHorizontal: 20
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    minHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter,
    backgroundColor: "red"
  }
});
