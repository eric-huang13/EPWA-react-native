import { StyleSheet } from "react-native";

import { colors } from "../../themes";

const dotFragment = {
  width: 10,
  height: 10,
  borderRadius: 50,
  marginRight: 5
};

export default StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  dot: {
    ...dotFragment,
    opacity: 0.5,
    backgroundColor: colors.nero
  },
  activeDot: {
    ...dotFragment,
    opacity: 0.8,
    backgroundColor: colors.white
  },
  hiddenDot: {
    ...dotFragment,
    opacity: 0,
    backgroundColor: colors.white
  }
});
