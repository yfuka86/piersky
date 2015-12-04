import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Constants from '../../../constants/app';
import {getTicks} from '../../../utils/app_module';

import IdentityStore from '../../../stores/identity';
import UserStore from '../../../stores/user';
import UserInfo from '../../../components/users/user_info';
import UserSelect from '../../../components/users/user_select';

class Github extends React.Component {
  static get defaultProps() {
    return {
      integration: {},
      stats: {}
    };
  }

  static get propTypes() {
    return {
      integration: React.PropTypes.object,
      stats: React.PropTypes.object
    };
  }

  constructor(props){
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      activity: 'default',
      periodLength: 28,
      periodEndAt: moment(this.props.stats.today)
    }
  }

  componentDidMount() {
    this.drawChart();
    window.onresize = this.drawChart.bind(this);
  }

  componentDidUpdate() {
    this.drawChart();
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  changeActivity(e) {
    this.setState({activity: e.target.value});
  }

  changePeriod(e) {
    this.setState({periodLength: parseInt(e.target.value, 10)})
  }

  toggleExpantion(id) {
    if (this.isExpanded(id)) {
      this.setState({expandedId: null});
    } else {
      this.setState({expandedId: id});
    }
  }

  isExpanded(id) {
    return this.state.expandedId === id;
  }

  drawChart() {
    if (!this.props) return;
    let activity = this.state.activity;
    let end = this.state.periodEndAt;
    let length = this.state.periodLength;

    let width = React.findDOMNode(this).clientWidth;
    let height = parseInt(width * 3 / 8);

    let identitiesData = this.props.stats.identities;
    identitiesData = _.reject(identitiesData, (data) => {
      return _.sum(data[activity].slice(0, length)) === 0;
    });

    if (identitiesData.length > 0) {
      let userNames = identitiesData.map((data) => {
        return IdentityStore.getUserIdentityById(data.id)
      })
      let header = ['Day'].concat(userNames);
      let colors = userNames.map((name) => {return Constants.colorHexByKey(name)});
      let data = [header];

      let max = 0;
      _.times(length, (i) => {
        let ary = identitiesData.map((data) => {
          return data[activity][length - (i + 1)];
        });
        let sum = _.sum(ary);
        if (sum > max) max = sum;
        data.push([moment(end).subtract(length - (i + 1), 'days').format("MMM Do")].concat(ary));
      })

      let tableData = google.visualization.arrayToDataTable(data);

      let ticks = getTicks(max);
      let options = {
        width: width,
        height: height,
        legend: {position: 'right', maxLines: 3},
        colors: colors,
        // curveType: 'function',
        vAxis: {
          ticks: ticks,
          minValue: 0
        }
      };

      let chart = new google.visualization.LineChart(React.findDOMNode(this).querySelector('#main_graph'));
      chart.draw(tableData, options);
    } else {
      React.findDOMNode(this).querySelector('#main_graph').innerHTML = `<div class="no-activities" style="height: ${height}px">${I18n.t('integration.general.no_activities')}</div>`;
    }
  }

  render() {
    let updateIdentity = (identityId, e) => {
      let userId = parseInt(e.target.value, 10);
      IdentityAction.update({id: identityId, user_id: userId}).then(() => {}, (res) => {
        // todo
      });
    }

    let usersList = _.sortBy(this.props.stats.identities, (identityData) => {
      return -_.sum(identityData[this.state.activity].slice(0, this.state.periodLength));
    }).map((identityData) =>{
      let identity = IdentityStore.getIdentityById(identityData.id);
      let user = IdentityStore.getUserByIdentityId(identityData.id);
      let total = _.sum(identityData[this.state.activity].slice(0, this.state.periodLength));
      let avg = Math.round(total / this.state.periodLength * 100) / 100;
      return (
        <div className={`option ${this.isExpanded(identity.id) ? 'expanded' : ''}`} key={identityData.id}>
          <div className='toggle' onClick={this.toggleExpantion.bind(this, identity.id)} />
          <div className='content-area'>
            <div className='user-info-area'>
              {user ? <UserInfo user={user} /> : <p className='main-content'>{identity.name}</p>}
            </div>

            <div className='user-select-form'>
              <UserSelect onChange={updateIdentity.bind(this, identity.id)} value={!!user ? user.id : null} />
            </div>

            <p className='main-content total'>{total}</p>
            <p className='main-content avg'>{avg}</p>
            <div className='user-graph' id={`user_graph_${identity.id}`} />
          </div>

          {this.isExpanded(identity.id) ? (
            <div className='expanded-area'>
              <div className='field'>
              </div>
              <div className='field'>
              </div>
            </div>
          ) : (<div />)}
        </div>
      );
    });

    return (
      <div className='statistics-github'>
        <div className='main-graph-action standard-form-horizontal'>
          <div className='field'>
            <select onChange={this.changeActivity.bind(this)}>
              <option value={'default'} >{I18n.t('integration.github.activity.default')}</option>
              {this.props.stats.activities.map((activity)=>{
                return <option value={activity} key={activity}>{I18n.t(`integration.github.activity.${activity}`)}</option>
              })}
            </select>
          </div>
          <div className='field'>
            <select onChange={this.changePeriod.bind(this)}>
              <option value={28} >{I18n.t('integration.github.period.last_month')}</option>
              <option value={7} >{I18n.t('integration.github.period.last_week')}</option>
            </select>
          </div>
        </div>

        <div id='main_graph' />

        <div className='users-stats'>
          <div className='option-header'>
            <div className='content-area'>
              <p className='user-info-area main-content'>{I18n.t('integration.general.member')}</p>
              <div className='user-select-form' />
              <p className='main-content total'>{I18n.t('integration.general.total')}</p>
              <p className='main-content avg'>{I18n.t('integration.general.per_day')}</p>
              <div className='user-graph' />
            </div>
          </div>
          {usersList}
        </div>
      </div>
    );
  }
}

export default Github;
