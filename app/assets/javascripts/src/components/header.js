import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

import SessionAction from '../actions/session';
import SessionStore from '../stores/session';
import DropDown from '../components/common/dropdown';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return _.extend({
      user: SessionStore.getUser()
    });
  }

  componentDidMount() {
    SessionStore.on('change', this.onChange);
  }

  componentWillUnmount() {
    SessionStore.off('change', this.onChange);
  }

  onChange(e) {
    this.setState(this.InitialState);
  }

  render() {
    let defaultContent = <p>{I18n.t('webapp.header.account')}</p>
    let dropdown = <Dropdown defaultContent={defaultContent}
                             options={[{title: I18n.t('auth.title.logout'), callback: SessionAction.logout}]} />
    return (
      <div className="header">
        <div className="container">
          <div className="navbar-header">
            <Link to="app" className="navbar-brand">
              {I18n.t('identity')}
            </Link>
          </div>

          <div className="navbar-right">
            <ul className="nav navbar-nav">
              <li>
                <p>{I18n.t('webapp.header.teams')}</p>
              </li>
              <li>
                {dropdown}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
