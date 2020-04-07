import { Dimensions, StyleSheet } from "react-native";

import { colors, fonts } from "../../themes";

const windowWidth = Dimensions.get("window").width;
const paddingHorizontal = 20;

export default StyleSheet.create({
  screenContainer: {
    flex: 0,
    minHeight: "100%",
    backgroundColor: colors.white
  },
  photoContainer: {
    minHeight: 220,
    backgroundColor: colors.mediumPurple,
    alignItems: "center",
    justifyContent: "center"
    // paddingBottom: 10
  },
  fieldText: {
    width: windowWidth - paddingHorizontal * 3
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    minHeight: 62.7
  },
  imageContainer: {
    width: windowWidth,
    height: 220
  },
  caregiver_field_containter: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 7,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  },
  caregiver_leftside_container: {
    paddingLeft: 20,
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  caregiver_label_style: {
    flex: 1,
    paddingBottom: 10,
    color: colors.nero,
    ...fonts.style.label
  },
  caregiver_button_container: {
    paddingRight: 23,
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  caregiver_circlebutton_style: {
    height: 42,
    width: 42,
    shadowOpacity: 0.4,
  },
  caregiver_text_field_style: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 10
  },
  caregiver_text_field: {
    flex: 1,
    paddingLeft: 10
  },
  caregiver_textinput_style: {
    borderWidth: 1,
    borderRadius: 28,
    borderColor: colors.mediumPurple
  },
  caregiver_invite_button_style: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "60%",
    height: 46,
    marginBottom: 20
  },
  share_button_style: {
    height: 46,
    width: 46,
    shadowOpacity: 0,
    backgroundColor: colors.nero
  },
  remove_button_style: {
    width: "50%",
    borderWidth: 1,
    borderColor: colors.harleyDavidsonOrange
  }
});
