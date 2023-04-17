import React from "react";

const CommonFieldset = (props) => {
    return (
    <fieldset 
    {...props}
    className={ "common-fieldset " + props.className}/>
    );
}

export default CommonFieldset;