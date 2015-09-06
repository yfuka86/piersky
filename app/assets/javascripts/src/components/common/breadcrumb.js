import React from 'react';
import _ from 'lodash';

class Breadcrumb extends React.Component {
  render() {
    return (
      <div className='breadcrumb'>
        {this.props.links.map((link) => {
          return (
            <div className='link'>
              {link}
            </div>
          );
        })}
        <div className='current'>
          {this.props.current}
        </div>
      </div>
    );
  }
}

export default Breadcrumb;
