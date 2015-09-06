import React from 'react';
import assign from 'object-assign';
import _ from 'lodash';

import BalloonAction from '../../actions/balloon';
import BalloonStore from '../../stores/balloon';
import BalloonAnchor from '../../components/common/balloon_anchor';

class DropDown extends React.Component {
  /*
  [{
    title: 'option',
    iconClass: 'icon-ic_person_24px',
    callback: function(){...}
  }...]
  */

  static get propTypes() {
    return {
      defaultContent: React.PropTypes.element.isRequired,
      options: React.PropTypes.array.isRequired
    };
  }

  handleClick(callback) {
    BalloonAction.closeBalloon();
    callback();
  }

  render() {
    let detailContent = (
      <div className='sky-dropdown'>
        <ul className='dropdown-menu'>
          {this.props.options.map((option) => {
            let icon;
            if (option.iconClass) {
              icon = <span className={[(option.iconClass[0] === 'i' ? 'icon' : 'fa'), option.iconClass].join(' ')} />
            } else {
              icon = <span />
            }
            return (
              <li onClick={this.handleClick.bind(this, option.callback)} key={option.title}>
                {icon}
                <span className='option'>{option.title}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <BalloonAnchor defaultContent={this.props.defaultContent} balloonContent={detailContent} isBottom={true} />
    );
  }
}

export default DropDown;

