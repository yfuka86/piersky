import React from 'react';
import _ from 'lodash';

import IntegrationAction from '../../../actions/integration';
import RouteAction from '../../../actions/route';
import ViewAction from '../../../actions/view';
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
    let integration = this.props.integration;
    return {
      id: integration.id,
      integration: {
        label: integration.label,
        settings: this.getSettingsFromIntegration()
      }
    };
  }

  getSettingsFromIntegration() {
    //please override
    return {};
  }

  removeIntegration(e) {
    if (window.confirm(I18n.t('integration.general.confirm_remove'))) {
      this.setState({syncing: true});
      IntegrationAction.remove(this.props.integration.id).then(() => {
        RouteAction.redirect('integrations-index');
        ViewAction.showNotification({infos: [I18n.t('integration.general.removed')]});
        this.setState({syncing: false});
      })
    }
  }

  changeLabel(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({integration: _.assign({}, this.state.integration, {label: e.target.value})});
  }

  onSubmit(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({syncing: true});
    IntegrationAction.update({
      id: this.state.id,
      integration: this.state.integration
    }).then(() => {
      ViewAction.showNotification({successes: [I18n.t('integration.general.settings_saved')]});
      this.setState({syncing: false});
    })
  }

  render(element) {
    return  <form className='integration-settings-form' onSubmit={this.onSubmit.bind(this)}>
      <NotifierInForm messages={this.state.messages} />
      <p className='title-label'>
        {I18n.t('integration.settings.label.label')}
      </p>
      <div className='label'>
        {I18n.t('integration.settings.description.label')}
      </div>
      <div className='field'>
        <input onChange={this.changeLabel.bind(this)} value={this.state.integration.label} maxLength={20} />
      </div>

      {element}

      <div className='label'>
      </div>
      <div className='field'>
        <button type="submit" disabled={this.state.syncing ? 'disabled' : false}>{I18n.t('integration.general.save')}</button>
      </div>
      <hr className='attention' />

      <div className='label'>
      </div>
      <div className='field'>
        <button type='button' className='button-red' onClick={this.removeIntegration.bind(this)} disabled={this.state.syncing ? 'disabled' : false}>
          {I18n.t('integration.general.remove')}
        </button>
      </div>
    </form>
  }
}

export default SettingBase;
