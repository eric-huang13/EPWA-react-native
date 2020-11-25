import React, { Component } from "react";
import T from "prop-types";
import DateTimePicker from "react-native-modal-datetime-picker";

class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };
  }

  onConfirm = date => {
    this.hide();

    this.props.onPick(date);
  };

  onCancel = () => {
    this.hide();
  };

  show = () => this.setState({ isVisible: true });

  hide = () => this.setState({ isVisible: false });

  // TODO: Make Android DatePicker to use app's pink color instead of default blue
  render() {
    const { locale, t, ...rest } = this.props;

    const titleKey =
      rest.mode === "time" ? "datePicker.titleTime" : "datePicker.titleDate";

    return (
      <DateTimePicker
        isVisible={this.state.isVisible}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        cancelTextIOS={t("datePicker.cancel")}
        confirmTextIOS={t("datePicker.confirm")}
        titleIOS={t(titleKey)}
        locale={locale === "en" ? "en_GB" : locale}
        is24Hour={true}
        datePickerContainerStyleIOS= {{
          justifyContent: 'center',
          paddingLeft: '3%',
        }}
        confirmTextStyle={{
          paddingRight: '3%',
        }}
        titleStyle={{
          paddingRight: '5%',
        }}
        {...rest}
      />
    );
  }
}

DatePicker.propTypes = {
  locale: T.string,
  t: T.func,
  onPick: T.func
};

export default DatePicker;
