import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Input } from 'antd';
import NumberFormat from "react-number-format";
import { Constants as AppConstants } from "constants/Constants";

const _ = require('lodash');

const CommonInputNumber = ({ onChange, value, ...props }) => {

    return <NumberFormat
        {...props}
        value={value < 0 ? Math.abs(value) : value}
        onValueChange={onChange ? (values) => { onChange(values); } : undefined}
        decimalSeparator={props.decimalSeparator || undefined}
        thousandSeparator={props.thousandSeparator || undefined}
    />;
}

CommonInputNumber.propTypes = {
    //value: PropTypes.number,
    isAllowed: PropTypes.func,
    allowLeadingZeros: PropTypes.bool,
};

CommonInputNumber.defaultProps = {
    decimalSeparator: AppConstants.NUMBER_FORMAT.DECIMAL_SEPARATOR,
    thousandSeparator: AppConstants.NUMBER_FORMAT.THOUSAND_SEPARATOR,
    allowLeadingZeros: true,
    customInput: Input,
};

export default CommonInputNumber;

export const isAllowedInt = (values) => {
    let value = _.toString(values["value"]);

    if (value.includes("-")) {
        return false;
    }

    if (value.includes(".")) {
        return false;
    }

    return true;
};

export const exceptionChar = (chars = []) => (values) => {
    let value = _.toString(values["value"]);

    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];

        if (value.includes(char)) {
            return false;
        }
    }

    return true;
};