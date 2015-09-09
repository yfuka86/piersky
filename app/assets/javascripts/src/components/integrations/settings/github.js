import React from 'react';
import _ from 'lodash';
import AppModule from '../../../utils/app_module';

import SettingBase from './setting_base';

class Github extends SettingBase {

  getSettingsFromIntegration() {
    let details = this.props.integration.details;
    return {
      repositories: details.repositories.map((rName) => {return {uid: AppModule.getUid(), name: rName}})
    }
  }

  onChangeRepositories(uid, e) {
    let value = e.target.value;
    let settings = this.state.integration.settings;
    let repositories = settings.repositories;

    if (uid) {
      let idx = _.findIndex(repositories, function(repository) {
        return repository.uid === uid;
      })
      if (value === '-1') {
        repositories.splice(idx, 1);
      } else {
        repositories[idx].name = value;
      }
    } else {
      repositories.push({
        uid: AppModule.getUid(),
        name: value,
      });
    }
    this.setState({settings: settings});
  }

  render() {
    let integration = this.props.integration;
    let settings = this.state.integration.settings;

    let repositoryOptions = [
      <option value='-1'>{I18n.t('integration.github.repository.placeholder')}</option>
    ].concat(
      integration.details.syncable_repositories.map(function (name) {
        return <option key={name} value={name}>{name}</option>
      })
    );

    return super.render(
      <div className='github-settings'>
        <hr/>
        <p className='title-label'>
          {I18n.t('integration.github.repository.label')}
        </p>
        <div className='label'>
          {I18n.t('integration.github.repository.description')}
        </div>
        <div className='field'>
          {settings.repositories.map((repository) => {
            return (
              <div className='repository-select'>
                <select key={repository.uid} onChange={this.onChangeRepositories.bind(this, repository.uid)} value={repository.name}>
                  {repositoryOptions}
                </select>
              </div>);
          })}
          <div className='repository-select'>
            <select onChange={this.onChangeRepositories.bind(this, null)} value={-1}>
              {repositoryOptions}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default Github;
