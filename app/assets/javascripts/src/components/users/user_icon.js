import React from 'react';
import _ from 'lodash';
import Constants from '../../constants/app';

class UserIcon extends React.Component {
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
    let user = this.props.user;
    return (
      <span className={'simple-user-icon ' + Constants.colorByKey(user.userName)}>
        {user.userName[0].toUpperCase()}
      </span>
    );
  }

}

export default UserIcon;
