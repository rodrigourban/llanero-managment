import React from "react";
import { Form, Radio, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { modalClose } from "../../store/actions/modal";
import { updateElement } from "../../store/actions/api";

const UpdateOrder = () => {
  const payload = useSelector((state) => state.modal.payload);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const pagination = useSelector((state) => state.api.pagination);
  const order = useSelector((state) => state.api.order);
  const filter = useSelector((state) => state.api.filter);

  const handleSubmit = (values) => {
    dispatch(updateElement(2, payload.id, values, {pagination, order, filter}));
    dispatch(modalClose());
  };

  return (
    <>
      <h2>Cambiar estado de Pedido</h2>
      {payload.name ? (
        <>
          <p>Pedido: {payload.name}</p>
          <p>Estado actual: {payload.state}</p>
        </>
      ) : null}
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item name="state">
          <Radio.Group>
            <Radio value="BORRADO">BORRADO</Radio>
            <Radio value="PENDIENTE">PENDIENTE</Radio>
            <Radio value="PEDIDO">PEDIDO</Radio>
            <Radio value="LLEGO">LLEGO</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Aceptar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UpdateOrder;
