import React from 'react';
import _ from 'lodash';

class Notifier extends React.Component {
  static get defaultProps() {
    return {
      messages: {}
    }
  }

  static get propTypes() {
    messages: React.PropTypes.object
  }

  render() {
    let messages = {};
    ['errors', 'successes', 'infos'].forEach((str) => {
      let notifications = this.props.messages[str];
      if (notifications && notifications.length > 0) {
        messages[str] = (
          <div className={str}>
            {
              _.map(notifications, (notification, index) => {
                return (
                  <div className='notification-message-box' key={`${str}-${index}`}>
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
}

export default Notifier;

