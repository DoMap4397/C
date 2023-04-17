import React, { useEffect, useState } from "react";
import { DatePicker } from 'antd';
import { DateUtils } from 'utils/DateUtils';

const CustomWeekPicker = (props) => {
  const [s_value, s_setValue] = useState(null);

  useEffect(() => {
    let value = null;

    if (props.value) {
      value = DateUtils.convertStringToDate(props.value, props.format.inputFormat)
    }

    s_setValue(value);
  }, [props]);

  const onChange = (e) => {
    try {

      let result = {};
      if (e !== null && e._d !== null) {
        result.weekYear = DateUtils.convertDateToString(e._d, props.format.outputFormat.weekYearFormat);
        result.week = DateUtils.convertDateToString(e._d, props.format.outputFormat.weekFormat);
        result.year = DateUtils.convertDateToString(e._d, props.format.outputFormat.yearFormat);
        result.startDate = DateUtils.getDayOfWeek("Mon", result.week, result.year, props.format.outputFormat.startDateFormat);
        result.endDate = DateUtils.getDayOfWeek("Sun", result.week, result.year, props.format.outputFormat.endDateFormat);
      }

      props.onChange(result);

      s_setValue(e);

    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <>
      <DatePicker
        {...props}
        getPopupContainer={props.id ? () => document.getElementById("parent-" + props.id) : undefined}
        placeholder={props.format.viewFormat[0]}
        format={props.format.viewFormat}
        value={s_value}
        picker={'week'}
        showTime
        onChange={onChange} />
    </>
  );
}
export default CustomWeekPicker;