import React, {useEffect} from "react";
import store from "redux/store";
import { useSelector } from "react-redux";
import { Modal } from "reactstrap";
import {
  getRegistrationCircleLoading,
} from "redux/selectors/circleLoadingSelectors";
import {
  setRegistrationCircleLoading,
} from "redux/actions/circleLoadingActions";

const CircleLoading = (props) => {
  const r_registration = useSelector(getRegistrationCircleLoading);

  return (
    <>
      <Modal
        className="circle-loading"
        autoFocus={false}
        backdrop={true}
        scrollable={false}
        fullscreen={true}
        zIndex={3000}
        isOpen={r_registration > 0 ? true : false}
      >
        <div className="dashed-loading"/>
      </Modal>
    </>
  );
};

export default CircleLoading;

export const showCircleLoading = () => {
  let registration = store.getState().circleLoading.registration;
  registration++;

  store.dispatch(setRegistrationCircleLoading(registration));
};

export const closeCircleLoading = () => {
  let registration = store.getState().circleLoading.registration;

  if (registration > 0){
    registration--;
  }

  store.dispatch(setRegistrationCircleLoading(registration));
};
