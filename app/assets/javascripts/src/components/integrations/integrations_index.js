import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import Constants from '../../constants/app';

import IntegrationAction from '../../actions/integration';

class IntegrationsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return _.extend({
      objects: [ 
        {id: 1, name: "test", elems: [
          {id: 1, type: "github", title: "internet", url: "https://github.com/mirage/mirage/pull/441"},
          {id: 2, type: "slack", title: "chat", url: "https://piersky.slack.com/archives/development/p1440218832000020"}]
        },
        {id: 2, name: "test2", elems: [
          {id: 3, type: "github", title: "not_java", url: "https://github.com/mirage/mirage/pull/439"},
          {id: 4, type: "slack", title: "chat", url: "https://piersky.slack.com/archives/development/p1440218832000020"},
          {id: 5, type: "slack", title: "chat", url: "https://piersky.slack.com/archives/development/p1440218832000020"}
        ]
        }
      ]
    });
  }

  render() {
    return (
      <div className='container-main'>
        <div className='objs-container'>
          <div className='add-button'>
            <div className='icon-area'>
              <span className='icon icon-ic_add_24px' />
            </div>
            {I18n.t('integration.piersky.add')}
          </div>
        {this.state.objects.map(function(obj){
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
            </div>
          );
        })}
        </div>
        <p className='title'>{I18n.t('integration.board.index')}</p>
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
