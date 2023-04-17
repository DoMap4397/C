import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "antd";

const CommonTooltip = ({ title: p_title, ...props }) => {

    const selectComponent = () => {
        if (p_title) {
            return <Tooltip
                {...props} title={p_title}
                mouseEnterDelay={0.03}
                mouseLeaveDelay={0} />;
        }
        else {
            return <div
                onMouseEnter={openTooltip(p_title)}
                onMouseLeave={closeTooltip}
                {...props} />
        }
    };

    return (selectComponent());
}

export default React.memo(CommonTooltip);

export const openTooltip = (title, x = 10, y = 0) => (e) => {
    let content = e.target.innerText;

    if (title) {
        content = title;
    }

    if (content.trim() === "") return;

    document.getElementById("common-tooltip").innerHTML = content;

    document.getElementById("common-tooltip").style.visibility = "visible";
    document.getElementById("common-tooltip").style.opacity = "1";
    document.getElementById("common-tooltip").style.top = (e.pageY + y) + "px";
    document.getElementById("common-tooltip").style.left = (e.pageX + x) + "px";
};

export const closeTooltip = (e) => {
    document.getElementById("common-tooltip").style.visibility = "hidden";
    document.getElementById("common-tooltip").style.opacity = "0";
};

CommonTooltip.propTypes = {
    title: PropTypes.string,
};