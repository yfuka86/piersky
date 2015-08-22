import React from 'react';
import _ from 'lodash';

class Notifier extends React.Component {
  propTypes: {
    messages: React.PropTypes.object
  }

  getDefaultProps() {
    return {
      messages: {}
    }
  }

  render() {
    let messages = {};
    ['errors', 'successes', 'infos'].forEach(function(str) {
      notifications = _this.props.messages[str];
      if (notifications && notifications.length > 0) {
        messages[str] = (
          <div className={str}>
            {
              notifications.map((notification, index) => {
                return (
                  <div className='notification-message-box' key={str + '-' +index}>
                    {notification}
                  </div>
                );
              })
            }
          </div>
        );
      }
    });

    var message = (<div></div>);
    if (messages['errors']) {
      message = messages['errors'];
    } else if (messages['successes']) {
      message = messages['successes'];
    } else if (messages['infos']) {
      message = messages['infos'];
    }

    return (
      <div className="notification-container">
        {message}
      </div>
    );
  }
});

export default Notifier;

