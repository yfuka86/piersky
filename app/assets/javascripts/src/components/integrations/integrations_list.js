import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import IntegrationStore from '../../stores/integration';

class IntegrationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return _.extend({
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChange(e) {
    this.setState(this.InitialState);
  }

  render() {
    return (
      <ul className='integrations-list'>
        <li>
          <Link to='integrations-new'>
            {I18n.t('integration.general.add')}
          </Link>
        </li>
      </ul>
    );
  }
}

export default IntegrationsList;
