var React = require('react');

class NotifierInForm extends React.Component {

  static get defaultProps() {
    return {
      messages: {}
    };
  }

  static get propTypes() {
    return {
      invitations: React.PropTypes.object
    };
  }

  render() {
    return (
      <div className="form-notification-container">
        {['errors', 'successes', 'infos'].map((str) => {
          var sentences = this.props.messages[str];
          if (sentences && sentences.length > 0) {
            return (
              <ul key={str} className={`form-notification-inner ${str}`}>
                {sentences.map(function(sentence, index){
                  var icon;
                  if (str === 'errors') {
                    icon = <span className='icon icon-ic_error_24px' />
                  } else if (str === 'successes') {
                    icon = <span className='icon icon-ic_check_box_24px' />
                  } else if (str === 'infos') {
                    icon = <span className='icon icon-ic_info_outline_24px' />
                  }
                  return(
                    <li className='message' key={`${str}-${index}`}>
                      {icon}
                      {sentence}
                    </li>
                  );
                })}
              </ul>
            );
          }
        })}
      </div>
    );
  }
}

export default NotifierInForm;
