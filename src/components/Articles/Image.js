import React from 'react';
import {useSelector} from 'react-redux'

const Image = () => {
  const payload = useSelector(state => state.modal.payload);
  return (
    <img src={payload} width="100%" height="100%"></img>
  )
}
export default Image;