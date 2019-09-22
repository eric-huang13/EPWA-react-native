import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {compose, pickAll} from 'ramda';
import {translate} from 'react-i18next';
import {withFormik} from 'formik';
import {hoistStatics} from 'recompose';

import {defaultHeaderStyling} from '../navigation';
import PPIDStartScreen from './PPIDStart';
import PPIDQuestionScreen from './PPIDQuestion';
import PPIDResultScreen from './PPIDResult';

const PPIDNavigator = createStackNavigator(
  {
    PPIDStart: PPIDStartScreen,
    PPIDQuestionA: PPIDQuestionScreen,
    PPIDQuestionB: PPIDQuestionScreen,
    PPIDQuestionC: PPIDQuestionScreen,
    PPIDQuestionD: PPIDQuestionScreen,
    PPIDQuestion1: PPIDQuestionScreen,
    PPIDQuestion2: PPIDQuestionScreen,
    PPIDQuestion3: PPIDQuestionScreen,
    PPIDQuestion4: PPIDQuestionScreen,
    PPIDQuestion5: PPIDQuestionScreen,
    PPIDQuestion6: PPIDQuestionScreen,
    PPIDQuestion7: PPIDQuestionScreen,
    PPIDQuestion8: PPIDQuestionScreen,
    PPIDQuestion9: PPIDQuestionScreen,
    PPIDQuestion10: PPIDQuestionScreen,
    PPIDResult: PPIDResultScreen,
  },
  {
    initialRouteName: 'PPIDStart',
    navigationOptions: {
      ...defaultHeaderStyling,
    },
  },
);

class PPIDCheck extends Component {
  static router = PPIDNavigator.router;
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
      <PPIDNavigator
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
)(PPIDCheck);
