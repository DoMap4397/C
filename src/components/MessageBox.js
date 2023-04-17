import React from "react";
import store from "redux/store";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import CommonButton from "components/CommonButton";
import { Trans } from "translation/i18n";
import {
  getStatusMessageBox,
  getMessageData,
} from "redux/selectors/messageBoxSelectors";
import {
  toggleMessageBox,
  setMessageData,
} from "redux/actions/messageBoxActions";

const MessageBox = (props) => {
  const { t } = props;
  const dispatch = useDispatch();

  const r_statusMessageBox = useSelector(getStatusMessageBox);
  const r_messageData = useSelector(getMessageData);

  //#region Event
  const onCLose = () => {
    dispatch(toggleMessageBox(false));
  };

  const onConfirm = () => {
    dispatch(toggleMessageBox(false));
    r_messageData.callBackFunc();
  };

  const onCancel = () => {
    closeMessageBox();
  };
  //#endregion

  //#region Method
  const closeMessageBox = function () {
    dispatch(toggleMessageBox(false));
    //dispatch(setMessageData({}));
  };
  //#endregion

  return (
    <>
      <Modal
        className={"message-box-style " + r_messageData.style}
        backdrop={"static"}
        centered={true}
        scrollable={false}
        zIndex={2000}
        isOpen={r_statusMessageBox}
        toggle={() => closeMessageBox()}
      >
        <ModalHeader toggle={() => closeMessageBox()}>
          {r_messageData.title || ""}
        </ModalHeader>
        <ModalBody>{r_messageData.content || ""}</ModalBody>
        <ModalFooter>
          <CommonButton id="btnCloseMessageBox" onClick={onCLose}>
            {t("messageBox:button.close")}
          </CommonButton>
          <CommonButton id="btnConfirmMessageBox" onClick={onConfirm}>
            {t("messageBox:button.confirm")}
          </CommonButton>
          <CommonButton id="btnCancelMessageBox" onClick={onCancel}>
            {t("messageBox:button.cancel")}
          </CommonButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default withTranslation(["messageBox", "common"])(MessageBox);

export const showInfo =  (content, callBackFunc, title) => {
  let message = {
    title: title || <Trans ns="messageBox" name="messageBox:title.info" />,
    content: content,
    style: "info-message",
    callBackFunc: callBackFunc || null,
  };

  store.dispatch(toggleMessageBox(true));
  store.dispatch(setMessageData(message));

  let focus = setInterval(() => {
    try {
      document.getElementById("btnCloseMessageBox").focus();
      clearInterval(focus);
    } catch (error) {}
  }, 500);
};

export const showWarning = function (content, callBackFunc, title) {
  let message = {
    title: title || <Trans ns="messageBox" name="messageBox:title.warning" />,
    content: content,
    style: "warning-message",
    callBackFunc: callBackFunc || null,
  };

  store.dispatch(toggleMessageBox(true));
  store.dispatch(setMessageData(message));

  let focus = setInterval(() => {
    try {
      document.getElementById("btnCloseMessageBox").focus();
      clearInterval(focus);
    } catch (error) {}
  }, 500);
};

export const showConfirm = function (content, callBackFunc, title) {
  let message = {
    title: title || <Trans ns="messageBox" name="messageBox:title.confirm" />,
    content: content,
    style: "confirm-message",
    callBackFunc: callBackFunc || null,
  };

  store.dispatch(toggleMessageBox(true));
  store.dispatch(setMessageData(message));

  let focus = setInterval(() => {
    try {
      document.getElementById("btnConfirmMessageBox").focus();
      clearInterval(focus);
    } catch (error) {}
  }, 500);
};

export const showError = function (content, callBackFunc, title) {
  let message = {
    title: title || <Trans ns="messageBox" name="messageBox:title.error" />,
    content: content,
    style: "error-message",
    callBackFunc: callBackFunc || null,
  };

  store.dispatch(toggleMessageBox(true));
  store.dispatch(setMessageData(message));

  let focus = setInterval(() => {
    try {
      document.getElementById("btnCloseMessageBox").focus();
      clearInterval(focus);
    } catch (error) {}
  }, 500);
};
