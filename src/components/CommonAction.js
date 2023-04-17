import CommonButton from "./CommonButton";
import {Action as ActionConst} from "../constants/Constants";
import React from "react";
import PropTypes from "prop-types";

const CommonAction = (props) => {
    return <div style={{textAlign: "center"}}>
        <CommonButton type="actionTable" action={ActionConst.VIEW} disabled={!props.showView}
                      hidden={props.isHidden && !props.showView}
                      onClick={props.onClickView}>
            <i className="fa-regular fa-eye"/>
        </CommonButton>
        {/*<CommonButton type="actionTable" action={ActionConst.INSERT} disabled={!props.showView}  hidden={!props.showDuplicate}*/}
        {/*              onClick={props.onClickDuplicate}>*/}
        {/*    <i className="fa-regular fa-copy"/>*/}
        {/*</CommonButton>*/}
        <CommonButton type="actionTable" action={ActionConst.UPDATE} disabled={!props.showUpdate}
                      hidden={props.isHidden && !props.showUpdate}
                      onClick={props.onClickUpdate}>
            <i className="fa-regular fa-pen-to-square"/>
        </CommonButton>
        <CommonButton type="actionTable" action={ActionConst.DELETE} disabled={!props.showDelete}
                      hidden={props.isHidden && !props.showDelete}
                      onClick={props.onClickDelete}>
            <i className="fa-regular fa-trash-can"/>
        </CommonButton>
    </div>;
};

CommonAction.defaultProps = {
    isHidden: true,
    showView: false,
    showUpdate: false,
    showDelete: false,
};
CommonAction.propTypes = {
    onClickView: PropTypes.func,
    onClickDuplicate: PropTypes.func,
    onClickUpdate: PropTypes.func,
    onClickDelete: PropTypes.func,
    showView: PropTypes.bool,
    showDuplicate: PropTypes.bool,
    showUpdate: PropTypes.bool,
    showDelete: PropTypes.bool,
    isHidden: PropTypes.bool
};

export default CommonAction;
