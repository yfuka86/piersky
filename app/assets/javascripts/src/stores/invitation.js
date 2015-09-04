import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import changeCase from 'change-case';
import moment from 'moment';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const InvitationStore = assign({}, BaseStore, {

  getInvitations() {
    if (!this.get('invitations')) this.set('invitations', []);
    return this.get('invitations');
  },

  setInvitations(invitations) {
    this.set('invitations', invitations);
  },

  addInvitations(invitations) {
    this.set('invitations', invitations.concat(this.getInvitations()));
  },

  removeInvitation(invitation) {
    var invitations = this.getInvitations();
    _.remove(invitations, (i)=> {
      i.id === invitation.id
    });
    if (idx >= 0) {
      this.set('invitations', invitations);
    }
  },

  parse(json) {
    return {
      id: parseInt(json.id, 10),
      inviteeId: parseInt(json.invitee_id, 10),
      inviteeEmail: json.invitee_email,
      inviterId: parseInt(json.inviter_id, 10),
      inviterEmail: json.inviter_email,
      teamId: parseInt(json.team_id, 10),
      sentAt: json.sent_at ? moment(json.sent_at) : null,
      acceptedAt: json.accepted_at ? moment(json.accepted_at): null
    };
  }
});

InvitationStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.LOAD_INVITATIONS:
      InvitationStore.setInvitations(_.map(action.json.invitations, (invitationJson) => {
        return InvitationStore.parse(invitationJson);}
      ));
      InvitationStore.emitChange();
      break;

    default:
  }

  return true;
});

export default InvitationStore;

