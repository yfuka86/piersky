import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';

import InvitationAction from '../../actions/invitation';
import SessionStore from '../../stores/session';
import NotifierInForm from '../../components/common/notifier_in_form';
import Breadcrumb from '../../components/common/breadcrumb';
import {parseErrors} from '../../utils/app_module';

class InvitationsNew extends React.Component {

  constructor(props){
    super(props);
    this.uid = 0;
    this.state = this.initialState;
  }

  get initialState() {
    return {
      users: [],
      teamName: SessionStore.getTeam().name,
      messages: {}
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
      _.remove(users, (user) => {
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
    }).then((res) => {
      this.setState({messages: {successes: [I18n.t('webapp.invitations.new.sent')]}, users: []});
      this._addUser();
    }, (res) => {
      this.setState({messages: {errors: parseErrors(res)}});
    }).then(() => {
      this.setState({syncing: false});
    })
  }

  render() {
    let users = this.state.users;
    return (
      <div className='invitations-new'>
        <Breadcrumb links={[(<Link to='invitations'>
                            {I18n.t('webapp.invitations.breadcrumb.index')}
                          </Link>)]}
                    current={I18n.t('webapp.invitations.breadcrumb.new')} />
        <p className='title'>{I18n.t('webapp.invitations.index.title')}</p>
        <p className='subtitle'>
          {I18n.t('webapp.invitations.new.title', {name: this.state.teamName.length > 0 ? this.state.teamName : I18n.t('webapp.general.workspace')})}
        </p>
        <form onSubmit={this._onSubmit.bind(this)}>
          <NotifierInForm messages={this.state.messages} />
          {users.map((user, index) => {
            let removeIcon;
            if (index !== 0) {
              removeIcon = <span className='icon icon-ic_clear_24px' onClick={this._removeUser.bind(this, user.uid)} />;
            } else {
              removeIcon = <span />
            }
            return (
              <div className='field' key={user.uid} >
                <label>{I18n.t('webapp.invitations.new.label.email')}
                <input type='email'
                       autoFocus={index === users.length - 1}
                       placeholder='name@domain.com'
                       value={_.find(users, (stateUser) => {return stateUser.uid === user.uid}).email}
                       disabled={this.state.syncing ? 'disabled' : false}
                       onChange={this._changeEmail.bind(this, user.uid)} />
                {removeIcon}
                </label>
              </div>
            );
          })}
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

export default InvitationsNew;
