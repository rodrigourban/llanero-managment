import React from "react";
import { message, Button, Typography, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalClose } from "../../store/actions/modal";
import * as apiActions from "../../store/actions/api";

const DeleteSale = () => {
  const [checked, setChecked] = React.useState(false);
  const payload = useSelector((state) => state.modal.payload);
  const token = useSelector((state) => state.auth.token);
  const error = useSelector((state) => state.api.error);
  const dispatch = useDispatch();

  const deleteArticle = () => {
    const newState = {
      status: false,
    };
    if (checked) newState.returnStock = true;
    dispatch(
      apiActions.updateElement(payload.type, payload.id, newState, token)
    );
    dispatch(modalClose());
    if (!error) message.success("Se ha cancelado la venta exitosamente", 1);
  };

  const onChange = () => {
    setChecked(!checked);
  };

  return (
    <>
      <h2>Cancelar venta</h2>
      <Typography style={{ marginBottom: "1rem" }}>
        ¿Estas seguro que deseas cancelar esta venta?
      </Typography>
      <Checkbox checked={checked} onChange={onChange}>
        Devolver stock
      </Checkbox>
      <div>
        <Button onClick={() => dispatch(modalClose())}>Cancelar</Button>
        <Button
          type="primary"
          style={{ backgroundColor: "red", borderColor: "#ccc" }}
          onClick={() => deleteArticle()}
        >
          Continuar
        </Button>
      </div>
    </>
  );
};
export default DeleteSale;
