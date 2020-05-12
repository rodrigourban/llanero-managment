import React from "react";
import { Form, InputNumber, Button, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { modalClose } from "../../store/actions/modal";
import { transferStock } from "../../store/actions/api";

const TransferStock = () => {
  const payload = useSelector((state) => state.modal.payload);
  const dataList = useSelector((state) => state.api.dataList);
  const [maxQuantity, setMaxQuantity] = React.useState(null);
  const [cost, setCost] = React.useState(null);
  const token = useSelector((state) => state.auth.token);
  const [quantity, setQuantity] = React.useState(null);
  const [data, setData] = React.useState(null);
  const pagination = useSelector((state) => state.api.pagination);
  const order = useSelector((state) => state.api.order);
  const filter = useSelector((state) => state.api.filter);
  const dispatch = useDispatch();

  if (dataList.results[payload.key] && !data) {
    let formatedData = [];
    dataList.results[payload.key].location.map((item) => {
      formatedData.push({ ...item });
    });
    setData(formatedData);
  }

  const handleSubmit = (values) => {
    const oposite = values.location ? 0 : 1;
    const origin = data[values.location].id;
    const destination = data[oposite].id;
    delete values.location;
    const formatedValues = {
      ...values,
      origin,
      destination,
    };
    console.log(formatedValues);
    dispatch(transferStock(formatedValues, token, {pagination, order, filter}));
    dispatch(modalClose());
  };

  const updateMaxQuantity = (val) => {
    setMaxQuantity(data[val].quantity);
  };

  return (
    <>
      <h2>Transferir stock</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="location"
          label="Ubicacion de origen"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Selecciona desde donde transferir!",
            },
          ]}
        >
          <Select
            placeholder="Por favor selecciona un stock"
            onChange={updateMaxQuantity}
          >
            {data
              ? data.map((item, key) => (
                  <Select.Option value={key} key={key}>
                    {item.body} - {item.quantity}
                  </Select.Option>
                ))
              : null}
          </Select>
        </Form.Item>
        <Form.Item
          label="Cantidad"
          name="quantity"
          rules={[
            {
              required: true,
              message: "Por favor ingresa una cantidad",
            },
          ]}
        >
          <InputNumber
            onChange={(e) => setQuantity(e)}
            min={0}
            max={
              dataList.results[payload.key]
                ? parseInt(
                    maxQuantity
                      ? maxQuantity
                      : dataList.results[payload.key].quantity
                  )
                : 5000
            }
            style={{ width: "100%" }}
          />
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

export default TransferStock;
