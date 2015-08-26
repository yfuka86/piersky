import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

class DashBoard extends React.Component {
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
      <div className='dash-board'>
        <ul className='main-menu'>
          <div className='container'>
            <Link to='integrations'>
              <li className='menu'>
                {I18n.t('webapp.tab.integrations')}
              </li>
            </Link>
            <Link to='users'>
              <li className='menu'>
                {I18n.t('webapp.tab.users')}
              </li>
            </Link>
          </div>
        </ul>
        <div className='main-panel'>
          <RouteHandler />
        </div>
      </div>
    );
  }
}

export default DashBoard;
