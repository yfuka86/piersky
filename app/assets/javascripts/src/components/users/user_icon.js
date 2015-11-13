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
    let str = user.name || user.email;
    let url = user.imageUrl
    let style = url ? {background: `url(${url})`, 'background-size': 'cover'} : {}

    return (
      <span className={'simple-user-icon ' + Constants.colorByKey(str)} style={style}>
        {url ? '' : str[0].toUpperCase()}
      </span>
    );
  }

}

export default UserIcon;
