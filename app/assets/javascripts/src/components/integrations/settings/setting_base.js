import React from 'react';
import _ from 'lodash';

import IntegrationAction from '../../../actions/integration';

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

  render() {
    return  <form className='integration-settings-form' onSubmit={this._onSubmit}>
      <p className='instruction'>
        {I18n.t('integration.github.instructions.general')}<br/>
        {I18n.t('integration.github.instructions.connect_project')}
      </p>
      <NotifierInForm messages={this.state.messages} />

      <div className='connection-settings'>
        <div className='project-settings field'>
          <ProjectSelect team={_this.props.team}
                         onChange={_this._onChangeProject}
                         value={_this.state.setting.project_id}/>
          <div className='repository-settings'>
            {_this.state.setting.repositories.map(function(repository){
              return (
                <div className='repository-select'>
                  <select key={repository.uid} onChange={_this._onChangeRepositories.bind(null, repository.uid)} value={repository.name}>
                    <option value='-1'>{I18n.t('integration.github.choose_repository')}</option>
                    {integration.setting.syncable_repositories.map(function (name) {
                      return <option key={name} value={name}>{name}</option>
                    })}
                  </select>
                </div>);
            })}
            <div className='repository-select'>
              <select onChange={_this._onChangeRepositories.bind(null, null)} value={-1}>
                <option value='-1'>{I18n.t('integration.github.choose_repository')}</option>
                {integration.setting.syncable_repositories.map(function (name) {
                  return <option key={name} value={name}>{name}</option>
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className='field'>
        <button type="submit">{I18n.t('integration.general.save')}</button>
      </div>
      <div className='field'>
        <button type='button' onClick={this._removeIntegration} disabled={_this.state.disableButtons ? 'disabled' : false}>
          {I18n.t('integration.general.remove')}
        </button>
      </div>
    </form>
  }
}

export default SettingBase;
