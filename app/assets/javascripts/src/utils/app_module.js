import _ from 'lodash';

export default {

  getUid: () => {
    let counter = 0;
    return () => {
      counter += 1;
      return counter;
    }
  }(),

  getKeyHash() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
  },

  parseErrors(res) {
    let errorMsgs = [I18n.t('webapp.general.error_message')];
    let json = JSON.parse(res.text);
    if (json) {
      if (json['errors']) {
        errorMsgs = json['errors'];
      } else if (json['error']) {
        errorMsgs = [json['error']];
      }
    }
    return errorMsgs;
  },

  getTicks(max) {
    let multiplier = 1;
    let counter = 1;
    while (Math.ceil(max / (Math.pow(10, multiplier) * counter)) > 1) {
      if (counter === 9) {
        multiplier += 1;
        counter = 1;
      } else {
        counter += 1;
      }
    }
    return _.range(0, Math.pow(10, multiplier) * counter, Math.pow(10, multiplier - 1) * 5);
  }
}