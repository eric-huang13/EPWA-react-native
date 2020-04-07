import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {compose, pickAll} from 'ramda';
import {translate} from 'react-i18next';
import {withFormik} from 'formik';
import {hoistStatics} from 'recompose';

import {defaultHeaderStyling} from '../navigation';
import EPWADescriptionScreen from './EPWADescription';
import EPWACropImageDescScreen from './EPWACropImageDesc';
import EPWATakePhotoScreen from './EPWATakePhoto';
import EPWAPhotoIsGoodScreen from './EPWAPhotoIsGood';
import EPWACropImageScreen from './EPWACropImage';
import EPWACropImageResultScreen from './EPWACropImageResult';

const EPWANavigator = createStackNavigator(
  {
    EPWADescription: EPWADescriptionScreen,
    EPWACropImageDesc: EPWACropImageDescScreen,
    EPWATakePhoto: EPWATakePhotoScreen,
    EPWAPhotoIsGood: EPWAPhotoIsGoodScreen,
    EPWACropImageA: EPWACropImageScreen,
    EPWACropImageB: EPWACropImageScreen,
    EPWACropImageC: EPWACropImageScreen,
    EPWACropImageD: EPWACropImageScreen,
    EPWACropImageResult: EPWACropImageResultScreen
  },
  {
    initialRouteName: 'EPWADescription',
    navigationOptions: {
      ...defaultHeaderStyling,
    },
  },
);

class EPWACheck extends Component {
  static router = EPWANavigator.router;
  static navigationOptions = {
    header: null,
  };

  render() {
    const {t} = this.props;
    const formProps = pickAll(['resetForm', 'setFieldValue', 'values'])(
      this.props,
    );

    const screenProps = {
      form: {
        ...formProps,
      },
      t,
    };

    return (
      <EPWANavigator
        navigation={this.props.navigation}
        screenProps={screenProps}
      />
    );
  }
}

const formikOptions = {
  handleSubmit: () => true,
  mapPropsToValues: () => {},
};

export default hoistStatics(
  compose(
    translate('root'),
    withFormik(formikOptions),
  ),
)(EPWACheck);
