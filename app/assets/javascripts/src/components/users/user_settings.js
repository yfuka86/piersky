import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link} from 'react-router';

import Constants from '../../constants/app';
import {parseErrors} from '../../utils/app_module';
import SessionStore from '../../stores/session';
import NotifierInForm from '../../components/common/notifier_in_form';

import UserStore from '../../stores/user';

class UserSettings extends React.Component {
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
      <div className='user-settings'>
        <p className='title'>User Settings</p>
        <p className='subtitle'>
          Set your account preferences here
        </p>
        <form onSubmit={this._onSubmit.bind(this)}>
          <NotifierInForm messages={this.state.messages} />
            return (
              <div className='field' key={user.uid} >
                <label>{I18n.t('webapp.invitations.new.label.email')}
                <input type='email'
                       autoFocus={index === users.length - 1}
                       placeholder='name@domain.com'
                       value={_.find(users, (stateUser) => {return stateUser.uid === user.uid}).email}
                       disabled={this.state.syncing ? 'disabled' : false}
                       onChange={this._changeEmail.bind(this, user.uid)} />
                </label>
              </div>
          <div className='field'>
            <button type='button' className='add-row-button' onClick={this._addUser.bind(this)} disabled={this.state.syncing ? 'disabled' : false}>
              {I18n.t('webapp.general.add_another')}
            </button>
          </div>
          <div className='field'>
            {this.state.syncing ?
              <button type='submit' className='invitation-submit-button' disabled='disabled'>
                <span className='icon icon-ic_sync_24px spin' />
                {I18n.t('webapp.general.sending')}
              </button> :
              <button type='submit' className='invitation-submit-button'>{I18n.t('webapp.invitations.new.submit')}</button>}
          </div>
        </form>
      </div>
    );
  }
}

export default UserSettings;
