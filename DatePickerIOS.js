/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * This is a controlled component version of RCTDatePickerIOS
 *
 * @format
 * @flow
 */

'use strict';

import React from 'react';
import { StyleSheet, View, requireNativeComponent } from 'react-native';
const invariant = require('fbjs/lib/invariant');

import type { ViewProps } from 'ViewPropTypes';

const RCTDatePickerIOS = requireNativeComponent('RNDatePicker');

type Event = Object;

type Props = $ReadOnly<{|
  ...ViewProps,

  /**
   * The currently selected date.
   */
  date ?: ? Date,

  /**
   * Provides an initial value that will change when the user starts selecting
   * a date. It is useful for simple use-cases where you do not want to deal
   * with listening to events and updating the date prop to keep the
   * controlled state in sync. The controlled state has known bugs which
   * causes it to go out of sync with native. The initialDate prop is intended
   * to allow you to have native be source of truth.
   */
  initialDate ?: ? Date,

  /**
   * The date picker locale.
   */
  locale ?: ? string,

  /**
   * Maximum date.
   *
   * Restricts the range of possible date/time values.
   */
  maximumDate ?: ? Date,

  /**
   * Minimum date.
   *
   * Restricts the range of possible date/time values.
   */
  minimumDate ?: ? Date,

  /**
   * The interval at which minutes can be selected.
   */
  minuteInterval ?: ? (1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30),

  /**
   * The date picker mode.
   */
  mode ?: ? ('date' | 'time' | 'datetime'),

  /**
   * Date change handler.
   *
   * This is called when the user changes the date or time in the UI.
   * The first and only argument is an Event. For getting the date the picker
   * was changed to, use onDateChange instead.
   */
  onChange ?: ? (event: Event) => void,

  /**
   * Date change handler.
   *
   * This is called when the user changes the date or time in the UI.
   * The first and only argument is a Date object representing the new
   * date and time.
   */
  onDateChange: (date: Date) => void,

    /**
     * Timezone offset in minutes.
     *
     * By default, the date picker will use the device's timezone. With this
     * parameter, it is possible to force a certain timezone offset. For
     * instance, to show times in Pacific Standard Time, pass -7 * 60.
     */
    timeZoneOffsetInMinutes ?: ? number,
|}>;

/**
 * Use `DatePickerIOS` to render a date/time picker (selector) on iOS.  This is
 * a controlled component, so you must hook in to the `onDateChange` callback
 * and update the `date` prop in order for the component to update, otherwise
 * the user's change will be reverted immediately to reflect `props.date` as the
 * source of truth.
 */
export default class DatePickerIOS extends React.Component<Props> {
  static DefaultProps = {
    mode: 'datetime',
  };

  // $FlowFixMe How to type a native component to be able to call setNativeProps
  _picker: ?React.ElementRef<typeof RCTDatePickerIOS> = null;

  componentDidUpdate() {
    if (this.props.date) {
      const propsTimeStamp = this.props.date.getTime();
      if (this._picker) {
        this._picker.setNativeProps({
          date: propsTimeStamp,
        });
      }
    }
  }

  _onChange = (event: Event) => {
    const nativeTimeStamp = event.nativeEvent.timestamp;
    this.props.onDateChange &&
      this.props.onDateChange(new Date(nativeTimeStamp));
    this.props.onChange && this.props.onChange(event);
  };

  render() {
    const props = this.props;
    invariant(
      props.date || props.initialDate,
      'A selected date or initial date should be specified.',
    );
    return (
      <RCTDatePickerIOS
        key={this.props.textColor} // preventing "Today" string keep old text color when text color changes
        ref={picker => {
          this._picker = picker;
        }}
        style={[styles.datePickerIOS, props.style]}
        date={
          props.date
            ? props.date.getTime()
            : props.initialDate
              ? props.initialDate.getTime()
              : undefined
        }
        locale={props.locale ? props.locale : undefined}
        maximumDate={
          props.maximumDate ? props.maximumDate.getTime() : undefined
        }
        minimumDate={
          props.minimumDate ? props.minimumDate.getTime() : undefined
        }
        mode={props.mode}
        minuteInterval={props.minuteInterval}
        timeZoneOffsetInMinutes={props.timeZoneOffsetInMinutes}
        onChange={this._onChange}
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        textColor={props.textColor}
      />
    );
  }
}

const styles = StyleSheet.create({
  datePickerIOS: {
    height: 216,
    width: 310,
  },
});
