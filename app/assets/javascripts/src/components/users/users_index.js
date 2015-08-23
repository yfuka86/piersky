import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import Constants from '../../constants/app';

class UsersIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return _.extend({
    });
  }

  render() {
    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('webapp.users.index')}</p>
      </div>
    );
  }
}

export default UsersIndex;
