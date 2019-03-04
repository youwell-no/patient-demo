// Stripped and adjusted from https://github.com/SupremeTechnopriest/react-idle-timer

import * as React from 'react';
import PropTypes from 'prop-types';

const IS_BROWSER = (typeof window === 'undefined' ? 'undefined' : typeof window) === 'object';
const DEFAULT_ELEMENT = IS_BROWSER ? document : {};
const DEFAULT_EVENTS = [
    'mousemove',
    'keydown',
    'wheel',
    'DOMMouseScroll',
    'mouseWheel',
    'mousedown',
    'touchstart',
    'touchmove',
    'MSPointerDown',
    'MSPointerMove',
];

export default class IdleTimer extends React.Component {
  static propTypes = {
      timeoutInMinutes: PropTypes.number,
      onIdle: PropTypes.func,
      onActive: PropTypes.func,
  }

  static defaultProps = {
      timeoutInMinutes: 60,
      onIdle: () => {},
      onActive: () => {},
  }

  state = {
      idle: false,
      oldDate: +new Date(),
      lastActive: +new Date(),
      pageX: null,
      pageY: null,
  }

  tId = null

  componentDidMount() {
      if (!IS_BROWSER) return;

      DEFAULT_EVENTS.forEach((e) => {
          DEFAULT_ELEMENT.addEventListener(e, this.handleEvent, {
              capture: true,
              passive: true,
          });
      });

      this.reset();
  }

  componentWillUnmount() {
      clearTimeout(this.tId);
      if (!IS_BROWSER) return;
      DEFAULT_EVENTS.forEach((e) => {
          DEFAULT_ELEMENT.removeEventListener(e, this.handleEvent, {
              capture: true,
              passive: true,
          });
      });
  }

  toggleIdleState = (e) => {
      const { idle } = this.state;
      this.setState({
          idle: !idle,
      });

      const { onActive, onIdle } = this.props;
      if (idle) {
          onActive(e);
      } else {
          onIdle(e);
      }
  }

  handleEvent = (e) => {
      const { pageX, pageY } = this.state;

      // Mousemove event
      if (e.type === 'mousemove') {
      // If coord are same, it didn't move
          if (e.pageX === pageX && e.pageY === pageY) {
              return;
          }
          // If coord don't exist how could it move
          if (typeof e.pageX === 'undefined' && typeof e.pageY === 'undefined') {
              return;
          }
          // Under 200 ms is hard to do
          // continuous activity will bypass this
          const elapsed = this.getElapsedTime();
          if (elapsed < 200) {
              return;
          }
      }

      // Clear any existing timeout
      clearTimeout(this.tId);

      // If the idle timer is enabled, flip
      if (this.state.idle) {
          this.toggleIdleState(e);
      }

      // Store when the user was last active
      // and update the mouse coordinates
      this.setState({
          lastActive: +new Date(), // store when user was last active
          pageX: e.pageX, // update mouse coord
          pageY: e.pageY,
      });

      // Set a new timeout
      const { timeoutInMinutes } = this.props;
      this.tId = setTimeout(this.toggleIdleState, timeoutInMinutes * 60 * 1000); // set a new timeout
  }

  reset = () => {
      // Clear timeout
      clearTimeout(this.tId);

      // Reset state
      this.setState(prevState => ({
          idle: false,
          oldDate: +new Date(),
          lastActive: prevState.oldDate,
      }));

      // Set new timeout
      const { timeoutInMinutes } = this.props;
      this.tId = setTimeout(this.toggleIdleState, timeoutInMinutes * 60 * 1000); // set a new timeout
  }

  getRemainingTime = () => {
      const { idle, lastActive } = this.state;
      // If idle there is no time remaining
      if (idle) {
          return 0;
      }

      // Determine remaining, if negative idle didn't finish flipping, just return 0
      const { timeoutInMinutes } = this.props;
      let timeLeft = (timeoutInMinutes * 60 * 1000) - (+new Date() - lastActive);
      if (timeLeft < 0) {
          timeLeft = 0;
      }
      return timeLeft;
  }

  getElapsedTime = () => {
      const { oldDate } = this.state;
      return +new Date() - oldDate;
  }

  getLastActiveTime = () => {
      const { lastActive } = this.state;
      return lastActive;
  }

  isIdle = () => this.state.idle

  render() {
      return null;
  }
}
