import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";

import HomeScreen from "../containers/Home";
import AboutScreen from "../containers/About";
import AnimalFormScreen from "../containers/AnimalForm";
import AnimalFormInfoScreen from "../containers/AnimalFormInfo";
import AnimalProfileScreen from "../containers/AnimalProfile";
import AnimalCaregiverScreen from "../containers/AnimalCaregiver";
import SignInScreen from "../containers/SignIn";
import SignUpScreen from "../containers/SignUp";
import LogoutScreen from "../containers/Logout";
import SettingsScreen from "../containers/Settings";
import SettingsUpdatePasswordScreen from "../containers/SettingsUpdatePassword";
import SettingsDeleteAccountScreen from "../containers/SettingsDeleteAccount";
import StartUpScreen from "../containers/StartUp";
import ForgotPasswordScreen from "../containers/ForgotPassword";
import AuthLoadingScreen from "../containers/AuthLoading";
import DiaryScreen from "../containers/Diary";
import DiaryCopyScreen from "../containers/DiaryCopy";
import DiaryExerciseFormScreen from "../containers/DiaryExerciseForm";
import DiaryExerciseFormInfoScreen from "../containers/DiaryExerciseFormInfo";
import DiaryHousingFormScreen from "../containers/DiaryHousingForm";
import DiaryHousingFormInfoScreen from "../containers/DiaryHousingFormInfo";
import DiaryFeedingFormScreen from "../containers/DiaryFeedingForm";
import DiaryFeedingFormInfoScreen from "../containers/DiaryFeedingFormInfo";
import DiaryMedicationFormScreen from "../containers/DiaryMedicationForm";
import DiaryPainMeasurementFormScreen from "../containers/DiaryPainMeasurementForm";
import DiaryPainMeasurementInfoScreen from "../containers/PainMeasurementStartInfo";
import DiaryMedicationFormInfoScreen from "../containers/DiaryMedicationFormInfo";
import DiaryAppointmentFormScreen from "../containers/DiaryAppointmentForm";
import DiaryShareFormScreen from "../containers/DiaryShareScreen";
import RedirectToPainMeasurementScreen from "../containers/RedirectToPainMeasurement";
import WelfareScreen from "../containers/WelfareInfo";

import PainMeasurementScreen from "../containers/PainMeasurement";
import PainMeasurementOverviewScreen from "../containers/PainMeasurementOverview";
import PainMeasurementDetailsScreen from "../containers/PainMeasurementDetails";
import PPIDScreen from "../containers/PPID";

import EPWAscreen from "../containers/EPWA";

import CustomDrawerContent from "../components/CustomDrawerContent";

import { colors, fonts } from "../themes";

export const defaultHeaderStyling = {
  headerTintColor: colors.black,
  headerStyle: {
    backgroundColor: colors.white
  },
  headerTitleStyle: {
    ...fonts.style.h4,
    fontWeight: "400"
  }
};

/*
  When a screen is directly under DrawerNavigator
  it's not possible to modify header bar from the screen
  const AppStack = DrawerNavigator({
    Home: { screen: HomeScreen }
  });
  Wrapping every screen
  in seperate StackNavigator to make it possible
*/

const AuthStack = createStackNavigator(
  {
    StartUp: StartUpScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    ForgotPassword: ForgotPasswordScreen,
    painMeasurement: PainMeasurementScreen
  },
  {
    initialRouteName: "StartUp",
    defaultNavigationOptions: {
      ...defaultHeaderStyling
    }
  }
);

// TODO: Make all screens have white background color so that if iOS user scrolls the screen the grey background doesn't show
// Navigators and screens should not share names - for some reason navigation params are not passed then
const AppStack = createDrawerNavigator(
  {
    StableNavigator: {
      screen: createStackNavigator(
        {
          Stable: HomeScreen,
          AnimalForm: AnimalFormScreen,
          AnimalFormInfo: AnimalFormInfoScreen,
          AnimalProfile: AnimalProfileScreen,
          AnimalCaregiver: AnimalCaregiverScreen
        },
        {
          initialRouteName: "Stable",
          defaultNavigationOptions: {
            ...defaultHeaderStyling
          }
        }
      )
    },
    DiaryNavigator: {
      screen: createStackNavigator(
        {
          Diary: DiaryScreen,
          DiaryCopy: DiaryCopyScreen,
          DiaryExerciseForm: DiaryExerciseFormScreen,
          DiaryExerciseFormInfo: DiaryExerciseFormInfoScreen,
          DiaryHousingForm: DiaryHousingFormScreen,
          DiaryHousingFormInfo: DiaryHousingFormInfoScreen,
          DiaryFeedingForm: DiaryFeedingFormScreen,
          DiaryFeedingFormInfo: DiaryFeedingFormInfoScreen,
          DiaryMedicationForm: DiaryMedicationFormScreen,
          DiaryMedicationFormInfo: DiaryMedicationFormInfoScreen,
          DiaryPainMeasurementForm: DiaryPainMeasurementFormScreen,
          PainMeasurementInfo: DiaryPainMeasurementInfoScreen,
          painMeasurement: PainMeasurementScreen,
          PainMeasurementOverview: PainMeasurementOverviewScreen,
          PainMeasurementDetails: PainMeasurementDetailsScreen,
          DiaryAppointmentForm: DiaryAppointmentFormScreen,
          DiaryShareForm: DiaryShareFormScreen
        },
        {
          initialRouteName: "Diary",
          defaultNavigationOptions: {
            ...defaultHeaderStyling
          }
        }
      )
    },
    PainMeasurementNavigator: {
      screen: RedirectToPainMeasurementScreen
    },
    WelfareNavigator: {
      screen: createStackNavigator(
        {
          Syndromes: WelfareScreen
        },
        {
          defaultNavigationOptions: {
            ...defaultHeaderStyling
          }
        }
      )
    },
    SyndromesNavigator: {
      screen: createStackNavigator(
        {
          Syndromes: PPIDScreen
        },
        {
          defaultNavigationOptions: {
            ...defaultHeaderStyling
          }
        }
      )
    },
    EpwaphotouploadNavigator: {
      screen: createStackNavigator(
        {
          Epwaphotoupload: EPWAscreen
        },
        {
          defaultNavigationOptions: {
            ...defaultHeaderStyling
          }
        }
      )
    },
    SettingsNavigator: {
      screen: createStackNavigator(
        {
          Settings: SettingsScreen,
          SettingsUpdatePassword: SettingsUpdatePasswordScreen,
          SettingsDeleteAccount: SettingsDeleteAccountScreen
        },
        {
          defaultNavigationOptions: {
            ...defaultHeaderStyling
          }
        }
      )
    },
    AboutNavigator: {
      screen: createStackNavigator(
        {
          About: AboutScreen
        },
        {
          defaultNavigationOptions: {
            ...defaultHeaderStyling
          }
        }
      )
    },
    LogoutNavigator: {
      screen: createStackNavigator(
        {
          Logout: LogoutScreen
        },
        {
          defaultNavigationOptions: {
            ...defaultHeaderStyling
          }
        }
      )
    }
  },
  { contentComponent: CustomDrawerContent, unmountInactiveRoutes: true }
);

const RootStack = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default RootStack;
