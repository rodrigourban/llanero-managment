import React, { useEffect } from "react";
import BaseRouter from "./routes";
import { useDispatch } from "react-redux";
import * as authActions from "./store/actions/auth";
import * as modalActions from "./store/actions/modal";
import "./App.css";
import Modal from "./components/Modal";

const App = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authActions.authCheckState());
  });
  return (
    <>
      <Modal />
      <BaseRouter></BaseRouter>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    username: state.auth.username,
    isAdmin: state.auth.admin,
    modalOpen: state.modal.isOpen,
    modalID: state.modal.modalID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(authActions.authCheckState()),
    onModalClose: () => dispatch(modalActions.modalClose()),
  };
};
export default App;
