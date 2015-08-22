import keyMirror from 'keymirror';

let Root = window.location.origin;
let APIRoot = Root + '/api';

export default {

  AppName: 'PierSky',

  Colors: ['red', 'pink', 'purple', 'deeppurple', 'indigo', 'blue', 'lightblue', 'cyan', 'teal', 'green',
           'lightgreen', 'lime', 'yellow', 'amber', 'orange', 'deeporange', 'brown', 'bluegrey', 'grey'],

  ColorHexes: {red: '#ef5350', pink: '#ec407a', purple: '#ab47bc', deeppurple: '#7e57c2', indigo: '#5c6bc0',
               blue: '#42a5f5', lightblue: '#29b6f6', cyan: '#26c6da', teal: '#26a69a', green: '#66bb6a',
               lightgreen: '#9ccc65', lime: '#d4e157', yellow: '#ffee58', amber: '#ffca28', orange: '#ffa726',
               deeporange: '#ff7043', brown: '#8d6e63', bluegrey: '#78909c', grey: '#bdbdbd', identity: '1976d2'},

  randomColor: function() {
    return this.Colors[parseInt(Math.random() * this.Colors.length, 10)];
  },

  colorByKey: function(str) {
    return this.Colors[_.reduce(str.toString(), function(memo, char){return memo + char.charCodeAt(0);}, 0) % this.Colors.length];
  },

  colorHexByKey: function(str) {
    return this.ColorHexes[this.colorByKey(str)];
  },

  Root: Root,

  APIEndpoints: {
    USERS:          APIRoot + '/users',
    INTEGRATIONS:   APIRoot + '/integrations'
  },

  IntegrationEndpoint: function (params) {
    return Root + '/integrations/establish?provider=' + params.provider
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

    //integration
    LOAD_INTEGRATIONS: null
  }),

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
