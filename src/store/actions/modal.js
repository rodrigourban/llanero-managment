import * as actionTypes from './actionTypes';

export const modalOpen = (id, payload=null) => {
  return {
    type: actionTypes.MODAL_OPEN,
    modalID: id,
    payload: payload
  }
}

export const modalClose = () => {
  return {
    type: actionTypes.MODAL_CLOSE,
  }
}