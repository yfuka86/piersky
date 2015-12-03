import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Constants from '../../../constants/app';
import {getTicks} from '../../../utils/app_module';

import IdentityStore from '../../../stores/identity';
import UserStore from '../../../stores/user';

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

  changeActivity(e) {
    this.setState({activity: e.target.value});
  }

  changePeriod(e) {
    this.setState({periodLength: parseInt(e.target.value, 10)})
  }

  render() {
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
      </div>
    );
  }
}

export default Github;
