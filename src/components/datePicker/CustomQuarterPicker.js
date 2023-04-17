import React, { useEffect, useState } from "react";
import { DatePicker } from 'antd';
import { DateUtils } from 'utils/DateUtils';
import moment from "moment";

const CustomQuarterPicker = (props) => {
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
        result.quarterYear = DateUtils.convertDateToString(e._d, props.format.outputFormat.quarterYearFormat);
        result.quarter = DateUtils.convertDateToString(e._d, props.format.outputFormat.quarterFormat);
        result.year = DateUtils.convertDateToString(e._d, props.format.outputFormat.yearFormat);

        let dayStart = "";
        let dayEnd = "";
        switch (result.quarter) {
          case "1":
            dayStart = "01/01/";
            dayEnd = "31/03/";
            break;

          case "2":
            dayStart = "01/04/";
            dayEnd = "30/06/";
            break;

          case "3":
            dayStart = "01/07/";
            dayEnd = "30/09/";
            break;

          case "4":
            dayStart = "01/10/";
            dayEnd = "31/12/";
            break;

          default:
            break;
        };

        result.startDate = DateUtils.convertDateToString(moment(dayStart + result.year, "DD/MM/YYYY"), props.format.outputFormat.startDateFormat);
        result.endDate = DateUtils.convertDateToString(moment(dayEnd + result.year, "DD/MM/YYYY"), props.format.outputFormat.endDateFormat);
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
        picker={'quarter'}
        showTime
        onChange={onChange} />
    </>
  );
}
export default CustomQuarterPicker;