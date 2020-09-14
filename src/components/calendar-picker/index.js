import React, { PureComponent } from 'react';
import Calendar from 'rc-calendar';
/*eslint-disable*/
import '!style-loader!css-loader!rc-calendar/assets/index.css';
import '!style-loader!css-loader!rc-time-picker/assets/index.css';
import DatePicker from 'rc-calendar/lib/Picker';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

function getFormat(time) {
  return time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
}

class CalendarPicker extends PureComponent {
  state = {
    disabled: false,
  };

  render() {
    const props = this.props;
    const cn = props.locale;

    const now = moment();
    if (cn === 'zh-CN') {
    now.locale('zh-cn').utcOffset(8);
    } else {
    now.locale('en-gb').utcOffset(0);
    }

    const calendar = (
      <Calendar
        locale={cn === 'zh-CN' ? zhCN : enUS}
        defaultValue={now}
        timePicker={props.showTime ? <TimePickerPanel/> : null}
        disabledDate={props.disabledDate}
        onClear ={() => {
          props.onChange(null)
        }}
      />
    );
    return (
      <DatePicker
        animation="slide-up"
        disabled={props.disabled}
        calendar={calendar}
        value={props.value}
        onChange={props.onChange}
      >
        {({ value }) => {
          return (
            <span>
              <input
                disabled={props.disabled}
                readOnly
                value={(value && value.format(getFormat(props.showTime))) || ''}
              />
            </span>
          );
        }}
      </DatePicker>
    );
  }
}

export default CalendarPicker;