import React, { useState, useRef, useEffect } from "react";
import { Progress } from 'reactstrap';
import { Tooltip } from 'antd';
import { DateUtils } from 'utils/DateUtils';

const _ = require('lodash');

const CommonSLA = (props) => {

  const [s_data, s_setData] = useState(props?.config);

  const ref_intervalId = useRef("");

  useEffect(() => {
    if (props?.config && props?.config?.current) {
      s_setData(props.config);
    }
    else if (props?.config) {
      ref_intervalId.current = setInterval(function () {
        s_setData(prev => {
          let next = { ...prev };

          next.current = DateUtils.getSysDate(next.format);

          return next;
        });
      }, 60000);
    }

    return () => {
      let intervalId = ref_intervalId.current;
      if (intervalId !== "") {
        clearInterval(intervalId);
      }
    };
  }, [props])

  const getTimeBetween = (date1, date2, format) => {

    let total = {};
    total.months = DateUtils.dateDiff(date1, date2, format, "months");
    total.days = DateUtils.dateDiff(date1, date2, format, "days") - (total.months * 30);
    total.hours = DateUtils.dateDiff(date1, date2, format, "hours") - (total.months * 30 * 24) - (total.days * 24);
    total.minutes = Math.round(DateUtils.dateDiff(date1, date2, format, "minutes", true)) - (total.months * 30 * 24 * 60) - (total.days * 24 * 60) - (total.hours * 60);

    let result = [];
    result.push(total.months > 0 ? total.months + " tháng " : "");
    result.push(total.days > 0 ? total.days + " ngày " : "");
    result.push(total.hours > 0 ? total.hours + " giờ " : "");
    result.push(total.minutes > 0 ? total.minutes + " phút" : "");

    return result.join("");
  };

  const genItem = () => {
    let data = { ...s_data };

    if (_.isEmpty(data)) {
      return <Progress
        className="common-sla"
        value={0}
      />
    }

    data.current = !data.current ? DateUtils.getSysDate(data.format) : data.current;

    let max = 100;
    let value = 0;
    let percent = 0;

    if (data?.isStarted === true) {
      max = DateUtils.dateDiff(data.end, data.start, data.format, "minutes");
      value = DateUtils.dateDiff(data.current, data.start, data.format, "minutes");
      percent = value / max * 100;
    }

    if (percent >= 100 || props?.config?.current) value = max;

    //#region Tooltip
    let total = getTimeBetween(data.end, data.start, data.format);
    let past = getTimeBetween(data.current, data.start, data.format);
    let rest = percent > 100 ? "" : getTimeBetween(data.end, data.current, data.format);
    //#endregion

    return <Tooltip color={'white'} title={<p style={{ whiteSpace: 'nowrap', color: 'black' }}>
      <b>{"Bước: " + data.name}</b>
      <br /> {"-Tổng thời gian của bước: " + total}
      {data?.isStarted === true ? <><br /> {"-Thời gian đã qua: " + past}</> : <></>}
      {rest !== "" && s_data?.isStarted && _.isEmpty(props?.config?.current) ? <><br /> {"-Thời gian còn lại: " + rest} </> : <></>}
    </p>}>
      <Progress
        className="common-sla"
        color={percent < 80 ? "success" : percent > 100 ? "danger" : "warning"}
        min={0}
        max={max}
        value={value}
      />
    </Tooltip>;
  };

  return (
    <>
      {genItem()}
    </>
  );
};

export default CommonSLA;

export const WrappedSLA = (props) => {
  return (<div {...props} className="wrapped-sla" />)
}
