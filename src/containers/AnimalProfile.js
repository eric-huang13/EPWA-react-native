import React, { Component } from "react";
import T from "prop-types";
import {
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  View,
  Text
} from "react-native";
import { HeaderBackButton } from "react-navigation-stack";
import { compose } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { format, parse } from "date-fns";
import { hoistStatics } from "recompose";
import { capitalize } from "lodash";

import Modal from 'react-native-modalbox';
import Button from "../components/Button";
import Field from "../components/Field";
import FieldText from "../components/FieldText";
import Icon from "../components/Icon";
import withAlertDropdown from "../components/withAlertDropdown";

import s from "./styles/AnimalProfileStyles";

import { colors, fonts } from "../themes";
import { deleteAnimal } from "../actions/animals";
import { getAnimalCaregiver, deleteAnimalCaregiver } from "../actions/caregiver";
import { getToken } from "../selectors/auth";
import iconMap from "../constants/iconMap";
import CircleButton from "../components/CircleButton";

class AnimalProfile extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.getParam("title", ""),
    headerLeft: (
      <HeaderBackButton
        title={screenProps.t.t("headerBar.back")}
        tintColor={colors.nero}
        onPress={() => navigation.popToTop()}
      />
    ),
    headerRight: (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 15, right: 5 }}
          style={{ marginRight: 30 }}
          onPress={() => navigation.getParam("moveToDiary")()}
        >
          <Icon name={iconMap.calendar} size={20} color={colors.nero} />
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 15, right: 30 }}
          style={{ marginRight: 20 }}
          onPress={() => navigation.getParam("onRightIconPress")()}
        >
          <Icon name={iconMap.edit} size={20} color={colors.nero} />
        </TouchableOpacity>
      </View>
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      shareUserName: "",
      shareUserId: ""
    }

    const selectedHorse = this.getSelectedAnimal();

    if (!selectedHorse) {
      props.navigation.navigate("Stable");
    }

    props.navigation.setParams({
      onRightIconPress: this.onEdit,
      moveToDiary: this.moveToDiary,
      title: selectedHorse.name
    });
  }

  componentDidMount() {
    const { alertDropdown, t } = this.props;

    this.props.dispatch(
      getAnimalCaregiver({
        animal_id: this.getSelectedAnimal().id,
        showNotification: alertDropdown,
        translate: t
      })
    );
  }

  onEdit = () => {
    this.props.navigation.navigate("AnimalForm", {
      initialValue: this.getSelectedAnimal()
    });
  };

  onDelete = () => {
    const { alertDropdown, t } = this.props;

    this.props.dispatch(
      deleteAnimal({
        payload: this.getSelectedAnimal().id,
        showNotification: alertDropdown,
        translate: t
      })
    );
  };

  getSelectedAnimal = () => {
    const { navigation, data } = this.props;

    const animalId = navigation.getParam("id");
    const selectedHorse = data.find(animal => animal.id === animalId);

    return selectedHorse;
  };

  moveToDiary = () => {
    const { id } = this.getSelectedAnimal();
    this.props.navigation.navigate("Diary", { id });
  };

  share = () => {
    const animal = this.getSelectedAnimal();
    Share.share({
      title: this.props.t("shareAppTitleAnimalProfile"),
      message: this.props.t("shareAppContentAnimalProfile", {
        animalName: animal.name
      }),
      url: this.props.t("shareAppUrl")
    });
  };

  addCaregiver = () => {
    const { id, pictureUrl, type, name } = this.getSelectedAnimal();
    this.props.navigation.navigate("AnimalCaregiver", { id, pictureUrl, type, name });
  };

  onCaregiverDelete = (share_id) => {
    const{alertDropdown, t} = this.props;

    this.props.dispatch(
      deleteAnimalCaregiver({
            share_id: share_id,
            animal_id: this.getSelectedAnimal().id,
            showNotification: alertDropdown,
            translate: t
        })
    );

    this.refs.removeModal.close();
  };

  onRemove = (shareUserId, shareUserName) => {
    this.setState({shareUserName: shareUserName});
    this.setState({shareUserId: shareUserId});

    this.refs.removeModal.open();
  };

  render() {
    if (!this.getSelectedAnimal()) {
      return null;
    }

    const { authToken, t } = this.props;
    const caregiver = this.props.caregiver.data;
    
    const {
      birthdate,
      competitionLevel,
      height,
      weight,
      name,
      pictureUrl,
      breed,
      sex,
      roles,
      disciplines,
      type,
      notes
    } = this.getSelectedAnimal();

    let caregiver_exist = true;
    let caregiver_count = 0;

    if(!caregiver.length) {
      caregiver_exist = false;
    }

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView contentContainerStyle={s.screenContainer}>
          {pictureUrl ? (
            <View style={s.photoContainer}>
              <Image
                source={{
                  uri: pictureUrl,
                  headers: { Authorization: `Bearer ${authToken}` }
                }}
                style={s.imageContainer}
              />
            </View>
          ) : (
            <View style={s.photoContainer}>
              <Icon
                name={type === "horse" ? iconMap.horse3 : "donkey"}
                size={50}
                color={colors.white}
              />
            </View>
          )}
          <Field showBorder label={t("name")}>
            <FieldText style={s.fieldText}>{name}</FieldText>
          </Field>
          <Field showBorder label={t("birthdate")}>
            <FieldText style={s.fieldText}>
              {/* Convert date to number first otherwise you'll get "Invalid date" */}
              {birthdate ? format(parse(+birthdate), t("dateFormat")) : ""}
            </FieldText>
          </Field>
          <Field showBorder label={t("breed")}>
            <FieldText style={s.fieldText}>
              {breed &&
                breed
                  .map(singleBreed =>
                    t(`animalBreeds.${type}.${singleBreed}`, {
                      defaultValue: singleBreed
                    })
                  )
                  .join(", ")}
            </FieldText>
          </Field>
          <Field showBorder label={t("sex")}>
            <FieldText style={s.fieldText}>
              {sex && t(`animalGenders.${type}.${sex}`)}
            </FieldText>
          </Field>
          <Field showBorder label={t("animalHeight")}>
            <FieldText style={s.fieldText}>
              {height && capitalize(`${height} cm`)}
            </FieldText>
          </Field>
          <Field showBorder label={t("animalWeight")}>
            <FieldText style={s.fieldText}>
              {weight && capitalize(`${weight} kg`)}
            </FieldText>
          </Field>
          <Field showBorder label={t("roles")}>
            <FieldText style={s.fieldText}>
              {roles &&
                roles.map(role => t(`animalRoles.${type}.${role}`)).join(", ")}
            </FieldText>
          </Field>
          {type === "horse" && (
            <View>
              <Field showBorder label={t("disciplines")}>
                <FieldText style={s.fieldText}>
                  {disciplines &&
                    disciplines
                      .map(discipline =>
                        t(`animalDisciplines.${type}.${discipline}`)
                      )
                      .join(", ")}
                </FieldText>
              </Field>
              <Field showBorder label={t("horseCompetitionLevel")}>
                <FieldText style={s.fieldText}>
                  {competitionLevel &&
                    t(`animalCompetitionLevels.${type}.${competitionLevel}`)}
                </FieldText>
              </Field>
            </View>
          )}
          <Field showBorder label={t("particularities")}>
            <FieldText lines={4} style={s.fieldText}>
              {notes}
            </FieldText>
          </Field>
          {!caregiver_exist &&
            <View style={s.caregiver_field_containter}>
              <View style={s.caregiver_leftside_container}>
                <Text style={s.caregiver_label_style}>
                  {t("caregiverTitle")}
                </Text>
                <FieldText lines={1} style={[s.caregiver_text_field, {fontWeight: 'normal'}]}>
                  {t("addCaregiverDesc")}
                </FieldText>
              </View>
              <View style={s.caregiver_button_container}>
                <CircleButton onPress={() => {this.addCaregiver()}} containerStyles={[s.caregiver_circlebutton_style, {backgroundColor: colors.mediumPurple}]} >
                  <Icon size={15} name={iconMap.plus} color={colors.white} />
                </CircleButton>
              </View>
            </View>
          }
          {caregiver_exist && 
            caregiver.map((c_giver) => (
              <View key={caregiver_count++} style={s.caregiver_field_containter}>
                <View style={s.caregiver_leftside_container}>
                  {caregiver_count == 1 &&
                    <Text style={s.caregiver_label_style}>
                      {t("caregiverTitle")}
                    </Text>
                  }
                  <FieldText lines={1} style={caregiver_count > 1? s.caregiver_text_field_style: s.caregiver_text_field}>
                    { c_giver.accepted && c_giver.invitedName !== " "? c_giver.invitedName : c_giver.userShareEmail }
                  </FieldText>
                </View>
                <View style={s.caregiver_button_container}>
                  {c_giver.accepted == 1 &&
                    <CircleButton
                      onPress={() => {this.onRemove(c_giver.id, c_giver.invitedName == " "? c_giver.userShareEmail: c_giver.invitedName)}}
                      containerStyles={[s.caregiver_circlebutton_style, {backgroundColor: colors.white}]}
                    >
                      <Icon size={15} name={iconMap.garbage} color={colors.harleyDavidsonOrange} />
                    </CircleButton>
                  }
                  {!c_giver.accepted &&
                    <Text>
                      {t("caregiver_pending")}
                    </Text>
                  }
                </View>
              </View>
            ))
          }
          {caregiver_exist &&
            caregiver.length < 5 &&
            <View style={s.caregiver_field_containter}>
              <View style={s.caregiver_leftside_container}>
                <FieldText lines={1} style={[caregiver_count > 0? s.caregiver_text_field_style: s.caregiver_text_field, {fontWeight: 'normal'}]}>
                  {t("addCaregiverDesc")}
                </FieldText>
              </View>
              <View style={s.caregiver_button_container}>
                <CircleButton onPress={() => {this.addCaregiver()}} containerStyles={[s.caregiver_circlebutton_style, {backgroundColor: colors.mediumPurple}]}>
                  <Icon size={15} name={iconMap.plus} color={colors.white}/>
                </CircleButton>
              </View>
            </View>
          }
          <View style={s.buttonContainer}>
            <Button
              label={t("remove")}
              backgroundColor={colors.white}
              textColor={colors.harleyDavidsonOrange}
              iconName={iconMap.garbage}
              iconColor={colors.harleyDavidsonOrange}
              style={s.remove_button_style}
              onPress={() => {
                Alert.alert(t("deleteAnimal"), t("deleteAnimalMessage"), [
                  { text: t("cancel"), style: "cancel" },
                  { text: t("remove"), onPress: () => this.onDelete() }
                ]);
              }}
            />
            <CircleButton onPress={this.share} containerStyles={s.share_button_style}>
              <Icon size={20} name={iconMap.share} color={colors.white}/>
            </CircleButton>
          </View>
        </ScrollView>
        <Modal
          style={s.caregiver_modal_style}
          position={"center"}
          ref={"removeModal"}
        >
          <CircleButton onPress={() => {this.refs.removeModal.close()}} containerStyles={s.modal_close_button_style}>
              <Icon size={14} name={iconMap.close} color={colors.black}/>
          </CircleButton>
          <Text style={s.caregiver_modal_text_style}>
            {t("prefixRemoveMessage")}
          </Text>
          <Text style={[s.caregiver_modal_text_style, {fontWeight: "bold"}]}>
            {this.state.shareUserName}
          </Text>
          <Text style={s.caregiver_modal_text_style}>
            {t("sufixRemoveMessage")}
          </Text>
          <Button
            label={t("remove")}
            backgroundColor={colors.mediumPurple}
            textColor={colors.white}
            style={s.modal_remove_button_style}
            onPress={() => {this.onCaregiverDelete(this.state.shareUserId)}}
          />
        </Modal>
      </View>
    );
  }
}

AnimalProfile.propTypes = {
  alertDropdown: T.func,
  authToken: T.string,
  data: T.arrayOf(
    T.shape({
      id: T.number,
      type: T.string,
      name: T.string,
      pictureUrl: T.string,
      birthdate: T.oneOfType([T.number, T.string]),
      breed: T.arrayOf(T.string),
      sex: T.string,
      height: T.number,
      weight: T.number,
      competitionLevel: T.string,
      notes: T.string
    })
  ),
  t: T.func,
  dispatch: T.func
};

const mapStateToProps = state => ({
  authToken: getToken(state),
  data: state.animals,
  caregiver: state.caregiver
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    translate("root"),
    withAlertDropdown
  )
)(AnimalProfile);
