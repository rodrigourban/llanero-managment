import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd";
import { default as modalTypes } from "./Articles/";
import * as actions from "../store/actions/modal";

const MODAL_TYPES = {
  1: modalTypes.NewArticle,
  2: modalTypes.NewSell,
  3: modalTypes.NewStock,
  4: modalTypes.ListStock,
  5: modalTypes.Confirm,
  6: modalTypes.Detail,
  7: modalTypes.Image,
  8: modalTypes.UpdateOrder,
  9: modalTypes.NewUser,
  10: modalTypes.DeleteSale,
  11: modalTypes.TransferStock,
};

const CustomModal = (props) => {
  const dispatch = useDispatch();
  const modalID = useSelector((state) => state.modal.modalID);
  const isOpen = useSelector((state) => state.modal.isOpen);
  const modalTitle = useSelector((state) => state.modal.modalTitle);
  const SelectedModal = MODAL_TYPES[modalID];

  return (
    <Modal
      style={{ top: 20 }}
      title={modalTitle}
      visible={isOpen}
      onCancel={() => dispatch(actions.modalClose())}
      footer={null}
      okText="Aceptar"
      cancelText="Cancelar"
    >
      {modalID ? <SelectedModal></SelectedModal> : null}
    </Modal>
  );
};

export default CustomModal;
