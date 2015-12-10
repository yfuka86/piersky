import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Constants from '../../constants/app';
import changeCase from 'change-case';

import IntegrationStore from '../../stores/integration';
import StatisticsStore from '../../stores/statistics';
import IdentityAction from '../../actions/identity';
import Loading from '../../components/common/loading';

class UserIdentity extends React.Component {
  static get defaultProps() {
    return {
      identity: {},
      range: 1
    };
  }

  static get propTypes() {
    return {
      identity: React.PropTypes.object,
      range: React.PropTypes.number
    };
  }

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return {
      stats: StatisticsStore.getIdentityStatsById(this.props.identity.id, this.props.range)
    };
  }

  componentDidMount() {
    if (!this.state.stats) {
      IdentityAction.stats(this.props.identity.id, {range: this.props.range, each_limit: this.props.eachLimit});
    }
    StatisticsStore.onChange(this.onChangeHandler);
  }

  componentWillUnmount() {
    StatisticsStore.offChange(this.onChangeHandler);
  }

  onChange() {
    this.setState(this.initialState);
  }

  render() {
    return (
      <div className='user-identity'>
        <div className='user-identity-inner'>
          <div className='header'>
            <span className={['icon', changeCase.snakeCase(this.props.identity.type) + '-logo'].join(' ')} />
            <span className='title'>
              {IntegrationStore.getIntegrationById(this.props.identity.integrationId).name}
            </span>
            <span className='count'>
              {this.state.stats.count}
            </span>
          </div>
          <div className='body'>
            {this.state.stats.contents.length === 0 ? <div className='no-activity'>{I18n.t('integration.general.no_activities')}</div> :
              _.map(this.state.stats.contents, (obj) => {
                return (
                  <div className='activity'>
                    <div className='sentence'>
                      {obj.sentence}
                    </div>
                    <div className='contents' dangerouslySetInnerHTML={{__html: obj.contents}} />
                  </div>
                );
              })}
          </div>
        </div>
        <div className='user-identity-grad' />
      </div>
    );
  }
}

export default UserIdentity;
