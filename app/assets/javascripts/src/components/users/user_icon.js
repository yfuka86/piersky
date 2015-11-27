import React from 'react';
import _ from 'lodash';

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
    let name = user.identity;
    let url = user.imageUrl;

    return (
      <span className={'simple-user-icon ' + user.color}>
        <img src={url} />
        <span className='icon-char'>
          {name[0].toUpperCase()}
        </span>
      </span>
    );
  }

}

export default UserIcon;
