export default {

  counter: 0,

  getUid() {
    this.counter += 1;
    return this.counter;
  },

  getKeyHash() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
  }
}