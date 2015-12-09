import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Constants from '../../constants/app';

import StatisticsStore from '../../stores/statistics';
import IdentityAction from '../../actions/identity';
import Loading from '../../components/common/loading';

class UserIdentity extends React.Component {
  static get defaultProps() {
    return {
      identity: {}
    };
  }

  static get propTypes() {
    return {
      identity: React.PropTypes.object
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
      IdentityAction.stats(this.props.identity.id, this.props.range);
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
      <div>
        {this.state.stats}
      </div>
    );
  }
}

export default UserIdentity;