import React from 'react';
import _ from 'lodash';
import request from 'superagent';
import moment from 'moment';
import Constants from '../../constants/app';

import IdentityStore from '../../stores/identity';
import UserStore from '../../stores/user';

class Github extends React.Component {
  static get defaultProps() {
    return {
      integration: {},
      stat: {}
    };
  }

  static get propTypes() {
    return {
      integration: React.PropTypes.object,
      stat: React.PropTypes.object
    };
  }

  constructor(props){
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      activity: 'default',
      periodLength: 31,
      periodEndAt: moment(this.props.stat.today)
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
    let identitiesData = this.props.stat.identities;
    let users = identitiesData.map((data) => {
      return UserStore.getUserById(IdentityStore.getIdentityById(data.id).userId);
    });

    let header = ['Day'].concat(users.map((user) => {return user.identity()}));
    let colors = users.map((user) => {return Constants.colorHexByKey(user.identity())});
    let data = [header];

    let end = this.state.periodEndAt;
    let length = this.state.periodLength;
    _.times(length, (i) => {
      let ary = [moment(end).subtract(length - (i + 1), 'days').format("MMM Do")].concat(identitiesData.map((data) => {
        return data[this.state.activity][length - (i + 1)]
      }));
      data.push(ary)
    })

    let tableData = google.visualization.arrayToDataTable(data);

    let width = React.findDOMNode(this).clientWidth;
    let height = width * 3 / 8;
    let options = {
      isStacked: true,
      width: width,
      height: height,
      legend: {position: 'right', maxLines: 3},
      colors: colors,
      hAxis: {title: 'Day',  titleTextStyle: {color: '#333'}},
      vAxis: {
        minValue: 0
      }
    };

    let chart = new google.visualization.AreaChart(React.findDOMNode(this).querySelector('#main_graph'));
    chart.draw(tableData, options);
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
              {this.props.stat.activities.map((activity)=>{
                return <option value={activity} key={activity}>{I18n.t(`integration.github.activity.${activity}`)}</option>
              })}
            </select>
          </div>
          <div className='field'>
            <select onChange={this.changePeriod.bind(this)}>
              <option value={31} >{I18n.t('integration.github.period.placeholder')}</option>
              <option value={7} >{I18n.t('integration.github.period.last_week')}</option>
              <option value={31} >{I18n.t('integration.github.period.last_month')}</option>
            </select>
          </div>
        </div>
        <div id='main_graph' />
      </div>
    );
  }
}

export default Github;
