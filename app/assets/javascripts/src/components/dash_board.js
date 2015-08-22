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
      <div className='sky-tab-area'>
        <ul className='sky-tab-list container'>
          <Link to='integrations'>
            <li className='sky-tab'>
              {I18n.t('webapp.tab.integrations')}
            </li>
          </Link>
          <Link to='users'>
            <li className='sky-tab'>
              {I18n.t('webapp.tab.users')}
            </li>
          </Link>
        </ul>
        <div className='sky-tab-panel'>
          <RouteHandler />
        </div>
      </div>
    );
  }
}

export default DashBoard;
