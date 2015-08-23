import React from 'react';
import _ from 'lodash';

class Loading extends React.Component {
  render() {
    return (
      <div className={['spinner', this.props.className].join(' ')} id={this.props.id || 'spinner_container'}>
        <div></div>
        <p>{I18n.t('general.loading')}</p>
      </div>
    );
  }
}

export default Loading;
