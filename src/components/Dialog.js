import React, {useMemo, useState} from "react";
import store from "redux/store";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {Modal} from "reactstrap";
import {getDialogItems,} from "redux/selectors/dialogSelectors";
import {getRegistrationCircleLoading} from "redux/selectors/circleLoadingSelectors";
import {setDialogItems} from "redux/actions/dialogActions";
import {v4 as uuidv4} from 'uuid';
import ErrorBoundary from "components/default/ErrorBoundary";
import {Trans} from "../translation/i18n";
import {showConfirm} from "./MessageBox";
import {cmpStr2Num} from "../utils/NumberUtils";

const _ = require('lodash');

const Dialog = (props) => {

    const r_dialogItems = useSelector(getDialogItems);

    //#region Event

    //#endregion

    //#region Method
    const genContent = (lstContent) => {
        const lstDialog = lstContent.map((item) => {
            // console.log('genContent', item);
            return <DialogItem key={uuidv4()} id={item.id} options={item.options}>{item.content}</DialogItem>
        });

        return lstDialog;
    }
    //#endregion

    return (
        <>
            {/* {genContent(r_dialogItems)} */}
            {useMemo(() => genContent(r_dialogItems), [r_dialogItems])}
        </>
    );
};

export default withTranslation(["common"])(Dialog);


export const DialogItem = ({id: p_id, ...props}) => {
    const [s_isOpen, s_setIsOpen] = useState(true);

    const r_registration = useSelector(getRegistrationCircleLoading);

    const onToggleDialog = () => {
        try {
            if (r_registration > 0) {
                return;
            }
            
            let xpath = '//*[contains(@class, "dialog-style")]//button[@class="btn-close"]';
            let elements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            if (elements?.snapshotLength > 0) {
                let lastElement = elements.snapshotItem(elements?.snapshotLength - 1);
                lastElement.click();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal
                className="dialog-style"
                backdrop={"static"}
                scrollable={false}
                zIndex={1050}
                isOpen={s_isOpen}
                {...props.options}
                toggle={onToggleDialog}
            >
                <button hidden name="closeDialog" id={p_id} onClick={() => s_setIsOpen(false)}/>
                <ErrorBoundary>
                    {props.children}
                </ErrorBoundary>
            </Modal>
        </>
    );
}

export const showDialog = (dialogContent, dialogId = uuidv4(), dialogOptions = {}) => {
    let dialogItems = [...store.getState().dialog.dialogItems];

    const optionsDefault = {
        size: "xl",
    };

    if (!dialogOptions.fullscreen) {
        optionsDefault.style = {maxWidth: "70%"}
    }

    dialogItems.push({
        id: dialogId,
        content: dialogContent,
        options: {...optionsDefault, ...dialogOptions},
    });

    store.dispatch(setDialogItems(dialogItems));

    return dialogId;
};

export const closeDialog = (dialogId, callback) => {
    if (dialogId) {
        document.getElementById(dialogId).click();
    } else {
        document.evaluate('//button[@name="closeDialog"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
    }
    setTimeout(
        () => {
            let dialogItems = [...store.getState().dialog.dialogItems];

            if (!dialogId) {
                dialogId = dialogItems[dialogItems.length - 1].id;
            }

            let newDialogItem = _.filter(dialogItems, (obj) => obj.id !== dialogId);
            store.dispatch(setDialogItems(newDialogItem));

            if (callback) {
                callback();
            }
        },
        100
    );
};


export const closeDialogCfm = (newData, confirm = true, callback) => {
    let dialogItems = [...store.getState().dialog.dialogItems];
    console.log("closeDialog new-old", newData, _.get(dialogItems[dialogItems.length - 1], 'content.props.options.data', {}));
    if (confirm && newData && dialogItems.length > 0 && !_.isEqualWith(newData, _.get(dialogItems[dialogItems.length - 1], 'content.props.options.data', {}), cmpStr2Num)) {
        showConfirm(
            <Trans ns="common" name="common.msg.confirmClose"/>,
            async () => {
                closeDialog();
            });
    } else {
        closeDialog();
    }
}
