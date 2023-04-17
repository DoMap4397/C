import React from "react";
import { StringUtils } from 'utils//StringUtils';

const CommonValidTooltip = (props) => {
    return (
        <div className="tooltip-validate">
            <div className="tooltip-validate-content"  hidden={StringUtils.stringNullOrEmpty(props.children)}>
                {props.children}
            </div>
        </div>

    );
}

export default CommonValidTooltip;
