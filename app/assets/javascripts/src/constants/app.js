import keyMirror from 'keymirror';
import _ from 'lodash';

let Root = window.location.origin || `${window.location.protocol}//${window.location.hostname}`;
let APIRoot = Root + '/api';

export default {

  AppName: 'PierSky',

  Root: Root,
  APIRoot: APIRoot,
  APIEndpoints: {
    LOGOUT:         Root + '/sign_out',
    USERS:          APIRoot + '/users',
    TEAMS:          APIRoot + '/teams',
    IDENTITIES:     APIRoot + '/identities',
    INTEGRATIONS:   APIRoot + '/integrations',
    INVITATIONS:    APIRoot + '/invitations'
  },
  IntegrationEndpoint(provider) {
    return Root + `/auth/${provider}`
  },

  CSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  },

  Integrations: keyMirror({
    github: null,
    slack: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  }),

  ActionTypes: keyMirror({
    // route
    TRANSITION: null,
    REDIRECT: null,

    //initialize
    LOAD_USER: null,
    LOAD_TEAM: null,

    //identities
    LOAD_IDENTITIES: null,
    UPDATE_IDENTITY: null,

    //invitation
    LOAD_INVITATIONS: null,
    CREATE_INVITATIONS: null,
    RESEND_INVITATION: null,
    REVOKE_INVITATION: null,

    //integration
    LOAD_INTEGRATIONS: null,
    LOAD_INTEGRATION: null,
    UPDATE_INTEGRATION: null,
    REMOVE_INTEGRATION: null,

    //stats
    LOAD_INTEGRATION_STATS: null,
    LOAD_USER_STATS: null,
    LOAD_IDENTITY_STATS: null,
    LOAD_USER_IDENTITIES_STATS: null,

    //view
    SHOW_BALLOON: null,
    CLOSE_BALLOON: null,
    SHOW_NOTIFICATION: null
  }),

  IntegrationStatus: ['default', 'syncing', 'unset'],

  Colors: ['red', 'pink', 'purple', 'deeppurple', 'indigo', 'blue', 'lightblue', 'cyan', 'teal', 'green',
           'lightgreen', 'lime', 'yellow', 'amber', 'orange', 'deeporange', 'brown', 'bluegrey', 'grey'],
  ColorHexes: {red: '#ef5350', pink: '#ec407a', purple: '#ab47bc', deeppurple: '#7e57c2', indigo: '#5c6bc0',
               blue: '#42a5f5', lightblue: '#29b6f6', cyan: '#26c6da', teal: '#26a69a', green: '#66bb6a',
               lightgreen: '#9ccc65', lime: '#d4e157', yellow: '#ffee58', amber: '#ffca28', orange: '#ffa726',
               deeporange: '#ff7043', brown: '#8d6e63', bluegrey: '#78909c', grey: '#bdbdbd', identity: '1976d2'},
  randomColor() {
    return this.Colors[parseInt(Math.random() * this.Colors.length, 10)];
  },
  colorByKey(str) {
    return this.Colors[_.reduce(str.toString(), (memo, char)=>{return memo + char.charCodeAt(0);}, 0) % this.Colors.length];
  },
  colorHexByKey(str) {
    return this.ColorHexes[this.colorByKey(str)];
  },

  KeyCodes: {
    BS: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    ESC: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  }
};
