import React from 'react';
import _ from 'lodash';
import {RouteHandler} from 'react-router';

import InvitationAction from '../../actions/invitation';
import InvitationStore from '../../stores/invitation';
import Loading from '../../components/common/loading';

class InvitationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return {
      invitations: InvitationStore.getInvitations()
    };
  }

  componentDidMount() {
    InvitationAction.load().then(() => {
      this.setState({hasInitialized: true});
    })
    InvitationStore.onChange(this.onChangeHandler);
  }

  componentWillUnmount() {
    InvitationStore.offChange(this.onChangeHandler);
  }

  onChange() {
    this.setState(this.initialState);
  }

  render() {
    return (
      <div className='container-main'>
        {this.state.hasInitialized > 0 ? <RouteHandler invitations={this.state.invitations} /> : <Loading />}
      </div>
    );
  }
}

export default InvitationsPage;
