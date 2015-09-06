import React from 'react';

import BalloonStore from '../../stores/balloon';

class Balloon extends React.Component {

  constructor(props){
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    var balloon = BalloonStore.getBalloon() || {};
    return {
      element: balloon.element,
      x: balloon.x,
      y: balloon.y,
      anchorWidth: balloon.anchorWidth,
      anchorHeight: balloon.anchorHeight,
      isButtom: balloon.isButtom
    };
  }

  componentDidMount() {
    React.findDOMNode(this).addEventListener('click', this._handleClick);
    BalloonStore.onChange(this.onChangeHandler);
  }

  componentWillUnmount() {
    React.findDOMNode(this).removeEventListener('click', this._handleClick);
    BalloonStore.offChange(this.onChangeHandler);
  }

  onChange() {
    this.setState(this.initialState);
  }

  componentDidUpdate() {
    if (this.state.element) {
      let balloon = this._getBalloonElement();

      balloon.style.left = this._balloonStyleLeft() + 'px';
      balloon.style.top = this._balloonStyleTop() + 'px';
    }
  }

  _getBalloonElement() {
    return React.findDOMNode(this).querySelector('.sky-balloon');
  }

  _balloonStyleLeft() {
    let left = this.state.x;
    let balloon = this._getBalloonElement();

    if (this.state.isButtom) {
      left -= this.state.anchorWidth / 2;
    }
    if (left + balloon.clientWidth > window.innerWidth) {
      left -= (balloon.clientWidth - this.state.anchorWidth / 2);
    }
    return left;
  }

  _balloonStyleTop() {
    let top = this.state.y;
    let balloon = this._getBalloonElement();
    let protrusion = top + balloon.clientHeight - window.innerHeight;

    if (this.state.isButtom) {
      top += (this.state.anchorHeight - 10);
    } else {
      if (protrusion > 0) {
        top -= (protrusion + 20);
      }
    }
    return top;
  }

  _handleClick(e) {
    e.isBalloonInnerEvent = true;
  }

  render() {
    return (
      <div className='sky-balloon-container'>
        {this.state.element ? (
          <div className='sky-balloon'>
            <div className='sky-balloon-inner'>
              {this.state.element}
            </div>
          </div>
        ) : (
          <span />
        )}
      </div>
    );
  }
}

export default Balloon;
