import React from 'react';
import assign from 'object-assign';
import _ from 'lodash';
import AppModule from '../../utils/app_module';

import BalloonAction from '../../actions/balloon';
import BalloonStore from '../../stores/balloon';

class BalloonAnchor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
    this.toggleBalloonHandler = this._toggleBalloon.bind(this);
    this.hideBalloonHandler = this._hideBalloon.bind(this);
  }

  static get defaultProps() {
    return {
      defaultContent: <span />,
      balloonContent: <span />,
      isBottom: false
    };
  }

  static get propTypes() {
    return {
      defaultContent: React.PropTypes.element,
      balloonContent: React.PropTypes.element,
      isBottom: React.PropTypes.bool
    };
  }

  get initialState() {
    let uid = AppModule.getUid();
    return {
      uid: uid,
      balloon: null
    }
  }

  componentDidMount() {
    React.findDOMNode(this).addEventListener('click', this.toggleBalloonHandler);
    document.body.addEventListener('click', this.hideBalloonHandler);

    BalloonStore.onChange(this.onChangeHandler);
  }

  componentWillUnmount() {
    React.findDOMNode(this).removeEventListener('click', this.toggleBalloonHandler);
    document.body.removeEventListener('click', this.hideBalloonHandler);

    BalloonStore.offChange(this.onChangeHandler);
  }

  onChange() {
    this.setState({balloon: BalloonStore.getBalloon()});
  }

  _toggleBalloon(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.state.balloon && this.state.balloon.uid === this.state.uid) {
      BalloonAction.closeBalloon();
    } else {
      let anchorArea = React.findDOMNode(this);
      let anchorWidth = anchorArea.clientWidth;
      let anchorHeight = anchorArea.clientHeight;
      let rect = anchorArea.querySelector('.sky-balloon-anchor').getBoundingClientRect();

      BalloonAction.showBalloon({
        uid: this.state.uid,
        element: this.props.balloonContent,
        x: rect.left,
        y: rect.top,
        anchorWidth: anchorWidth,
        anchorHeight: anchorHeight,
        isButtom: this.props.isBottom
      });
    }
  }

  _hideBalloon(e) {
    if (e.isBalloonInnerEvent) return true;
    if (e.type === 'click' && e.button !== 0) return;
    if (this.state.balloon) {
      BalloonAction.closeBalloon();
    }
  }

  render() {
    return (
      <span className='sky-balloon-anchor-area'>
        {this.props.defaultContent}
        <span className='sky-balloon-anchor' />
      </span>
    );
  }
}

export default BalloonAnchor;
