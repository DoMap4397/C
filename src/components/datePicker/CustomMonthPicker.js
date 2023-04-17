import React, { useEffect, useState } from "react";
import { DatePicker } from 'antd';
import { DateUtils } from 'utils/DateUtils';

const CustomMonthPicker = (props) => {
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
        result.monthYear = DateUtils.convertDateToString(e._d, props.format.outputFormat.monthYearFormat);
        result.month = DateUtils.convertDateToString(e._d, props.format.outputFormat.monthFormat);
        result.year = DateUtils.convertDateToString(e._d, props.format.outputFormat.yearFormat);
        result.startDate = DateUtils.getDayOfMonth(1, result.month, result.year, props.format.outputFormat.startDateFormat);
        result.endDate = DateUtils.getDayOfMonth(31, result.month, result.year, props.format.outputFormat.endDateFormat);
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
        picker={'month'}
        showTime
        onChange={onChange} />
    </>
  );
}
export default CustomMonthPicker;