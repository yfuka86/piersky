import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import Constants from '../../constants/app';
import ReactD3 from 'react-d3-components'

import IntegrationAction from '../../actions/integration';

class IntegrationsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return _.extend({
      objects: [ 
        {id: 1, name: "Scalaへの移行", elems: [
          {id: 1, type: "github", title: "Fix block device naming on Xen when kv_ro_of_fs by samoht · Pull Request #439", url: "https://github.com/mirage/mirage/pull/441"},
          {id: 2, type: "slack", title: "chat", url: "https://piersky.slack.com/archives/development/p1440218832000020"}]
        },
        {id: 2, name: "型推論アルゴリズム改良", elems: [
          {id: 3, type: "github", title: "Functoria by Drup · Pull Request #441", url: "https://github.com/mirage/mirage/pull/439"},
          {id: 4, type: "slack", title: "chat", url: "https://piersky.slack.com/archives/development/p1440218832000020"},
          {id: 5, type: "slack", title: "chat", url: "https://piersky.slack.com/archives/development/p1440218832000020"}
        ]
        }
      ]
    });
  }

  drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['date', 'Slack', 'Github'],
      ['2015/08/07',  1000,      400],
      ['2015/08/08',  1170,      460],
      ['2015/08/09',  1660,       1120],
      ['2015/08/10',  1030,      540],
      ['2015/08/11',  1200,      400],
      ['2015/08/12',  117,      260],
      ['2015/08/13',  360,       100],
      ['2015/08/14',  1030,      540],
      ['2015/08/15',  900,      400],
      ['2015/08/16',  1170,      460],
      ['2015/08/17',  660,       1120],
      ['2015/08/18',  1030,      540],
      ['2015/08/19',  200,      100],
      ['2015/08/20',  370,      60],
      ['2015/08/21',  660,       1120],
      ['2015/08/22',  1000,      400],
      ['2015/08/23',  1170,      460]
    ]);

    var options = {
      title: 'activity',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart1 = new google.visualization.LineChart(document.getElementById('graph1'));

    chart1.draw(data, options);
    var chart2 = new google.visualization.LineChart(document.getElementById('graph2'));

    chart2.draw(data, options);
  }

  render() {
    google.setOnLoadCallback(this.drawChart);
    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('integration.board.index')}</p>
        <div className='objs-container'>
          <div className='add-button'>
            <div className='icon-area'>
              <span className='icon icon-ic_add_24px' />
            </div>
            {I18n.t('integration.piersky.add')}
          </div>
        {this.state.objects.map(function(obj){
          let graph = 'graph'+obj.id;
          return (
            <div className='obj'>
              <h3> {obj.name} </h3>
              <ul>
              {obj.elems.map(function(elem){
                return (
                    <a href={elem.url}>
                    <li id={elem.id}>
                      <div className='icon-area'>
                        <span className={['icon', elem.type + '-logo'].join(' ')} />
                      </div>
                      {elem.title}
                    </li>
                    </a>
                    );
              })}
              </ul>
              <div id={graph} />
            </div>
          );
        })}
        </div>
        <p className='subtitle'>
          {I18n.t('integration.general.no_integrations')}
          <Link to='integrations-new'>
            {I18n.t('integration.general.setup')}
          </Link>
        </p>
      </div>
    );
  }
}

export default IntegrationsIndex;
