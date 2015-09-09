import React from 'react';
import _ from 'lodash';

import IntegrationAction from '../../../actions/integration';
import NotifierInForm from '../../../components/common/notifier_in_form';

class SettingBase extends React.Component {
  static get defaultProps() {
    return {
      integration: []
    };
  }

  static get propTypes() {
    return {
      integration: React.PropTypes.object
    };
  }

  constructor(props){
    super(props);
    this.state = this.initialState
  }

  get initialState() {
    return {

    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onSubmit(e) {
    e.stopPropagation();
    e.preventDefault();
    IntegrationAction.update({
      id: this.props.integration.id,
      integration: {
        team_id: this.props.team.id,
        setting: this.state.setting
      }
    }).then(function() {
      _this.setState({messages: {successes: [I18n.t('integration.general.settings_saved')]}})
    })
  }

  render(element) {
    return  <form className='integration-settings-form' onSubmit={this._onSubmit}>
      <NotifierInForm messages={this.state.messages} />
      <p className='title-label'>
        {I18n.t('integration.settings.label.label')}
      </p>
      <div className='label'>
        {I18n.t('integration.settings.description.label')}
      </div>
      <div className='field'>
        <input />
      </div>

      {element}

      <div className='label'>
      </div>
      <div className='field'>
        <button type="submit">{I18n.t('integration.general.save')}</button>
      </div>
      <hr/>

      <div className='label'>
      </div>
      <div className='field'>
        <button type='button' className='button-red' onClick={this.removeIntegration} disabled={this.state.disableButtons ? 'disabled' : false}>
          {I18n.t('integration.general.remove')}
        </button>
      </div>
    </form>
  }
}

export default SettingBase;
