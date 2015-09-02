import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';

import InvitationAction from '../../actions/invitation';
import InvitationStore from '../../stores/invitation';
import UserStore from '../../stores/user';
import UserInfo from '../../components/users/user_info';

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
    InvitationActionCreators.revoke(id)
  }

  _resendInvitation(id) {
    InvitationActionCreators.resend(id)
  }

  render() {
    return (
      <div className='invitation-list'>
        {this.props.invitations.map((invitation) => {
          let invitee = UserStore.getUserById(invitation.inviteeId);
          let inviter = UserStore.getUserById(invitation.inviterId);
          return (
            <div className={['option', (this._isExpanded(invitation.id) ? 'expanded' : '')].join(' ')}>
              <div className='content-area'>
                <p className='sub-content'>{I18n.t('webapp.team_settings.invitations.invitation_to')}</p>
                {invitee ? <UserInfo user={invitee} /> : <p className='main-content'>{invitation.inviteeEmail}</p>}
                <p className='sub-content'>
                  {invitation.acceptedAt ?
                    I18n.t('webapp.invitations.index.accepted_at', {time: invitation.acceptedAt.format('MMMM Do, YYYY')}) :
                    I18n.t('webapp.invitations.index.sent_at', {time: invitation.sentAt.format('MMMM Do, YYYY')})}
                </p>

                <span className='right-content'>
                  <p className='sub-content'>{I18n.t('webapp.team_settings.invitations.from')}</p>
                  {inviter ? <UserInfo user={inviter} /> : <p className='main-content'>{invitation.inviterEmail}</p>}
                </span>

                {invitation.acceptedAt ? <div /> : <div className='toggle' onClick={this._toggleExpantion.bind(this, invitation.id)} />}
              </div>
              {_this._isExpanded(invitation.id) ? (
                <div className='expanded-area invitation-actions'>
                  <div className='field'>
                    <button disabled={_this.state.syncing ? 'disabled' : false} onClick={this._revokeInvitation.bind(this, invitation.id)}>{I18n.t('webapp.invitations.index.revoke')}</button>
                  </div>
                  <div className='field'>
                    <button disabled={_this.state.syncing ? 'disabled' : false} onClick={this._resendInvitation.bind(this, invitation.id)}>{I18n.t('webapp.invitations.index.resend')}</button>
                  </div>
                </div>
              ) : (<div></div>)}
            </div>
          )
        })}
      </div>
    );
  }
}

export default InvitationsIndex;
