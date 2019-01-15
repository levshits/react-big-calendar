'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

exports.__esModule = true
exports.default = withDragAndDrop
exports.withDragAndDropContenxt = withDragAndDropContenxt

var _extends2 = _interopRequireDefault(
  require('@babel/runtime/helpers/extends')
)

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutPropertiesLoose')
)

var _inheritsLoose2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inheritsLoose')
)

var _propTypes = _interopRequireDefault(require('prop-types'))

var _react = _interopRequireDefault(require('react'))

var _classnames = _interopRequireDefault(require('classnames'))

var _propTypes2 = require('../../utils/propTypes')

var _EventWrapper = _interopRequireDefault(require('./EventWrapper'))

var _EventContainerWrapper = _interopRequireDefault(
  require('./EventContainerWrapper')
)

var _WeekWrapper = _interopRequireDefault(require('./WeekWrapper'))

var _common = require('./common')

/**
 * Creates a higher-order component (HOC) supporting drag & drop and optionally resizing
 * of events:
 *
 * ```js
 *    import Calendar from 'react-big-calendar'
 *    import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
 *    export default withDragAndDrop(Calendar)
 * ```
 * (you can optionally pass any dnd backend as an optional second argument to `withDragAndDrop`.
 * It defaults to `react-dnd-html5-backend` which you should probably include in
 * your project if using this default).
 *
 * Set `resizable` to true in your calendar if you want events to be resizable.
 *
 * The HOC adds `onEventDrop` and `onEventResize` callback properties if the events are
 * moved or resized. They are called with these signatures:
 *
 * ```js
 *    function onEventDrop({ event, start, end, allDay }) {...}
 *    function onEventResize(type, { event, start, end, allDay }) {...}  // type is always 'drop'
 * ```
 *
 * Moving and resizing of events has some subtlety which one should be aware of.
 *
 * In some situations, non-allDay events are displayed in "row" format where they
 * are rendered horizontally. This is the case for ALL events in a month view. It
 * is also occurs with multi-day events in a day or week view (unless `showMultiDayTimes`
 * is set).
 *
 * When dropping or resizing non-allDay events into a the header area or when
 * resizing them horizontally because they are displayed in row format, their
 * times are preserved, only their date is changed.
 *
 * If you care about these corner cases, you can examine the `allDay` param suppled
 * in the callback to determine how the user dropped or resized the event.
 *
 * @param {*} Calendar
 * @param {*} backend
 */
function withDragAndDrop(Calendar) {
  var CalendarWrapper =
    /*#__PURE__*/
    (function(_React$Component) {
      ;(0, _inheritsLoose2.default)(CalendarWrapper, _React$Component)

      function CalendarWrapper() {
        var _this

        for (
          var _len = arguments.length, args = new Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          args[_key] = arguments[_key]
        }

        _this =
          _React$Component.call.apply(_React$Component, [this].concat(args)) ||
          this
        var components = _this.props.components
        _this.components = (0, _common.mergeComponents)(components, {
          eventWrapper: _EventWrapper.default,
          eventContainerWrapper: _EventContainerWrapper.default,
          weekWrapper: _WeekWrapper.default,
        })
        return _this
      }

      var _proto = CalendarWrapper.prototype

      _proto.render = function render() {
        var _this$props = this.props,
          selectable = _this$props.selectable,
          props = (0, _objectWithoutPropertiesLoose2.default)(_this$props, [
            'selectable',
          ])
        var interacting = this.state.interacting
        props.selectable = selectable ? 'ignoreEvents' : false
        props.className = (0, _classnames.default)(
          props.className,
          'rbc-addons-dnd',
          !!interacting && 'rbc-addons-dnd-is-dragging'
        )
        return _react.default.createElement(
          Calendar,
          (0, _extends2.default)({}, props, {
            components: this.components,
          })
        )
      }

      return CalendarWrapper
    })(_react.default.Component)

  CalendarWrapper.propTypes = {
    selectable: _propTypes.default.oneOf([true, false, 'ignoreEvents']),
    resizable: _propTypes.default.bool,
    components: _propTypes.default.object,
    step: _propTypes.default.number,
  }
  CalendarWrapper.defaultProps = {
    components: {},
    draggableAccessor: null,
    resizableAccessor: null,
    step: 30,
  }
  return CalendarWrapper
}

function withDragAndDropContenxt(Element) {
  var DragAndDropContenxt =
    /*#__PURE__*/
    (function(_React$Component2) {
      ;(0, _inheritsLoose2.default)(DragAndDropContenxt, _React$Component2)

      function DragAndDropContenxt() {
        var _this2

        for (
          var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
          _key2 < _len2;
          _key2++
        ) {
          args[_key2] = arguments[_key2]
        }

        _this2 =
          _React$Component2.call.apply(
            _React$Component2,
            [this].concat(args)
          ) || this

        _this2.handleBeginAction = function(event, action, direction) {
          _this2.setState({
            event: event,
            action: action,
            direction: direction,
          })
        }

        _this2.handleInteractionStart = function() {
          if (_this2.state.interacting === false)
            _this2.setState({
              interacting: true,
            })
        }

        _this2.handleInteractionEnd = function(interactionInfo) {
          var _this2$state = _this2.state,
            action = _this2$state.action,
            event = _this2$state.event
          if (!action) return

          _this2.setState({
            action: null,
            event: null,
            interacting: false,
            direction: null,
          })

          if (interactionInfo == null) return
          interactionInfo.event = event
          if (action === 'move') _this2.props.onEventDrop(interactionInfo)
          if (action === 'resize') _this2.props.onEventResize(interactionInfo)
        }

        _this2.state = {
          interacting: false,
        }
        return _this2
      }

      var _proto2 = DragAndDropContenxt.prototype

      _proto2.getChildContext = function getChildContext() {
        return {
          draggable: {
            onStart: this.handleInteractionStart,
            onEnd: this.handleInteractionEnd,
            onBeginAction: this.handleBeginAction,
            draggableAccessor: this.props.draggableAccessor,
            resizableAccessor: this.props.resizableAccessor,
            dragAndDropAction: this.state,
          },
        }
      }

      _proto2.render = function render() {
        var props = (0, _extends2.default)({}, this.props)
        delete props.onEventDrop
        delete props.onEventResize
        return _react.default.createElement(Element, props)
      }

      return DragAndDropContenxt
    })(_react.default.Component)

  DragAndDropContenxt.propTypes = {
    onEventDrop: _propTypes.default.func,
    onEventResize: _propTypes.default.func,
    draggableAccessor: _propTypes2.accessor,
    resizableAccessor: _propTypes2.accessor,
  }
  DragAndDropContenxt.defaultProps = {
    draggableAccessor: null,
    resizableAccessor: null,
  }
  DragAndDropContenxt.childContextTypes = {
    draggable: _propTypes.default.shape({
      onStart: _propTypes.default.func,
      onEnd: _propTypes.default.func,
      onBeginAction: _propTypes.default.func,
      draggableAccessor: _propTypes2.accessor,
      resizableAccessor: _propTypes2.accessor,
      dragAndDropAction: _propTypes.default.object,
    }),
  }
  return DragAndDropContenxt
}
