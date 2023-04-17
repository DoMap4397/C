import React from 'react';
import NumberFormat from "react-number-format";
import PropTypes from 'prop-types';
import {StringUtils} from "../utils/StringUtils";
import {Constants} from "../constants/Constants";

const _ = require('lodash');
const InputNumber = (props) => {

    const handleChangeValue = (e) => {
        let value = String(e.value);
        if (!StringUtils.stringNullOrEmpty(value)) {
            let number = value.split(Constants.NUMBER_FORMAT.THOUSAND_SEPARATOR);
            const remainNumber = props.remainNumber && value.includes('-') ? props.remainNumber + 1 : props.remainNumber;
            number[0] = number[0].substring(0, remainNumber);
            if (!StringUtils.stringNullOrEmpty(props.minimum)) {
                const bigInt = require('big-integer');
                if (bigInt(number[0]).compare(String(props.minimum)) === -1) {
                    number[0] = String(props.minimum);
                }
            }
            if (!StringUtils.stringNullOrEmpty(props.maximum)) {
                const bigInt = require('big-integer');
                if (bigInt(number[0]).compare(String(props.maximum)) === 1) {
                    number[0] = String(props.maximum);
                }
            }
            if (props.decimalScale) {
                value = number.join(".");
            } else {
                value = number[0];
            }
        }
        console.log("InputNumber", value)
        if (props.onValueChange) {
            props.onValueChange({value: value});
        }
    };

    return (
        <NumberFormat
            className={"ant-input"}
            {...props}
            decimalSeparator={props.decimalSeparator || Constants.NUMBER_FORMAT.DECIMAL_SEPARATOR}
            value={StringUtils.stringNullOrEmpty(props.value) ? '' : props.value.toString().replace(".", ",")}
            style={{
                width: "100%",
                textAlign: props.textAlign,
                // color: props.value && String(props.value).includes('-') ? "red" : "#0113ff",
                ...props.style
            }}
            onValueChange={handleChangeValue}
        />
    );

}


InputNumber.propTypes = {
    thousandSeparator: PropTypes.string,
    decimalSeparator: PropTypes.string,
    textAlign: PropTypes.string,
    onValueChange: PropTypes.func,
    allowNegative: PropTypes.bool,
    remainNumber: PropTypes.number,
    decimalScale: PropTypes.number,

};

InputNumber.defaultProps = {
    thousandSeparator: Constants.NUMBER_FORMAT.THOUSAND_SEPARATOR,
    textAlign: "right"
};
export default InputNumber;