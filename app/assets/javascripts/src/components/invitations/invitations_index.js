import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';

import InvitationAction from '../../actions/invitation';
import InvitationStore from '../../stores/invitation';
import UserStore from '../../stores/user';
import UserInfo from '../../components/users/user_info';
import NotifierInForm from '../../components/common/notifier_in_form';
import {parseErrors} from '../../utils/app_module';

class InvitationsIndex extends React.Component {
  static get defaultProps() {
    return {
      invitations: []
    };
  }

  static get propTypes() {
    return {
      invitations: React.PropTypes.array
    };
  }

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      expandedId: null,
      syncing: false
    }
  }

  _toggleExpantion(id) {
    if (this._isExpanded(id)) {
      this.setState({expandedId: null});
    } else {
      this.setState({expandedId: id});
    }
  }

  _isExpanded(id) {
    return this.state.expandedId === id;
  }

  _revokeInvitation(id) {
    this.setState({revoking: true});
    InvitationAction.revoke(id).then((res) => {
      this.setState({messages: {infos: [I18n.t('webapp.invitations.index.revoked')]}});
    }, (res) => {
      this.setState({messages: {errors: parseErrors(res)}});
    }).then(() => {
      this.setState({revoking: false});
    })
  }

  _resendInvitation(id) {
    this.setState({resending: true});
    InvitationAction.resend(id).then((res) => {
      this.setState({messages: {successes: [I18n.t('webapp.invitations.index.resent')]}});
    }, (res) => {
      this.setState({messages: {errors: parseErrors(res)}});
    }).then(() => {
      this.setState({resending: false});
    })
  }

  render() {
    return (
      <div>
        <p className='title'>{I18n.t('webapp.invitations.index.title')}</p>
        <p className='subtitle'>
          {this.props.invitations.length > 0 ? '' : I18n.t('user.general.no_invitations')}
        </p>
        <p className='subtitle'>
          <Link to='invitations-new'>
            {I18n.t('user.general.setup')}
          </Link>
        </p>
        <div className='invitations-list'>
          <NotifierInForm messages={this.state.messages} />
          {this.props.invitations.map((invitation) => {
            let invitee = UserStore.getUserById(invitation.inviteeId);
            let inviter = UserStore.getUserById(invitation.inviterId);
            return (
              <div className={`option ${invitation.acceptedAt ? '' : 'option-expandable'} ${this._isExpanded(invitation.id) ? 'expanded' : ''}`} key={invitation.id}>
                {invitation.acceptedAt ? <div /> :
                  <div className='toggle' onClick={this._toggleExpantion.bind(this, invitation.id)} />
                }
                <div className='content-area'>
                  <p className='sub-content'>{I18n.t('webapp.invitations.index.to')}</p>
                  {invitee ? <UserInfo user={invitee} /> : <p className='main-content'>{invitation.inviteeEmail}</p>}
                  <p className='sub-content'>
                    {invitation.acceptedAt ?
                      I18n.t('webapp.invitations.index.accepted_at', {time: invitation.acceptedAt.format('MMMM Do, YYYY')}) :
                      I18n.t('webapp.invitations.index.sent_at', {time: invitation.sentAt.format('MMMM Do, YYYY')})}
                  </p>

                  <span className='right-content'>
                    <p className='sub-content'>{I18n.t('webapp.invitations.index.from')}</p>
                    {inviter ? <UserInfo user={inviter} /> : <p className='main-content'>{invitation.inviterEmail}</p>}
                  </span>
                </div>
                {this._isExpanded(invitation.id) ? (
                  <div className='expanded-area invitation-actions'>
                    <div className='field'>
                      {this.state.revoking ?
                        <button disabled='disabled'>
                          <span className='icon icon-ic_sync_24px spin' />
                          {I18n.t('webapp.invitations.index.revoke')}
                        </button> :
                        <button onClick={this._revokeInvitation.bind(this, invitation.id)} disabled={this.state.resending ? 'disabled' : false}>
                          {I18n.t('webapp.invitations.index.revoke')}
                        </button>}
                    </div>
                    <div className='field'>
                      {this.state.resending ?
                        <button disabled='disabled'>
                          <span className='icon icon-ic_sync_24px spin' />
                          {I18n.t('webapp.invitations.index.resend')}
                        </button> :
                        <button onClick={this._resendInvitation.bind(this, invitation.id)} disabled={this.state.revoking ? 'disabled' : false}>
                          {I18n.t('webapp.invitations.index.resend')}
                        </button>}
                    </div>
                  </div>
                ) : (<div></div>)}
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default InvitationsIndex;
