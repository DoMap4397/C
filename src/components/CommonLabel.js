import React from "react";
import PropTypes from "prop-types";

const CommonLabel = (props) => {
    return (
        <label className="common-label" style={props.style} title={props.title}>
            {props.children}
            {props.required ? <b>*</b> : null}
        </label>
    );
}

export default CommonLabel;

CommonLabel.propTypes = {
    required: PropTypes.bool
};