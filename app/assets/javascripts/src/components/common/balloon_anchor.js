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
    React.findDOMNode(this).addEventListener('click', this._toggleBalloon);
    document.body.addEventListener('click', this._hideBalloon);

    BalloonStore.addChangeListener(this.onChangeHandler);
  }

  componentWillUnmount() {
    React.findDOMNode(this).removeEventListener('click', this._toggleBalloon)
    document.body.removeEventListener('click', this._hideBalloon);

    BalloonStore.removeChangeListener(this.onChangeHandler);
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
        isButtom: this.props.isBottom});
    }
  }

  _hideBalloon(e) {
    if (e.isBalloonInnerEvent) return true;
    if (e.type === 'click' && e.button !== 0) return;
    if (this.state.balloon) {
      BalloonAction.closeBalloon();
    }
  }

  render: function() {
    return (
      <span className='sky-balloon-anchor-area'>
        {this.props.defaultContent}
        <span className='sky-balloon-anchor' />
      </span>
    );
  }
});

export default BalloonAnchor;
