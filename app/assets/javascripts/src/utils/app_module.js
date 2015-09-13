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
  }
}