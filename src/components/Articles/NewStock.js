import React from "react";
import { Form, InputNumber, Button, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createStock } from "../../store/actions/api";
import { modalClose } from "../../store/actions/modal";

const NewStock = (props) => {
  const payload = useSelector((state) => state.modal.payload);
  const dataList = useSelector((state) => state.api.dataList);
  const token = useSelector((state) => state.auth.token);
  const pagination = useSelector((state) => state.api.pagination);
  const order = useSelector((state) => state.api.order);
  const filter = useSelector((state) => state.api.filter);
  const [data, setData] = React.useState(null);
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    if (payload) {
      const data = { ...values, article: payload.id };
      dispatch(createStock(data, token, {pagination, order, filter}));
      dispatch(modalClose());
    }
  };

  if (dataList.results[payload.key] && !data) {
    setData(dataList.results[payload.key].location);
  }

  return (
    <>
      <h1>Agregar Stock</h1>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Ubicacion"
          name="location"
          rules={[
            {
              required: true,
              message: "Por favor ingresa una ubicacion",
            },
          ]}
        >
          <Select placeholder="Ubicacion">
            {data
              ? data.map((item, key) => (
                  <Select.Option value={item.id} key={key}>
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
          <InputNumber min={0} max={100000} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Costo"
          name="cost"
          rules={[
            {
              required: true,
              message: "Por favor ingresa un costo",
            },
          ]}
        >
          <InputNumber
            min={0}
            max={100000}
            step={0.1}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Crear
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default NewStock;
