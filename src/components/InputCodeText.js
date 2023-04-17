import React from 'react';
import PropTypes from "prop-types";
import {Input} from "antd";

const CommonInputCode = (props) => {

    const onChangeValue = (e) => {
        if (e.target && e.target.value) {
            e.target.value = String(e.target.value).trim().replace(/[^a-zA-Z0-9\n\r]+/g, '').toUpperCase();
        }
        if (props.onChange) {
            props.onChange(e);
        }
    }

    const {passingRef, ...rest} = props;
    return (<Input {...rest} ref={passingRef} keyfilter={/[a-zA-Z0-9]/}
                   style={{width: "100%"}}
                   onChange={onChangeValue}/>);
}
export default CommonInputCode;

CommonInputCode.propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};