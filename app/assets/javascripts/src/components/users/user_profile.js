import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link} from 'react-router';
import Constants from '../../constants/app';

import UserStore from '../../stores/user';

class UserProfile extends React.Component {
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

  render() {
    return (
      <div/>
    );
  }
}

export default UserProfile;
