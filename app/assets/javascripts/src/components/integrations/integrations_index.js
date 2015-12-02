import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import moment from 'moment';
import changeCase from 'change-case';
import Constants from '../../constants/app';

import IntegrationStore from '../../stores/integration';
import UserStore from '../../stores/user';

import IntegrationAction from '../../actions/integration';

class IntegrationsIndex extends React.Component {
  static get defaultProps() {
    return {
      integrations: []
    };
  }

  static get propTypes() {
    return {
      integrations: React.PropTypes.array
    };
  }

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
    }
  }

  componentDidMount() {
    this.drawIntegrationsChart();
    window.onresize = this.drawIntegrationsChart.bind(this);
  }

  componentDidUpdate() {
    this.drawIntegrationsChart();
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  drawIntegrationsChart() {
    _.each(this.props.integrations, (integration) => {this.drawIntegrationChart(integration)});
  }

  drawIntegrationChart(integration) {
    if (!integration) return;
    let width = 300;
    let height = 54;
    let name = integration.name;

    let header = ['Day', name];
    let colors = [Constants.colorHexByKey(name)];
    let data = [header];

    let summary = integration.summary;
    let length = summary.length
    // todo fix
    let end = moment(moment().format('YYYY MM DD'), 'YYYY MM DD');
    _.times(length, (i) => {
      let count = summary[length - (i + 1)];
      data.push([moment(end).subtract(length - (i + 1), 'days').format("MMM Do"), count]);
    })

    let tableData = google.visualization.arrayToDataTable(data);

    let options = {
      isStacked: true,
      width: width,
      height: height,
      legend: {position: 'none'},
      colors: colors,
      // curveType: 'function',
      vAxis: {
        ticks: [],
        minValue: 0
      }
    };

    let chart = new google.visualization.LineChart(React.findDOMNode(this).querySelector(`#integration_graph_${integration.id}`));
    chart.draw(tableData, options);
  }

  render() {
    let integrationList
    if (this.props.integrations.length === 0) {
      integrationList = (
        <div>
          <p className='subtitle'>
            {I18n.t('integration.general.no_integrations')}
          </p>
          <p className='subtitle'>
            <Link to='integrations-new'>
              {I18n.t('integration.general.setup')}
            </Link>
          </p>
        </div>
      );
    } else {
      integrationList = (
        <div className='integrations-index'>
          <div className='option-header'>
            <div className='content-area'>
              <div className='name' />
              <span className='right-content'>
                <p className='main-content activity'>{I18n.t('integration.general.activities')}<br/>{I18n.t('integration.index.last_31_days')}</p>
                <div className='integration-graph' />
                <div className='link' />
              </span>
            </div>
          </div>

          {this.props.integrations.map((integration) =>{
            let integrationUser = UserStore.getUserById(integration.userId);
            let summary = integration.summary
            return (
              <div className='option' key={integration.id}>
                <div className='content-area'>
                  <div className='icon-area'>
                    <span className={['icon', changeCase.snakeCase(integration.type) + '-logo'].join(' ')} />
                  </div>
                  <Link to='integration-show' params={{id: integration.id}} className='link'>
                    <p className='name'>
                      {integration.name}
                    </p>
                  </Link>

                  <span className='right-content'>
                    <p className='main-content activity'>{_.sum(integration.summary)}</p>
                    <div className='integration-graph' id={`integration_graph_${integration.id}`} />
                    <Link to='integration-show' params={{id: integration.id}} className='link'>
                      <button>{I18n.t('integration.index.view_detail')}</button>
                    </Link>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('integration.index.title')}</p>
        {integrationList}
      </div>
    );
  }
}

export default IntegrationsIndex;
