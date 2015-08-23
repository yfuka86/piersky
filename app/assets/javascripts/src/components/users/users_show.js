import React from 'react';
import _ from 'lodash';
import ReactD3 from 'react-d3-components'

class UsersShow extends React.Component {

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

  render() {
    let BarChart = ReactD3.BarChart;

    let data = [{
        label: 'somethingA',
        values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
    }];

    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('webapp.users.show', {name: 'yfuka86'})}</p>
        <BarChart
            data={data}
            width={400}
            height={400}
            margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
      </div>
    );
  }
}

export default UsersShow;
