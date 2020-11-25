/* eslint-disable global-require */

import {translate} from 'react-i18next';
import {Provider} from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import React from 'react';
import RNCalendarEvents from "react-native-calendar-events";
import { View} from 'react-native';

import './config/reactotronConfig';

// // Init localization service
import './config/i18n';

import NavigatorService from './services/navigator';
import RootStack from './navigation/index';

import createStore from './store/';

const {store} = createStore();

export const AlertDropdownContext = React.createContext('alertDropdown');

const NavStack = t => (
  // Capture reference to navigator in order to trigger navigation actions from redux-sagas
  <RootStack
    ref={navigatorRef => {
      NavigatorService.setContainer(navigatorRef);
    }}
    screenProps={{t}}
  />
);

// Wrapping a stack with translation hoc asserts we get new render on language change
// the hoc is set to only trigger rerender on languageChanged
const ReloadAppOnLanguageChange = translate('root', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(NavStack);

export default class App extends React.Component {
  showAlertDropdown = (...args) => {
    this.dropdown.alertWithType(...args);
  };

  async componentDidMount() {
    const status = await RNCalendarEvents.authorizationStatus();
    
    if (status !== "authorized" || status !== "undetermined") {
      RNCalendarEvents.authorizeEventStore()
        .then(auth => {
          // handle status
        })
        .catch(() => {
          alert("This app needs calendar access");
        });
    }
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          {/* Wait until fonts are loaded to prevent flash of unstyled content */}
          <AlertDropdownContext.Provider value={this.showAlertDropdown}>
            <ReloadAppOnLanguageChange />
          </AlertDropdownContext.Provider>
          <DropdownAlert
            ref={ref => (this.dropdown = ref)} // eslint-disable-line no-return-assign
          />
        </View>
      </Provider>
    );
  }
}
