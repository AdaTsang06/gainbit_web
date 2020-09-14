import React, { Fragment} from 'react';
import CalendarPicker from '../calendar-picker';

const TimeRange = (props) => {
    const disabledEndDate = endValue => {
        if (!endValue) {
          return false;
        }
        const startValue = props.startValue;
        if (!startValue) {
          return false;
        }
        return endValue.isBefore(startValue);
      };
    
      const disabledStartDate = startValue => {
        if (!startValue) {
          return false;
        }
        const endValue = props.endValue;
        if (!endValue) {
          return false;
        }
        //return endValue.isBefore(startValue);
        return false;
    };

    return <Fragment>
        <CalendarPicker
        disabledDate={disabledStartDate}
        value={props.startValue}
        name="start"
        onChange={(value) => {
          if(props.endValue && props.endValue.isBefore(value)){
            props.onChange('endValue',value)
          }
          props.onChange('startValue',value)
        }}
        showTime={props.showTime}
        />
        <span>-</span>
        <CalendarPicker
        disabledDate={disabledEndDate}
        value={props.endValue}
        name="end"
        onChange={(value) => props.onChange('endValue',value)}
        showTime={props.showTime}
        />
    </Fragment>
}

export default TimeRange;