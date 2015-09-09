import React from 'react';
import _ from 'lodash';

import SettingBase from './setting_base';

class Github extends SettingBase {

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

  render() {
    return super.render(
      <div className='github-settings'>
        <div className='field'>
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
    );
  }
}

export default Github;
