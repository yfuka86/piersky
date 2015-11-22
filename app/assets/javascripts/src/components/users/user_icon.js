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

    return (
      <span className={'simple-user-icon ' + Constants.colorByKey(str)}>
        <img src={url} />
        <span className='icon-char'>
          {str[0].toUpperCase()}
        </span>
      </span>
    );
  }

}

export default UserIcon;
