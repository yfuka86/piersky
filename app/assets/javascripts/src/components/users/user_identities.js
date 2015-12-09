import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Constants from '../../constants/app';
import Spinner from 'spin.js';

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

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {};
  }

  componentDidMount() {
    UserAction.identities_stats(this.props.user.id, this.props.range).then((json) => this.setState({
      loaded: true,
      identities: _.map(json.identities, (i) => {return IdentityStore.getIdentityById(i.id)})
    }))
    this.spin();
  }

  spin() {
    let spinner = new Spinner().spin();
    let target = React.findDOMNode(this).querySelector('.loading');
    if (target) target.appendChild(spinner.el)
  }

  render() {
    return this.state.loaded ? (
      <span>
        {_.map(this.state.identities, (identity) => {
          return <UserIdentity identity={identity} range={this.props.range} />
        })}
      </span>) : <div className='loading' />;
  }
}

export default UserIdentities;
