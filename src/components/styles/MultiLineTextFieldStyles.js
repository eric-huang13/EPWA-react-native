import { StyleSheet } from "react-native";

import { colors } from "../../themes";

export default StyleSheet.create({
  label: {
    marginBottom: 5
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 40,
    minHeight: 52,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.mediumPurple,
    marginRight: 5,
    paddingVertical: 15
  },
  fieldContainerHasError: {
    backgroundColor: colors.tomato
  },
  field: {
    width: "100%",
    paddingHorizontal: 10
  }
});
