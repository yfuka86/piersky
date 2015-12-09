import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Constants from '../../constants/app';

import UserAction from '../../actions/user';
import IdentityStore from '../../stores/identity';
import Loading from '../../components/common/loading';
import UserIdentity from '../../components/users/user_identity';

class UserIdentities extends React.Component {
  static get defaultProps() {
    return {
      user: {},
      range: 1
    };
  }

  static get propTypes() {
    return {
      user: React.PropTypes.object,
      range: React.PropTypes.number
    };
  }

  componentDidMount() {
    UserAction.identities_stats(this.props.user.id, this.props.range).then((json) => this.setState({
      loaded: true,
      identities: _.map(json.identities, (i) => {return IdentityStore.getIdentityById(i.id)})
    }))
  }

  render() {
    return this.state.loaded ? (
      <span>
        {_.map(this.state.identities, (identity) => {
          return <UserIdentity identity={identity} range={this.props.range} />
        })}
      </span>) : <Loading />;
  }
}

export default UserIdentities;
