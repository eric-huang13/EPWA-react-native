import React from "react";
import T from "prop-types";
import { connect } from "react-redux";
import { withSafeTimeout } from "@hocs/safe-timers";
import { compose } from "ramda";

import { authCheckRequest } from "../actions/auth";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);

    if (props.isRehydrationDone) {
      this.checkAcessToken();
    }
  }

  componentDidMount() {
    if (this.props.isRehydrationDone) {
      this.checkAcessToken();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isRehydrationDone && this.props.isRehydrationDone) {
      this.checkAcessToken();
    }
  }

  checkAcessToken = () => {
    const { navigate } = this.props.navigation;

    if (this.props.accessToken) {
      navigate("Diary");
    } else {
      navigate("Auth");
    }
  };

  // Render any loading content that you like here
  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.auth.accessToken,
  isRehydrationDone: state.rehydration.done
});

const mapDispatchToProps = (dispatch) => ({
  triggerAuthCheck: () => dispatch(authCheckRequest())
});

AuthLoadingScreen.propTypes = {
  accessToken: T.string
};

export default compose(
  withSafeTimeout,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AuthLoadingScreen);
