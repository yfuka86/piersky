import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Constants from '../../constants/app';

import IdentityAction from '../../actions/identity';
import UserIcon from '../../components/users/user_icon';
import Loading from '../../components/common/loading';

class UserIdentities extends React.Component {
  static get defaultProps() {
    return {
      user: {}
    };
  }

  static get propTypes() {
    return {
      user: React.PropTypes.object
    };
  }

  componentDidMount() {

  }

  render() {

    return (

    );
  }
}

export default UserIdentities;
