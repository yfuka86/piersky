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
    return (
      <div className='github-settings'>
      </div>
    );
  }
}

export default Github;
