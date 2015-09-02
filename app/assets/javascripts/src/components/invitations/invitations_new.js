import React from 'react';
import _ from 'lodash';

import InvitationAction from '../../actions/invitation';

class InvitationsNew extends React.Component {

  constructor(props){
    super(props);
    this.uid = 0;
    this.state = {
      json: []
    };
  }

  get initialState() {
    return {
      users: []
    };
  }

  componentDidMount() {
    this._addUser();
  }

  _addUser(e) {
    let users = _.clone(this.state.users);
    users.push({email: '', uid: this.uid});
    this.uid += 1;
    this.setState({users: users});
  }

  _removeUser(uid, e) {
    if (uid) {
      let users = _.clone(this.state.users);
      _.remove(this.state.users, (user) => {
        return user.uid === uid;
      });
      this.setState({users: users});
    }
  }

  _changeEmail(uid, e) {
    let users = _.clone(this.state.users);
    _.find(users, function(user){
      return user.uid === uid;
    }).email = e.target.value;
    this.setState({users: users});
  }

  _onSubmit(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({syncing: true});
    InvitationAction.create({
      users: this.state.users
    });
  }

  render() {
    let users = this.state.users;
    return (
      <form onSubmit={this._onSubmit}>
        {users.map((user, index) => {
          let removeIcon;
          if (index !== 0) {
            removeIcon = <span className='icon icon-ic_clear_24px' onClick={this._removeUser.bind(this, user.uid)} />;
          } else {
            removeIcon = <span />
          }
          return (
            <div className='field' key={user.uid} >
              <input type='email'
                     autoFocus={index === users.length - 1}
                     placeholder='name@domain.com'
                     value={_.find(users, (stateUser) => {return stateUser.uid === user.uid}).email}
                     disabled={this.state.syncing ? 'disabled' : false}
                     onChange={this._changeEmail.bind(this, user.uid)} />
              {removeIcon}
            </div>
          );
        })}
        <div className='field'>
          <button type='button' className='add-row-button' onClick={this._addUser} disabled={this.state.syncing ? 'disabled' : false}>
            {I18n.t('webapp.general.add_another')}
          </button>
          {this.state.syncing ?
            <button type='submit' className='invitation-submit-button' disabled='disabled'>
              <span className='icon icon-ic_sync_24px spin' />
              {I18n.t('webapp.general.sending')}
            </button> :
            <button type='submit' className='invitation-submit-button'>{I18n.t('webapp.team_settings.invitations.invitation_new.submit')}</button>}
        </div>
      </form>
    );
  }
}

export default InvitationsNew;
