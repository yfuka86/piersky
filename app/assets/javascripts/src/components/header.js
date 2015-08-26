import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';
import SessionStore from '../stores/session';

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
                <Link to="app" className="navbar-brand">
                  {I18n.t('webapp.header.teams')}
                </Link>
              </li>
              <li>
                <Link to="app" className="navbar-brand">
                  {I18n.t('webapp.header.account')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
