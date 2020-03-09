import { StyleSheet } from "react-native";

import { colors, fonts, fragments } from "../../themes";

export default StyleSheet.create({
  screenContainer: {
    ...fragments.screen.screenContainer,
    backgroundColor: colors.white
  },
  titleStyle: {
    ...fonts.style.cta,
    color: colors.nero,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 30
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginBottom: 50
  },
  scrollViewContainerStyle: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingTop: 20,
    paddingHorizontal: 20
  },
  desc_text: {
    ...fonts.style.normal,
    color: colors.nero,
    lineHeight: 20,
    marginBottom: 30
  },
  cropDescImg: {
    width: "100%",
    resizeMode: 'contain',
    marginBottom: 10
  },
  photoContainer: {
    resizeMode: 'contain',
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10
  },
  buttonCropContainer: {
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10
  },
  button: {
    backgroundColor: "#AC76DB",
    width: 180
  },
  disabledbutton: {
    backgroundColor: "#D8D8D8",
    width: 180
  },
  checkedbtnStyle: {
    borderRadius: 2,
    borderColor: "#747474",
    borderWidth: 1
  },
  cropImageDescPhotoContainer: {
    resizeMode: 'contain',
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10
  },
  cropImageDescImg: {
    width: "85%",
    resizeMode: 'contain',
    marginBottom: 10
  },
  cropImageDescButtonContainer: {
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10
  },
  cropPhotoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10
  },
  cropImg: {
    resizeMode: 'contain',
    marginBottom: 10
  },
  photoIsGoodButtonContainer: {
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10
  },
  photoIsGoodLButton: {
    marginLeft: 25,
    backgroundColor: "#AC76DB",
    width: 120
  },
  photoIsGoodRButton: {
    marginRight: 25,
    backgroundColor: "#AC76DB",
    width: 120
  },
  cropImgLButton: {
    marginLeft: 15,
    backgroundColor: "#AC76DB",
    width: 140
  },
  cropImgRButton: {
    marginRight: 15,
    backgroundColor:"#AC76DB",
    width: 140
  },
  cropImgButtonContainer: {
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10
  }
});