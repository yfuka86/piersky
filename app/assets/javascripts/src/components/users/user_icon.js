var React = require('react');
var SkyConstants = require('../../constants/SkyConstants');

var UserIcon = React.createClass({

  propTypes: {
    user: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      user: {}
    }
  },

  render: function() {
    var user = this.props.user;
    return (
      <span className={'simple-user-icon ' + SkyConstants.colorByKey(user.userName)}>
        {user.userName[0].toUpperCase()}
      </span>
    );
  }

});

module.exports = UserIcon;
