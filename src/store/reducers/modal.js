import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  isOpen: false,
  modalID: null,
};

const modalOpen = (state, action) => {
  console.log("hola ", action);
  return updateObject(state, {
    isOpen: true,
    modalID: action.modalID,
    payload: action.payload,
  });
};
const modalClose = (state, action) => {
  return updateObject(state, {
    isOpen: false,
    modalID: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MODAL_OPEN:
      return modalOpen(state, action);
    case actionTypes.MODAL_CLOSE:
      return modalClose(state, action);
    default:
      return state;
  }
};

export default reducer;
