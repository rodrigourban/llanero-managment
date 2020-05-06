import React from "react";
import { message, Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalClose } from "../../store/actions/modal";
import * as apiActions from "../../store/actions/api";

const Confirm = (props) => {
  const dispatch = useDispatch();
  const payload = useSelector((state) => state.modal.payload);
  const token = useSelector((state) => state.auth.token);
  const error = useSelector((state) => state.api.error);

  const deleteArticle = () => {
    const newState =
      payload.type != 4 ? { status: false } : { is_active: false };
    dispatch(
      apiActions.updateElement(payload.type, payload.id, newState, token)
    );
    dispatch(modalClose());
    if (!error) message.success("Se ha borrado el articulo exitosamente", 1);
  };

  return (
    <>
      <h2>Borrar articulo</h2>
      <Typography style={{ marginBottom: "1rem" }}>
        ¿Estas seguro que deseas hacer esto?
      </Typography>
      <div>
        <Button onClick={() => dispatch(modalClose())}>Cancelar</Button>
        <Button
          type="primary"
          style={{ backgroundColor: "red", borderColor: "#ccc" }}
          onClick={() => deleteArticle()}
        >
          Confirmar
        </Button>
      </div>
    </>
  );
};
export default Confirm;
